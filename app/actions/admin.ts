"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPendingDoctors() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    // verify admin role
    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    const pendingDoctors = await prisma.profile.findMany({
        where: {
            role: "doctor",
            verificationStatus: "pending",
        },
        select: {
            id: true,
            email: true,
            full_name: true,
            specialty: true,
            experience: true,
            credentialUrl: true,
            description: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return pendingDoctors;
}

export async function approveDoctorVerification(doctorId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    try {
        // set status verified
        await prisma.profile.update({
            where: { id: doctorId, role: "doctor" },
            data: {
                verificationStatus: "verified",
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error approving doctor:", error);
        return { success: false, error: "Failed to approve doctor" };
    }
}

export async function rejectDoctorVerification(doctorId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    try {
        // set status rejected
        await prisma.profile.update({
            where: { id: doctorId, role: "doctor" },
            data: {
                verificationStatus: "rejected",
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error rejecting doctor:", error);
        return { success: false, error: "Failed to reject doctor" };
    }
}

export async function getActiveDoctors() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    const activeDoctors = await prisma.profile.findMany({
        where: {
            role: "doctor",
            verificationStatus: "verified",
        },
        select: {
            id: true,
            email: true,
            full_name: true,
            specialty: true,
            experience: true,
            description: true,
            createdAt: true,
            // include stats
            _count: {
                select: {
                    doctorAppointments: true,
                    availabilities: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return activeDoctors;
}

export async function getAllDoctors() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    const allDoctors = await prisma.profile.findMany({
        where: {
            role: "doctor",
        },
        select: {
            id: true,
            email: true,
            full_name: true,
            specialty: true,
            experience: true,
            verificationStatus: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return allDoctors;
}

export async function suspendDoctor(doctorId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    try {
        // deactivate account
        await prisma.profile.update({
            where: { id: doctorId, role: "doctor" },
            data: {
                isActive: false,
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error suspending doctor:", error);
        return { success: false, error: "Failed to suspend doctor" };
    }
}

export async function activateDoctor(doctorId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    try {
        // reactivate account
        await prisma.profile.update({
            where: { id: doctorId, role: "doctor" },
            data: {
                isActive: true,
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error activating doctor:", error);
        return { success: false, error: "Failed to activate doctor" };
    }
}

export async function promoteDoctor(doctorId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    try {
        // mark as featured
        await prisma.profile.update({
            where: { id: doctorId, role: "doctor" },
            data: {
                isFeatured: true,
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error promoting doctor:", error);
        return { success: false, error: "Failed to promote doctor" };
    }
}

export async function unpromoteDoctor(doctorId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id },
    });

    if (adminProfile?.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    try {
        // remove featured
        await prisma.profile.update({
            where: { id: doctorId, role: "doctor" },
            data: {
                isFeatured: false,
            },
        });

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error unpromoting doctor:", error);
        return { success: false, error: "Failed to unpromote doctor" };
    }
}

