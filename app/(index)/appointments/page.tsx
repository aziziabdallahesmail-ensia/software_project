import { getPatientAppointments } from "@/actions/patient";
import { PageTitle } from "@/components/page-title";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/set_user_role";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "patient") {
    redirect("/role-selection");
  }

  const appointments = await getPatientAppointments();

  return (
      <PageTitle title="Patient Appointments" />
  );
}