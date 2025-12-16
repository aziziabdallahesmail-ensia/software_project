import { getDoctorAppointments, getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";


export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();

  const [appointments, availability] =
  await Promise.all([
      getDoctorAppointments(),
      getDoctorAvailability(),
    ]);

  //  Redirect if not a doctor
  if (user?.role !== "doctor") {
    redirect("/role-selection");
  }

  // If already verified, redirect to dashboard
  if (user?.verificationStatus !== "verified") {
    redirect("/doctor/still-in-verification");
  }

  return (
    

  );
}