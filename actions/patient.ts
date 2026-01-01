"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function searchDoctors(params: {
    query?: string;
    specialty?: string;
}) {
    const { query, specialty } = params;

    const whereClause: any = {
        role: "doctor",
        verificationStatus: "verified",
        isActive: true, // only active doctors
    };

    if (specialty) {
        whereClause.specialty = {
            contains: specialty,
            mode: "insensitive",
        };
    }

    if (query) {
        whereClause.OR = [
            { full_name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ];
    }

    const doctors = await prisma.profile.findMany({
        where: whereClause,
        select: {
            id: true,
            full_name: true,
            specialty: true,
            description: true,
            experience: true,
            credentialUrl: true,
            isFeatured: true,
        },
        orderBy: [
            { isFeatured: "desc" },
            { createdAt: "desc" },
        ],
    });

    return doctors;
}

export async function getDoctorPublicProfile(doctorId: string) {
    const doctor = await prisma.profile.findUnique({
        where: { id: doctorId, role: "doctor" },
        select: {
            id: true,
            full_name: true,
            specialty: true,
            description: true,
            experience: true,
        },
    });

    return doctor;
}

export async function getDoctorAvailableSlots(doctorId: string, date?: Date) {
    const whereClause: any = {
        doctorId,
        status: "available",
        startTime: {
            gte: new Date(), // only future slots
        },
    };

    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        whereClause.startTime = {
            ...whereClause.startTime,
            gte: startOfDay > new Date() ? startOfDay : new Date(),
            lte: endOfDay,
        };
    }

    const slots = await prisma.availability.findMany({
        where: whereClause,
        orderBy: {
            startTime: "asc",
        },
    });

    return slots;
}

export async function bookAppointment(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        // Get the patient user
        const patient = await prisma.profile.findUnique({
            where: {
                id: user.id,
                role: "patient",
            },
        });

        if (!patient) {
            throw new Error("Patient not found");
        }

        // Parse form data
        const doctorId = formData.get("doctorId") as string;
        const startTime = new Date(formData.get("startTime") as string);
        const endTime = new Date(formData.get("endTime") as string);
        const patientDescription = (formData.get("description") as string) || null;

        // Validate input
        if (!doctorId || !startTime || !endTime) {
            throw new Error("Doctor, start time, and end time are required");
        }

        // Check if the doctor exists and is verified
        const doctor = await prisma.profile.findUnique({
            where: {
                id: doctorId,
                role: "doctor",
                verificationStatus: "verified",
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found or not verified");
        }

        // Check if the requested time slot is available
        const overlappingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: doctorId,
                status: "scheduled",
                OR: [
                    {
                        // New appointment starts during an existing appointment
                        startTime: {
                            lte: startTime,
                        },
                        endTime: {
                            gt: startTime,
                        },
                    },
                    {
                        // New appointment ends during an existing appointment
                        startTime: {
                            lt: endTime,
                        },
                        endTime: {
                            gte: endTime,
                        },
                    },
                    {
                        // New appointment completely overlaps an existing appointment
                        startTime: {
                            gte: startTime,
                        },
                        endTime: {
                            lte: endTime,
                        },
                    },
                ],
            },
        });

        if (overlappingAppointment) {
            throw new Error("This time slot is already booked");
        }

        // Create the appointment
        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                startTime,
                endTime,
                patientDescription,
                status: "scheduled",
            },
        });

        revalidatePath("/appointments");
        return { success: true, appointment: appointment };
    } catch (error: any) {
        console.error("Failed to book appointment:", error);
        throw new Error("Failed to book appointment: " + error.message);
    }
}

export async function getPatientAppointments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            patientId: user.id,
        },
        include: {
            doctor: {
                select: {
                    id: true,
                    full_name: true,
                    specialty: true,
                },
            },
        },
        orderBy: {
            startTime: "desc",
        },
    });

    return appointments;
}
