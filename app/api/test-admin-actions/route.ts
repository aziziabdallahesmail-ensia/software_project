import { NextResponse } from "next/server";
import {
    getPendingDoctors,
    approveDoctorVerification,
    rejectDoctorVerification,
    getActiveDoctors,
    getAllDoctors,
    suspendDoctor,
    activateDoctor,
    promoteDoctor,
    unpromoteDoctor,
} from "@/app/actions/admin";

export async function GET() {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const results: any = {};

        // 1. Get pending doctors
        console.log("Testing getPendingDoctors...");
        const pendingDoctors = await getPendingDoctors();
        results.pendingDoctors = pendingDoctors;

        if (pendingDoctors.length > 0) {
            const doctorId = pendingDoctors[0].id;

            // 2. Approve doctor
            console.log("Testing approveDoctorVerification...");
            const approveResult = await approveDoctorVerification(doctorId);
            results.approveDoctorVerification = approveResult;

            // 3. Reject doctor
            if (pendingDoctors.length > 1) {
                console.log("Testing rejectDoctorVerification...");
                const rejectResult = await rejectDoctorVerification(pendingDoctors[1].id);
                results.rejectDoctorVerification = rejectResult;
            } else {
                results.rejectDoctorVerification = "Skipped: Only one pending doctor";
            }
        } else {
            results.approveDoctorVerification = "Skipped: No pending doctors";
            results.rejectDoctorVerification = "Skipped: No pending doctors";
        }

        // 4. Get active doctors
        console.log("Testing getActiveDoctors...");
        const activeDoctors = await getActiveDoctors();
        results.activeDoctors = activeDoctors;

        // 5. Get all doctors
        console.log("Testing getAllDoctors...");
        const allDoctors = await getAllDoctors();
        results.allDoctors = allDoctors;

        // 6. Test suspend/activate
        if (activeDoctors.length > 0) {
            const testDoctorId = activeDoctors[0].id;

            console.log("Testing suspendDoctor...");
            const suspendResult = await suspendDoctor(testDoctorId);
            results.suspendDoctor = suspendResult;

            console.log("Testing activateDoctor...");
            const activateResult = await activateDoctor(testDoctorId);
            results.activateDoctor = activateResult;
        } else {
            results.suspendDoctor = "Skipped: No active doctors";
            results.activateDoctor = "Skipped: No active doctors";
        }

        // 7. Test promote/unpromote
        if (activeDoctors.length > 0) {
            const testDoctorId = activeDoctors[0].id;

            console.log("Testing promoteDoctor...");
            const promoteResult = await promoteDoctor(testDoctorId);
            results.promoteDoctor = promoteResult;

            console.log("Testing unpromoteDoctor...");
            const unpromoteResult = await unpromoteDoctor(testDoctorId);
            results.unpromoteDoctor = unpromoteResult;
        } else {
            results.promoteDoctor = "Skipped: No active doctors";
            results.unpromoteDoctor = "Skipped: No active doctors";
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Test failed:", error);
        return NextResponse.json(
            { success: false, error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
