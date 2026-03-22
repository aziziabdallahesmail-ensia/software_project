import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PendingDoctorsList } from "@/components/admin/pending-doctors-list";
import { getPendingDoctors } from "@/actions/admin";

export default async function PendingVerificationPage() {
  const doctors = await getPendingDoctors();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <AdminSidebar pendingCount={doctors.length} />
          <PendingDoctorsList initialDoctors={doctors} />
        </div>
      </main>
    </div>
  );
}
