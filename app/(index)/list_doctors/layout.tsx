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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_rgba(250,252,249,1)_0%,_rgba(245,247,244,1)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_rgba(10,15,14,1)_0%,_rgba(9,12,11,1)_100%)]">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
