import { getPendingDoctors } from "@/actions/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Administration",
  description: "Gérez les praticiens, les vérifications et la plateforme",
};

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * Clinician surface → compact density. The shell lives here rather than being
 * repeated in each page; the app header already provides branding, so the old
 * AdminHeader was duplicate chrome. */

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pendingDoctors = await getPendingDoctors();

  return (
    <div data-density="compact" className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[88rem] px-4 py-8 lg:px-6 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <AdminSidebar pendingCount={pendingDoctors.length} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
