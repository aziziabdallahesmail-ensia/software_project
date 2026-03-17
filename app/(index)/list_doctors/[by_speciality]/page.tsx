/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctor";
import { DoctorCard } from "../components/doctor_card";
import { Stethoscope, Users, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ by_speciality: string }>;
}

export default async function DoctorSpecialtyPage({ params }: PageProps) {
  const { by_speciality: specialty } = await params;

  if (!specialty) {
    redirect("/list_doctors");
  }

  const decodedSpecialty = decodeURIComponent(specialty);
  const { doctors, error } = await getDoctorsBySpecialty(decodedSpecialty);

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="grid gap-8 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-10">
          <div className="space-y-5">
            <Link
              href="/list_doctors"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux spécialités
            </Link>
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Spécialité sélectionnée
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
                {decodedSpecialty}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                Retrouvez les médecins vérifiés de cette spécialité et accédez
                à leur profil pour réserver un rendez-vous en quelques étapes.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <SummaryCard
              icon={Users}
              title={`${doctors?.length || 0} médecin${(doctors?.length || 0) > 1 ? "s" : ""}`}
              description="Disponibles dans cette spécialité"
            />
            <SummaryCard
              icon={Stethoscope}
              title="Profils vérifiés"
              description="Présentés avec une interface plus claire et plus sereine"
            />
          </div>
        </div>
      </section>

      {doctors && doctors.length > 0 ? (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Médecins disponibles
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sélectionnez le praticien qui correspond à votre besoin.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[2rem] border border-emerald-100/80 bg-white/90 p-8 text-center shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70 md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Search className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Aucun médecin disponible
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Il n&apos;y a actuellement aucun médecin vérifié dans cette
            spécialité. Vous pouvez revenir à la liste générale et explorer une
            autre spécialité.
          </p>
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
