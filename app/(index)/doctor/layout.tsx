import { PageTitle } from "@/components/page-title";

export const metadata = {
  title: "Doctor Dashboard ",
  description: "Manage your appointments and availability",
};

export default async function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_24%),linear-gradient(180deg,_rgba(251,252,249,1)_0%,_rgba(243,246,242,1)_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_rgba(10,14,13,1)_0%,_rgba(8,10,10,1)_100%)] md:py-10">
      <div className="container mx-auto max-w-7xl">
        <PageTitle title="Espace praticien" />

        {children}
      </div>
    </div>
  );
}
