import { getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { SetAvailability } from "./_UIcomponents/set-availability";
import DoctorAppointmentsList from "./_UIcomponents/list-appointments";
import { Badge } from "@/components/ui/badge";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * Clinician surface. Identity sits in a compact definition strip rather than a
 * marketing header — the practitioner already knows who they are. */

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
    <div>
      <header className="page-header">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="label-meta">Espace praticien</p>
            <h1 className="mt-2 font-display text-[length:var(--text-display)] font-medium leading-[1.1] tracking-display">
              Dr. {user?.full_name || "Praticien"}
            </h1>
          </div>
          <Badge variant="success">Compte vérifié</Badge>
        </div>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <dt className="label-meta">Spécialité</dt>
            <dd className="mt-1 text-sm font-medium">
              {user?.specialty || "Non renseignée"}
            </dd>
          </div>
          <div>
            <dt className="label-meta">Créneaux ouverts</dt>
            <dd className="tabular mt-1 text-sm font-medium">
              {availability?.length || 0}
            </dd>
          </div>
          {typeof user?.experience === "number" && (
            <div>
              <dt className="label-meta">Expérience</dt>
              <dd className="tabular mt-1 text-sm font-medium">
                {user.experience} {user.experience > 1 ? "ans" : "an"}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
        <section>
          <h2 className="mb-4 font-display text-base font-medium tracking-display">
            Rendez-vous
          </h2>
          <DoctorAppointmentsList />
        </section>

        <section>
          <h2 className="mb-4 font-display text-base font-medium tracking-display">
            Disponibilités
          </h2>
          <SetAvailability slots={availability || []} />
        </section>
      </div>
    </div>
  );
}
