/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { Stethoscope, CalendarRange, Clock3, BadgeCheck, UserRound } from "lucide-react";
import { SetAvailability } from "./_UIcomponents/set-availability";
import DoctorAppointmentsList from "./_UIcomponents/list-appointments";
import { Badge } from "@/components/ui/badge";

export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();
  const availability = await getDoctorAvailability();

  if (user?.role !== "doctor") {
    redirect("/role_selection");
  }

  if (user?.verificationStatus !== "verified") {
    redirect("/doctor/still-in-verification");
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.95fr] md:p-10">
          <div className="space-y-5">
            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              Tableau de bord praticien
            </Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
                Un espace clair pour gérer vos consultations et disponibilités.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                Retrouvez vos rendez-vous, organisez vos créneaux de consultation
                et gardez une vue sereine sur votre activité.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <MetricCard
              icon={UserRound}
              label="Connecté en tant que"
              value={user?.full_name || "Docteur"}
            />
            <MetricCard
              icon={Stethoscope}
              label="Spécialité"
              value={user?.specialty || "Généraliste"}
            />
            <MetricCard
              icon={Clock3}
              label="Créneaux ouverts"
              value={String(availability?.length || 0)}
            />
            <MetricCard
              icon={BadgeCheck}
              label="Statut"
              value="Compte vérifié"
            />
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.85fr]">
        <section className="space-y-4">
          <SectionHeading
            title="Rendez-vous patients"
            subtitle="Une vue structurée de vos consultations à venir et passées."
            icon={CalendarRange}
          />
          <DoctorAppointmentsList />
        </section>

        <section className="space-y-4">
          <SectionHeading
            title="Disponibilités"
            subtitle="Définissez les créneaux proposés aux patients."
            icon={Clock3}
          />
          <SetAvailability slots={availability || []} />
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-900/40">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
