import { NextResponse } from "next/server";
import {
    searchDoctors,
    getDoctorPublicProfile,
    getDoctorAvailableSlots,
    bookAppointment,
    getPatientAppointments,
} from "@/actions/patient";

export async function GET() {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const results: any = {};

        // 1. Search Doctors
        console.log("Testing searchDoctors...");
        const doctors = await searchDoctors({ query: "" }); // Empty query to get all or some
        results.searchDoctors = doctors;

        if (doctors.length > 0) {
            const doctorId = doctors[0].id;

            // 2. Get Doctor Profile
            console.log("Testing getDoctorPublicProfile...");
            const profile = await getDoctorPublicProfile(doctorId);
            results.getDoctorProfile = profile;

            // 3. Get Available Slots
            console.log("Testing getDoctorAvailableSlots...");
            const slots = await getDoctorAvailableSlots(doctorId);
            results.getAvailableSlots = slots;

            if (slots.length > 0) {
                const slotId = slots[0].id;

                // 4. Book Appointment
                console.log("Testing bookAppointment...");
                const booking = await bookAppointment(slotId, "Test appointment description");
                results.bookAppointment = booking;
            } else {
                results.bookAppointment = "Skipped: No slots available";
            }
        } else {
            results.getDoctorProfile = "Skipped: No doctors found";
            results.getAvailableSlots = "Skipped: No doctors found";
            results.bookAppointment = "Skipped: No doctors found";
        }

        // 5. Get Patient Appointments
        console.log("Testing getPatientAppointments...");
        const myAppointments = await getPatientAppointments();
        results.getPatientAppointments = myAppointments;

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Test failed:", error);
        return NextResponse.json(
            { success: false, error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
