"use client";

import { useEffect } from "react";
import { getDoctorAppointments } from "@/actions/doctor";
import { AppointmentCard } from "@/components/appointment-card";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarRange, Clock3, Loader2, Ban } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { Badge } from "@/components/ui/badge";

export default function DoctorAppointmentsList() {
  const {
    loading,
    data,
    execute: fetchAppointments,
  } = useFetch(getDoctorAppointments);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const appointments = data?.appointments || [];
  const scheduledAppointments = appointments.filter(
    (apt: { status: string }) => apt.status.toLowerCase() === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (apt: { status: string }) => apt.status.toLowerCase() === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (apt: { status: string }) => apt.status.toLowerCase() === "cancelled"
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <SmallMetric label="À venir" value={scheduledAppointments.length} icon={Clock3} />
        <SmallMetric label="Terminés" value={completedAppointments.length} icon={CalendarRange} />
        <SmallMetric label="Annulés" value={cancelledAppointments.length} icon={Ban} />
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Chargement des rendez-vous...</span>
          </CardContent>
        </Card>
      ) : appointments.length > 0 ? (
        <div className="space-y-6">
          <AppointmentGroup title="À venir" count={scheduledAppointments.length}>
            {scheduledAppointments.map((appointment: { id: string }) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </AppointmentGroup>

          <AppointmentGroup title="Terminés" count={completedAppointments.length}>
            {completedAppointments.map((appointment: { id: string }) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </AppointmentGroup>

          <AppointmentGroup title="Annulés" count={cancelledAppointments.length}>
            {cancelledAppointments.map((appointment: { id: string }) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </AppointmentGroup>
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <div className="icon-container icon-container-lg mx-auto mb-4 bg-secondary text-muted-foreground">
              <CalendarRange className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Aucun rendez-vous programmé
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Vos consultations apparaîtront ici dès qu'un patient réservera
              un créneau disponible.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SmallMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="metric-card">
      <div className="icon-container icon-container-sm mb-2">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function AppointmentGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (!count) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
