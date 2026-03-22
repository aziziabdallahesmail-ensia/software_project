import { getPatientAppointments } from "@/actions/patient";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock3, Stethoscope, Ban, ArrowRight } from "lucide-react";
import { AppointmentCard } from "@/components/appointment-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "patient") {
    redirect("/role_selection");
  }

  const appointments = await getPatientAppointments();

  const scheduledAppointments = appointments.filter(
    (apt) => apt.status === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (apt) => apt.status === "cancelled"
  );

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl">
        <div className="page-header mb-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-success/5 text-success border-success/20">
                Espace patient
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  Vos rendez-vous, présentés avec clarté.
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Suivez vos consultations à venir, retrouvez l&apos;historique
                  de vos soins et accédez rapidement à vos rendez-vous vidéo.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <StatCard
                icon={Clock3}
                label="À venir"
                value={scheduledAppointments.length}
              />
              <StatCard
                icon={Stethoscope}
                label="Terminés"
                value={completedAppointments.length}
              />
              <StatCard
                icon={Ban}
                label="Annulés"
                value={cancelledAppointments.length}
              />
            </div>
          </div>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-8">
            <AppointmentSection
              title="Consultations à venir"
              subtitle="Les rendez-vous actifs que vous pouvez encore gérer."
              count={scheduledAppointments.length}
            >
              <div className="space-y-4">
                {scheduledAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="PATIENT"
                    refetchAppointments={getPatientAppointments}
                  />
                ))}
              </div>
            </AppointmentSection>

            {completedAppointments.length > 0 && (
              <AppointmentSection
                title="Historique des consultations"
                subtitle="Vos rendez-vous déjà réalisés."
                count={completedAppointments.length}
              >
                <div className="space-y-4">
                  {completedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </AppointmentSection>
            )}

            {cancelledAppointments.length > 0 && (
              <AppointmentSection
                title="Rendez-vous annulés"
                subtitle="Conservez une trace des consultations non maintenues."
                count={cancelledAppointments.length}
              >
                <div className="space-y-4">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </AppointmentSection>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 px-6 text-center">
              <div className="icon-container icon-container-lg mx-auto mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Aucun rendez-vous enregistré
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Vous n&apos;avez pas encore réservé de consultation. Explorez
                les spécialités médicales disponibles pour trouver le bon
                praticien et réserver un créneau adapté.
              </p>
              <Button asChild>
                <Link href="/list_doctors">
                  Trouver un médecin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="metric-card">
      <div className="icon-container icon-container-sm mb-2">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function AppointmentSection({
  title,
  subtitle,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  children: React.ReactNode;
}) {
  if (!count) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="secondary">
          {count} élément{count > 1 ? "s" : ""}
        </Badge>
      </div>
      {children}
    </section>
  );
}
