import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DoctorsList } from "@/components/admin/doctors-list";
import { getActiveDoctors, getPendingDoctors } from "@/actions/admin";

export default async function AdminDashboardPage() {
  const [doctors, pendingDoctors] = await Promise.all([
    getActiveDoctors(),
    getPendingDoctors(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <AdminSidebar pendingCount={pendingDoctors.length} />
          <DoctorsList initialDoctors={doctors} />
        </div>
      </main>
    </div>
  );
}
