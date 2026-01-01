import { getDoctorById } from "@/actions/doctor";
import { PageTitle } from "@/components/page-title";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { doctor } = await getDoctorById(id);
  return {
    title: `Dr. ${doctor.full_name} - Spécialiste en ${doctor.specialty}`,
    description: `Prenez rendez-vous avec Dr. ${doctor.full_name}, spécialiste en ${doctor.specialty} avec ${doctor.experience} ans d'expérience.`,
  };
}

export default async function DoctorProfileLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/doctors");

  return (
    <div className="container mx-auto">
      <PageTitle
        title={`Dr. ${doctor.full_name}`}
      />

      {children}
    </div>
  );
}