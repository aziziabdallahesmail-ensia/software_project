import { getDoctorById } from "@/actions/doctor";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* Hallmark · design-system: design.md
 * The page's own <h1> lives in DoctorProfile; this shell contributes only the
 * back affordance, so the document keeps a single top-level heading. */

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { doctor } = await getDoctorById(id);
  return {
    title: `Dr. ${doctor.full_name} - Spécialiste en ${doctor.specialty}`,
    description: `Prenez rendez-vous avec Dr. ${doctor.full_name}, spécialiste en ${doctor.specialty} avec ${doctor.experience} ans d'expérience.`,
  };
}

export default async function DoctorProfileLayout({
  children,
  params,
}: LayoutProps) {
  const { id } = await params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/list_doctors");

  return (
    <div>
      <Link
        href={`/list_doctors/${doctor.specialty}`}
        className="mb-6 inline-flex items-center gap-1.5 whitespace-nowrap rounded text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {doctor.specialty}
      </Link>
      {children}
    </div>
  );
}
