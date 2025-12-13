import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { PendingDoctorsList } from "@/components/admin/pending-doctors-list";
import { getPendingDoctors } from "@/app/actions/admin";

export default async function PendingVerificationPage() {
  const doctors = await getPendingDoctors();

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />
          <PendingDoctorsList initialDoctors={doctors} />
        </div>
      </main>
    </div>
  );
}
