import { NextResponse } from "next/server";
import {
  updateDoctorProfile,
  submitVerificationDocument,
  setAvailability,
  getDoctorProfile,
  getDoctorAvailability,
  getDoctorAppointments
} from "@/app/actions/doctor";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const results: any = {};

    // 1. Update profile
    console.log("Testing updateDoctorProfile...");
    const updateResult = await updateDoctorProfile({
      specialty: "Test Specialist",
      experience: 5,
      description: "This is a test description from the backend test route."
    });
    results.updateProfile = updateResult;

    // 2. Submit verification
    console.log("Testing submitVerificationDocument...");
    const verifyResult = await submitVerificationDocument("https://example.com/fake-doc.pdf");
    results.submitVerification = verifyResult;

    // 3. Set availability
    console.log("Testing setAvailability...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(10, 0, 0, 0);

    const availabilityResult = await setAvailability([
      { startTime: tomorrow, endTime: tomorrowEnd }
    ]);
    results.setAvailability = availabilityResult;

    // 4. Get profile (Verification)
    console.log("Testing getDoctorProfile...");
    const profile = await getDoctorProfile();
    results.getProfile = profile;

    // 5. Get availability (Verification)
    console.log("Testing getDoctorAvailability...");
    const availability = await getDoctorAvailability();
    results.getAvailability = availability;

    // 6. Get appointments
    console.log("Testing getDoctorAppointments...");
    const appointments = await getDoctorAppointments();
    results.getAppointments = appointments;

    return NextResponse.json({
      message: "Doctor backend tests completed",
      results
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
