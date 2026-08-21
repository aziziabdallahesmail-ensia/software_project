import { DoctorsList } from "@/components/admin/doctors-list";
import { getActiveDoctors } from "@/actions/admin";

/* Hallmark · macrostructure: Index-First · design-system: design.md */

export default async function AdminDashboardPage() {
  const doctors = await getActiveDoctors();

  return (
    <div>
      <header className="page-header">
        <p className="label-meta">Administration</p>
        <h1 className="mt-2 font-display text-2xl font-medium leading-tight tracking-display">
          Praticiens
        </h1>
      </header>
      <DoctorsList initialDoctors={doctors} />
    </div>
  );
}
