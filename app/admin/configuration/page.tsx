import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function ConfigurationPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar />
          <section className="flex-1">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-2">Configuration</h2>
              <p className="text-muted-foreground">
                Page de configuration - à implémenter
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
