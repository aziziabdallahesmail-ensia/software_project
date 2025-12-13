import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DoctorsList } from "@/components/admin/doctors-list";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />
          <DoctorsList />
        </div>
      </main>
    </div>
  );
}
