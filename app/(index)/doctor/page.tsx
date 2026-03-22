import { getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { Stethoscope, CalendarRange, Clock3, BadgeCheck, UserRound } from "lucide-react";
import { SetAvailability } from "./_UIcomponents/set-availability";
import DoctorAppointmentsList from "./_UIcomponents/list-appointments";
import { Badge } from "@/components/ui/badge";

export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();
  const availability = await getDoctorAvailability();

  if (user?.role !== "doctor") {
    redirect("/role_selection");
  }

  if (user?.verificationStatus !== "verified") {
    redirect("/doctor/still-in-verification");
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl space-y-8">
        <div className="page-header">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                Tableau de bord praticien
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  Un espace clair pour gérer vos consultations et disponibilités.
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Retrouvez vos rendez-vous, organisez vos créneaux de consultation
                  et gardez une vue sereine sur votre activité.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={UserRound}
                label="Connecté en tant que"
                value={user?.full_name || "Docteur"}
              />
              <MetricCard
                icon={Stethoscope}
                label="Spécialité"
                value={user?.specialty || "Généraliste"}
              />
              <MetricCard
                icon={Clock3}
                label="Créneaux ouverts"
                value={String(availability?.length || 0)}
              />
              <MetricCard
                icon={BadgeCheck}
                label="Statut"
                value="Compte vérifié"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.85fr]">
          <section className="space-y-4">
            <SectionHeading
              title="Rendez-vous patients"
              subtitle="Une vue structurée de vos consultations à venir et passées."
              icon={CalendarRange}
            />
            <DoctorAppointmentsList />
          </section>

          <section className="space-y-4">
            <SectionHeading
              title="Disponibilités"
              subtitle="Définissez les créneaux proposés aux patients."
              icon={Clock3}
            />
            <SetAvailability slots={availability || []} />
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="metric-card">
      <div className="icon-container icon-container-sm mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-1">{value}</p>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="icon-container icon-container-md">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
