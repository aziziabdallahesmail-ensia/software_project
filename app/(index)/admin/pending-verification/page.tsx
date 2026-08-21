import { PendingDoctorsList } from "@/components/admin/pending-doctors-list";
import { getPendingDoctors } from "@/actions/admin";

/* Hallmark · macrostructure: Index-First · design-system: design.md */

export default async function PendingVerificationPage() {
  const doctors = await getPendingDoctors();

  return (
    <div>
      <header className="page-header">
        <p className="label-meta">Administration</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-2xl font-medium leading-tight tracking-display">
            Vérifications en attente
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="tabular text-foreground">{doctors.length}</span>{" "}
            {doctors.length > 1 ? "dossiers" : "dossier"}
          </p>
        </div>
      </header>
      <PendingDoctorsList initialDoctors={doctors} />
    </div>
  );
}
