/* eslint-disable @typescript-eslint/no-explicit-any */
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
    (apt: any) => apt.status.toLowerCase() === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (apt: any) => apt.status.toLowerCase() === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (apt: any) => apt.status.toLowerCase() === "cancelled"
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SmallMetric label="À venir" value={scheduledAppointments.length} icon={Clock3} />
        <SmallMetric label="Terminés" value={completedAppointments.length} icon={CalendarRange} />
        <SmallMetric label="Annulés" value={cancelledAppointments.length} icon={Ban} />
      </div>

      {loading ? (
        <Card className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
          <CardContent className="flex items-center justify-center gap-3 py-16 text-slate-600 dark:text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement des rendez-vous...
          </CardContent>
        </Card>
      ) : appointments.length > 0 ? (
        <div className="space-y-6">
          <AppointmentGroup title="À venir" count={scheduledAppointments.length}>
            {scheduledAppointments.map((appointment: any) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </AppointmentGroup>

          <AppointmentGroup title="Terminés" count={completedAppointments.length}>
            {completedAppointments.map((appointment: any) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </AppointmentGroup>

          <AppointmentGroup title="Annulés" count={cancelledAppointments.length}>
            {cancelledAppointments.map((appointment: any) => (
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
        <Card className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
          <CardContent className="space-y-3 p-8 text-center md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CalendarRange className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Aucun rendez-vous programmé
            </h3>
            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Vos consultations apparaîtront ici dès qu&apos;un patient réservera
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
  icon: any;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-white/85 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
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
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h3>
        <Badge className="rounded-full border border-emerald-200 bg-white px-4 py-1 text-slate-700 hover:bg-white dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200">
          {count}
        </Badge>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}
