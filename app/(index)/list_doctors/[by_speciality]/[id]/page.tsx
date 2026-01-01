import { getDoctorById, getAvailableTimeSlots } from "@/actions/doctor";
import { DoctorProfile } from "./_components/doctor-profile";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { id } = await params;

  try {
    // Fetch doctor data and available slots in parallel
    const [doctorData, slotsData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id),
    ]);

    // Transform doctor data to match the expected interface
    const doctor = {
      id: doctorData.doctor.id,
      full_name: doctorData.doctor.full_name ?? undefined,
      specialty: doctorData.doctor.specialty ?? "",
      experience: doctorData.doctor.experience ?? 0,
      description: doctorData.doctor.description ?? "",
      imageUrl: undefined,
    };

    return (
      <DoctorProfile
        doctor={doctor}
        availableDays={slotsData.days || []}
      />
    );
  } catch (error) {
    console.error("Error loading doctor profile:", error);
    redirect("/doctors");
  }
}