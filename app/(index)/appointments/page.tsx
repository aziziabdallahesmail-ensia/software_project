import { getPatientAppointments } from "@/actions/patient";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { CalendarPlus, ArrowRight } from "lucide-react";
import { AppointmentCard } from "@/components/appointment-card";
import Link from "next/link";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * The page IS the list. Counts are derived from the query, never invented.
 * Patient surface → comfortable density. */

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "patient") {
    redirect("/role_selection");
  }

  const appointments = await getPatientAppointments();

  const scheduledAppointments = appointments.filter(
    (apt) => apt.status === "scheduled",
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );
  const cancelledAppointments = appointments.filter(
    (apt) => apt.status === "cancelled",
  );

  const groups = [
    {
      key: "scheduled",
      title: "À venir",
      hint: "Consultations que vous pouvez encore gérer.",
      items: scheduledAppointments,
    },
    {
      key: "completed",
      title: "Historique",
      hint: "Consultations déjà réalisées.",
      items: completedAppointments,
    },
    {
      key: "cancelled",
      title: "Annulés",
      hint: "Consultations non maintenues.",
      items: cancelledAppointments,
    },
  ].filter((g) => g.items.length > 0);

  return (
    <div data-density="comfortable" className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[68rem] px-4 py-8 lg:px-6 lg:py-10">
        <header className="page-header">
          <p className="label-meta">Espace patient</p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.1] tracking-display">
              Mes rendez-vous
            </h1>
            <Link
              href="/list_doctors"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] border border-border px-4 text-sm font-medium transition-colors duration-base ease-out hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Prendre rendez-vous
            </Link>
          </div>

          {appointments.length > 0 && (
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              {[
                { label: "À venir", value: scheduledAppointments.length },
                { label: "Terminés", value: completedAppointments.length },
                { label: "Annulés", value: cancelledAppointments.length },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <dd className="tabular text-lg font-medium text-foreground">
                    {stat.value}
                  </dd>
                  <dt className="text-xs text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          )}
        </header>

        {groups.length > 0 ? (
          <div className="flex flex-col gap-10">
            {groups.map((group) => (
              <section key={group.key}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-display text-base font-medium tracking-display">
                    {group.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{group.hint}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {group.items.map((appointment) => (
                    <li key={appointment.id}>
                      <AppointmentCard
                        appointment={appointment}
                        userRole="PATIENT"
                        refetchAppointments={getPatientAppointments}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="surface flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <span className="icon-container icon-container-lg shrink-0">
              <CalendarPlus className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-medium tracking-display">
                Aucun rendez-vous pour l&apos;instant
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Parcourez les spécialités disponibles et réservez votre première
                consultation.
              </p>
            </div>
            <Link
              href="/list_doctors"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-base ease-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Trouver un médecin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
