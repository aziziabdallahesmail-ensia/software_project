export const metadata = {
  title: "Trouver un Médecin",
  description: "Parcourez et réservez des rendez-vous avec nos professionnels de santé",
};

export default async function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}