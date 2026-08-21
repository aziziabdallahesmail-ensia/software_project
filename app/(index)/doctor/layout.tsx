export const metadata = {
  title: "Espace praticien",
  description: "Gérez vos rendez-vous et vos disponibilités",
};

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * Clinician surface → compact density. The page's <h1> belongs to the page
 * itself, so this shell contributes only the ground and the density register. */

export default async function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-density="compact" className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[80rem] px-4 py-8 lg:px-6 lg:py-10">
        {children}
      </div>
    </div>
  );
}
