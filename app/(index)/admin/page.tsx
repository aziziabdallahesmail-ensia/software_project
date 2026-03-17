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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_rgba(251,252,249,1)_0%,_rgba(244,247,242,1)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_rgba(11,15,14,1)_0%,_rgba(8,11,10,1)_100%)]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar pendingCount={pendingDoctors.length} />
          <DoctorsList initialDoctors={doctors} />
        </div>
      </main>
    </div>
  );
}
