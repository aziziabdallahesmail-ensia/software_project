"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getDoctorProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  return profile;
}

export async function updateDoctorProfile(formData: {
  specialty: string;
  experience: number;
  description: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        specialty: formData.specialty,
        experience: formData.experience,
        description: formData.description,
        role: "doctor", // ensure role is doctor
      },
    });
    revalidatePath("/doctor/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function submitVerificationDocument(credentialUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        credentialUrl,
        verificationStatus: "pending",
      },
    });
    revalidatePath("/doctor/verification");
    return { success: true };
  } catch (error) {
    console.error("Error submitting verification:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}

export async function setAvailability(slots: { startTime: Date; endTime: Date }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { isActive: true },
  });

  if (!profile?.isActive) {
    return { success: false, error: "Account is suspended" };
  }

  try {
    // multiple availability slots
    await prisma.availability.createMany({
      data: slots.map((slot) => ({
        doctorId: user.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "available",
      })),
    });
    revalidatePath("/doctor/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error setting availability:", error);
    return { success: false, error: "Failed to set availability" };
  }
}

export async function getDoctorAppointments(date?: Date) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const whereClause: any = {
    doctorId: user.id,
  };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    whereClause.startTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      patient: {
        select: {
          full_name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return appointments;
}

export async function getDoctorAvailability(date?: Date) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const whereClause: any = {
    doctorId: user.id,
  };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    whereClause.startTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const availability = await prisma.availability.findMany({
    where: whereClause,
    orderBy: {
      startTime: "asc",
    },
  });

  return availability;
}

export async function deleteAvailabilitySlot(slotId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // ensure slot belong to doctor
    const slot = await prisma.availability.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.doctorId !== user.id) {
      throw new Error("Slot not found or unauthorized");
    }

    await prisma.availability.delete({
      where: { id: slotId },
    });
    revalidatePath("/doctor/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting availability:", error);
    return { success: false, error: "Failed to delete slot" };
  }
}
