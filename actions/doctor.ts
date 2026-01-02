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

export async function setAvailability(formData: FormData) {
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
    // Parse form data
    const startTimeStr = formData.get("startTime") as string;
    const endTimeStr = formData.get("endTime") as string;

    if (!startTimeStr || !endTimeStr) {
      return { success: false, error: "Start time and end time are required" };
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    // Validate dates
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { success: false, error: "Invalid date format" };
    }

    if (startTime >= endTime) {
      return { success: false, error: "End time must be after start time" };
    }

    // Create availability slot
    await prisma.availability.create({
      data: {
        doctorId: user.id,
        startTime: startTime,
        endTime: endTime,
        status: "available",
      },
    });

    revalidatePath("/doctor");
    return { success: true };
  } catch (error) {
    console.error("Error setting availability:", error);
    return { success: false, error: "Failed to set availability" };
  }
}

export async function getDoctorAppointments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const whereClause: any = {
    doctorId: user.id,
  };

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

  return {appointments};
}

export async function cancelAppointment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const appointmentId = formData.get("appointmentId") as string;

  if (!appointmentId) {
    return { success: false, error: "Appointment ID is required" };
  }

  try {
    // Find the appointment and verify ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    // Check if user is the doctor or patient of this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      return { success: false, error: "Unauthorized to cancel this appointment" };
    }

    // Update appointment status to cancelled
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "cancelled" },
    });

    // If there's an associated availability slot, set it back to available
    await prisma.availability.updateMany({
      where: {
        doctorId: appointment.doctorId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: "booked",
      },
      data: { status: "available" },
    });

    revalidatePath("/appointments");
    revalidatePath("/doctor");
    return { success: true };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return { success: false, error: "Failed to cancel appointment" };
  }
}

export async function addAppointmentNotes(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const appointmentId = formData.get("appointmentId") as string;
  const notes = formData.get("notes") as string;

  if (!appointmentId) {
    return { success: false, error: "Appointment ID is required" };
  }

  try {
    // Find the appointment and verify doctor ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    // Only the doctor can add notes
    if (appointment.doctorId !== user.id) {
      return { success: false, error: "Only the doctor can add notes" };
    }

    // Update appointment with notes
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { notes },
    });

    revalidatePath("/appointments");
    revalidatePath("/doctor");
    return { success: true };
  } catch (error) {
    console.error("Error adding notes:", error);
    return { success: false, error: "Failed to add notes" };
  }
}

export async function markAppointmentCompleted(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const appointmentId = formData.get("appointmentId") as string;

  if (!appointmentId) {
    return { success: false, error: "Appointment ID is required" };
  }

  try {
    // Find the appointment and verify doctor ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    // Only the doctor can mark as completed
    if (appointment.doctorId !== user.id) {
      return { success: false, error: "Only the doctor can mark appointments as completed" };
    }

    // Check if the appointment end time has passed
    const now = new Date();
    if (now < appointment.endTime) {
      return { success: false, error: "Cannot mark appointment as completed before end time" };
    }

    // Update appointment status to completed
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "completed" },
    });

    revalidatePath("/appointments");
    revalidatePath("/doctor");
    return { success: true };
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    return { success: false, error: "Failed to mark appointment as completed" };
  }
}

export async function getDoctorAvailability() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const whereClause: any = {
    doctorId: user.id,
  };


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

export async function getDoctorsBySpecialty(specialty: string) {
  try {
    const doctors = await prisma.profile.findMany({
      where: {
        role: "doctor",
        verificationStatus: "verified",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        full_name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.error("errror  fetching doctors", error);
    return { error: "error fetching doctors" };
  }
}


export async function getDoctorById(doctorId: string) {
  try {
    const doctor = await prisma.profile.findUnique({
      where: {
        id: doctorId,
        role: "doctor",
        verificationStatus: "verified",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    return { doctor };
  } catch (error) {
    console.error("error fetching doctor", error);
    throw new Error("error fetching doctor information");
  }
}


export async function getAvailableTimeSlots(doctorId: string) {
  // Helper functions to replace date-fns
  function addDaysNative(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function addMinutesNative(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  function endOfDayNative(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function formatDisplayDate(date: Date): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }

  try {
    // Validate doctor existence and verification
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

    // Fetch a single availability record
    const availability = await prisma.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "available",
      },
    });

    if (!availability) {
      throw new Error("No availability found for this doctor");
    }

    // Get the next 4 days
    const now = new Date();
    const days = [now, addDaysNative(now, 1), addDaysNative(now, 2), addDaysNative(now, 3)];

    // Fetch existing appointments for the doctor over the next 4 days
    const lastDay = endOfDayNative(days[3]);
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "scheduled",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availableSlotsByDay: Record<string, Array<{
      startTime: string;
      endTime: string;
      formatted: string;
      day: string;
    }>> = {};

    // For each of the next 4 days, generate available slots
    for (const day of days) {
      const dayString = formatDateKey(day);
      availableSlotsByDay[dayString] = [];

      // Create a copy of the availability start/end times for this day
      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      // Set the day to the current day we're processing
      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );
      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        addMinutesNative(current, 30) <= end
      ) {
        const next = addMinutesNative(current, 30);

        // Skip past slots
        if (current < now) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${formatTime(current)} - ${formatTime(next)}`,
            day: formatDisplayDate(current),
          });
        }

        current = next;
      }
    }

    // Convert to array of slots grouped by day for easier consumption by the UI
    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : formatDisplayDate(new Date(date)),
      slots,
    }));

    return { days: result };
  } catch (error: any) {
    console.error("Failed to fetch available slots:", error);
    throw new Error("Failed to fetch available time slots: " + error.message);
  }
}




