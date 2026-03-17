/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPatientAppointments } from "@/actions/patient";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock3, Stethoscope, Ban, ArrowRight } from "lucide-react";
import { AppointmentCard } from "@/components/appointment-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "patient") {
    redirect("/role_selection");
  }

  const appointments = await getPatientAppointments();

  const scheduledAppointments = appointments.filter(
    (apt) => apt.status === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (apt) => apt.status === "cancelled"
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_rgba(251,252,249,1)_0%,_rgba(244,247,242,1)_100%)] pb-12 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_rgba(11,15,14,1)_0%,_rgba(8,11,10,1)_100%)]">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70">
          <div className="grid gap-8 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-10">
            <div className="space-y-5">
              <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                Espace patient
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
                  Vos rendez-vous, présentés avec clarté.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                  Suivez vos consultations à venir, retrouvez l&apos;historique
                  de vos soins et accédez rapidement à vos rendez-vous vidéo.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
              <StatCard
                icon={Clock3}
                label="À venir"
                value={scheduledAppointments.length}
              />
              <StatCard
                icon={Stethoscope}
                label="Terminés"
                value={completedAppointments.length}
              />
              <StatCard
                icon={Ban}
                label="Annulés"
                value={cancelledAppointments.length}
              />
            </div>
          </div>
        </section>

        {appointments.length > 0 ? (
          <div className="mt-8 space-y-8">
            <AppointmentSection
              title="Consultations à venir"
              subtitle="Les rendez-vous actifs que vous pouvez encore gérer."
              count={scheduledAppointments.length}
            >
              <div className="grid gap-5">
                {scheduledAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="PATIENT"
                    refetchAppointments={getPatientAppointments}
                  />
                ))}
              </div>
            </AppointmentSection>

            {completedAppointments.length > 0 && (
              <AppointmentSection
                title="Historique des consultations"
                subtitle="Vos rendez-vous déjà réalisés."
                count={completedAppointments.length}
              >
                <div className="grid gap-5">
                  {completedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </AppointmentSection>
            )}

            {cancelledAppointments.length > 0 && (
              <AppointmentSection
                title="Rendez-vous annulés"
                subtitle="Conservez une trace des consultations non maintenues."
                count={cancelledAppointments.length}
              >
                <div className="grid gap-5">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </AppointmentSection>
            )}
          </div>
        ) : (
          <Card className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
            <CardContent className="flex flex-col items-start gap-6 p-8 md:p-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Calendar className="h-7 w-7" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Aucun rendez-vous enregistré
                </h2>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Vous n&apos;avez pas encore réservé de consultation. Explorez
                  les spécialités médicales disponibles pour trouver le bon
                  praticien et réserver un créneau adapté.
                </p>
              </div>
              <Link
                href="/list_doctors"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Trouver un médecin
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  );
}

function AppointmentSection({
  title,
  subtitle,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  children: React.ReactNode;
}) {
  if (!count) return null;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
        <Badge className="w-fit rounded-full border border-emerald-200 bg-white px-4 py-1 text-slate-700 hover:bg-white dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200">
          {count} élément{count > 1 ? "s" : ""}
        </Badge>
      </div>
      {children}
    </section>
  );
}
