import { PageTitle } from "@/components/page-title";

export const metadata = {
  title: "Doctor Dashboard - MediMeet",
  description: "Manage your appointments and availability",
};

export default async function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Doctor Dashboard" />

      {children}
    </div>
  );
}