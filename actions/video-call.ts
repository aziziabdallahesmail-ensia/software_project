"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  generateVideoToken,
  createTwilioRoom,
  completeTwilioRoom,
  getTwilioRoom,
} from "@/lib/twilio";

/**
 * Video Call Server Actions
 * Handles all video call business logic with authentication and authorization
 */

/**
 * Get appointment details with authorization check
 * Verifies the current user is either the doctor or patient of the appointment
 */
export async function getAppointmentForVideoCall(appointmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      doctor: {
        select: {
          id: true,
          full_name: true,
          specialty: true,
        },
      },
      patient: {
        select: {
          id: true,
          full_name: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Authorization check: user must be doctor or patient
  if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
    throw new Error("Unauthorized: You are not a participant of this appointment");
  }

  return appointment;
}

/**
 * Initialize video call - creates Twilio room and generates access token
 * This is called when a user clicks "Join Call"
 */
export async function initializeVideoCall(appointmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Get and verify appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      doctor: {
        select: {
          id: true,
          full_name: true,
          specialty: true,
        },
      },
      patient: {
        select: {
          id: true,
          full_name: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Authorization check
  const isDoctor = appointment.doctorId === user.id;
  const isPatient = appointment.patientId === user.id;

  if (!isDoctor && !isPatient) {
    throw new Error("Unauthorized: You are not a participant of this appointment");
  }

  // Check appointment status
  if (appointment.status !== "scheduled") {
    throw new Error(
      `Cannot join call: Appointment is ${appointment.status}. Only scheduled appointments can be joined.`
    );
  }

  // Time window validation: Allow joining 10 minutes before to 30 minutes after appointment
  const now = new Date();
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);

  const startBuffer = new Date(startTime);
  startBuffer.setMinutes(startBuffer.getMinutes() - 10);

  const endBuffer = new Date(endTime);
  endBuffer.setMinutes(endBuffer.getMinutes() + 30);

  if (now < startBuffer) {
    const minutesUntil = Math.floor(
      (startBuffer.getTime() - now.getTime()) / 60000
    );
    throw new Error(
      `Call not available yet. You can join ${minutesUntil} minutes before the scheduled time.`
    );
  }

  if (now > endBuffer) {
    throw new Error(
      "Call window has expired. Please contact support if you need to reschedule."
    );
  }

  // Create or get existing Twilio room
  let roomSid = appointment.videoRoomSid;
  let roomName = appointment.videoRoomName;

  if (!roomSid || !roomName) {
    // Room doesn't exist yet, create it
    roomName = `appointment_${appointmentId}_${Date.now()}`;

    console.log("=== VIDEO CALL INIT DEBUG ===");
    console.log("Creating Twilio room with type: group");
    console.log("Room name:", roomName);
    console.log("============================");

    try {
      const room = await createTwilioRoom(roomName, "group");
      console.log("✅ Room created successfully:", room.sid);
      roomSid = room.sid;

      // Save room details to database
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          videoRoomName: roomName,
          videoRoomSid: roomSid,
        },
      });
    } catch (error: any) {
      console.error("Error creating Twilio room:", error);
      throw new Error("Failed to create video room. Please try again.");
    }
  }

  // Generate access token for this user
  const userRole = isDoctor ? "doctor" : "patient";
  const identity = `${userRole}_${user.id}`;

  let token: string;
  try {
    token = generateVideoToken({ identity, roomName });
  } catch (error: any) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate access token. Please check Twilio credentials.");
  }

  // Record participant join time
  const updateData: any = {};
  if (isDoctor) {
    updateData.doctorJoinedAt = new Date();
  } else {
    updateData.patientJoinedAt = new Date();
  }

  // If both participants have joined, mark call as started
  if (
    (isDoctor && appointment.patientJoinedAt) ||
    (isPatient && appointment.doctorJoinedAt)
  ) {
    updateData.callStartedAt = new Date();
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: updateData,
  });

  return {
    token,
    roomName,
    roomSid,
    appointment: {
      id: appointment.id,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      doctor: appointment.doctor,
      patient: appointment.patient,
    },
    userRole,
  };
}

/**
 * End video call - completes Twilio room and updates appointment
 */
export async function endVideoCall(appointmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Get appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Authorization check
  if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Complete Twilio room if it exists
  if (appointment.videoRoomSid) {
    try {
      await completeTwilioRoom(appointment.videoRoomSid);
    } catch (error) {
      console.error("Error completing Twilio room:", error);
      // Continue even if Twilio fails - we still want to update our database
    }
  }

  // Calculate call duration
  const callEndedAt = new Date();
  let callDurationMinutes = 0;

  if (appointment.callStartedAt) {
    const durationMs =
      callEndedAt.getTime() - new Date(appointment.callStartedAt).getTime();
    callDurationMinutes = Math.floor(durationMs / 60000); // Convert to minutes
  }

  // Update appointment
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      callEndedAt,
      callDurationMinutes,
      status: "completed",
    },
  });

  revalidatePath("/appointments");
  revalidatePath("/doctor");

  return {
    success: true,
    callDurationMinutes,
    appointment: updatedAppointment,
  };
}

/**
 * Get current video call status
 * Returns information about the ongoing call
 */
export async function getVideoCallStatus(appointmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      doctor: {
        select: {
          id: true,
          full_name: true,
        },
      },
      patient: {
        select: {
          id: true,
          full_name: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Authorization check
  if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
    throw new Error("Unauthorized");
  }

  // Get Twilio room status if room exists
  let twilioRoomStatus = null;
  if (appointment.videoRoomSid) {
    try {
      twilioRoomStatus = await getTwilioRoom(appointment.videoRoomSid);
    } catch (error) {
      console.error("Error fetching Twilio room:", error);
    }
  }

  return {
    appointment: {
      id: appointment.id,
      status: appointment.status,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      doctorJoinedAt: appointment.doctorJoinedAt,
      patientJoinedAt: appointment.patientJoinedAt,
      callStartedAt: appointment.callStartedAt,
      callEndedAt: appointment.callEndedAt,
      callDurationMinutes: appointment.callDurationMinutes,
      doctor: appointment.doctor,
      patient: appointment.patient,
    },
    twilioRoom: twilioRoomStatus,
    userRole:
      appointment.doctorId === user.id ? "doctor" : "patient",
  };
}

/**
 * Check if user can join the call
 * Returns eligibility status with reason if not eligible
 */
export async function canJoinVideoCall(appointmentId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { canJoin: false, reason: "Not authenticated" };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return { canJoin: false, reason: "Appointment not found" };
    }

    // Authorization check
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      return { canJoin: false, reason: "Unauthorized" };
    }

    // Status check
    if (appointment.status !== "scheduled") {
      return {
        canJoin: false,
        reason: `Appointment is ${appointment.status}`,
      };
    }

    // Time window check
    const now = new Date();
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);

    const startBuffer = new Date(startTime);
    startBuffer.setMinutes(startBuffer.getMinutes() - 10);

    const endBuffer = new Date(endTime);
    endBuffer.setMinutes(endBuffer.getMinutes() + 30);

    if (now < startBuffer) {
      const minutesUntil = Math.floor(
        (startBuffer.getTime() - now.getTime()) / 60000
      );
      return {
        canJoin: false,
        reason: `Available in ${minutesUntil} minutes`,
      };
    }

    if (now > endBuffer) {
      return { canJoin: false, reason: "Call window expired" };
    }

    return { canJoin: true, reason: null };
  } catch (error: any) {
    return { canJoin: false, reason: error.message };
  }
}
