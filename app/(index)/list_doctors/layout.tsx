export const metadata = {
  title: "Trouver un Médecin",
  description:
    "Parcourez et réservez des rendez-vous avec nos professionnels de santé",
};

/* Hallmark · macrostructure: Catalogue · design-system: design.md
 * Patient-facing surface → comfortable density. Plain paper ground; the old
 * radial-gradient wash belonged to a palette this system replaced. */

export default async function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-density="comfortable" className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[88rem] px-4 py-8 lg:px-6 lg:py-10">
        {children}
      </div>
    </div>
  );
}
