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

export async function bookAppointment(slotId: string, patientDescription: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        // transaction 
        const result = await prisma.$transaction(async (tx) => {
            // 1 get the slot and lock it
            const slot = await tx.availability.findUnique({
                where: { id: slotId },
            });

            if (!slot || slot.status !== "available") {
                throw new Error("Slot is no longer available");
            }

            // 2 create the appointment
            const appointment = await tx.appointment.create({
                data: {
                    patientId: user.id,
                    doctorId: slot.doctorId,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    patientDescription,
                    status: "scheduled",
                },
            });

            // 3 update slot status
            await tx.availability.update({
                where: { id: slotId },
                data: { status: "booked" },
            });

            return appointment;
        });

        revalidatePath("/patient/dashboard");
        revalidatePath(`/doctor/${result.doctorId}`); // Revalidate doctor page
        return { success: true, appointmentId: result.id };
    } catch (error: any) {
        console.error("Error booking appointment:", error);
        return { success: false, error: error.message || "Failed to book appointment" };
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
