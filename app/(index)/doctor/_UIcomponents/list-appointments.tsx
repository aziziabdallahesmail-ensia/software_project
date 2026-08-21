"use client";

import { useEffect } from "react";
import { getDoctorAppointments } from "@/actions/doctor";
import { AppointmentCard } from "@/components/appointment-card";
import { CalendarRange, Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * The doctor's day as a list. Counts come from the fetched data. */

interface DoctorAppointment {
  id: string;
  startTime: Date | string;
  endTime: Date | string;
  status: string;
  notes?: string | null;
  patientDescription?: string | null;
  videoRoomName?: string | null;
  callDurationMinutes?: number | null;
  patient?: {
    full_name: string | null;
    email?: string | null;
    specialty?: string | null;
  } | null;
}

export default function DoctorAppointmentsList() {
  const {
    loading,
    data,
    execute: fetchAppointments,
  } = useFetch(getDoctorAppointments);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const appointments: DoctorAppointment[] = data?.appointments || [];
  const byStatus = (s: string) =>
    appointments.filter((apt) => apt.status.toLowerCase() === s);

  const groups = [
    { key: "scheduled", title: "À venir", items: byStatus("scheduled") },
    { key: "completed", title: "Terminés", items: byStatus("completed") },
    { key: "cancelled", title: "Annulés", items: byStatus("cancelled") },
  ].filter((g) => g.items.length > 0);

  if (loading) {
    return (
      <div className="surface flex items-center justify-center gap-3 py-12">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Chargement des rendez-vous…
        </span>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="surface flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <span className="icon-container icon-container-lg shrink-0">
          <CalendarRange className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-medium tracking-display">
            Aucun rendez-vous
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Vos consultations apparaîtront ici dès qu&apos;un patient réservera
            l&apos;un de vos créneaux.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <dl className="flex flex-wrap gap-x-8 gap-y-2 border-b border-border-soft pb-4">
        {[
          { label: "À venir", value: byStatus("scheduled").length },
          { label: "Terminés", value: byStatus("completed").length },
          { label: "Annulés", value: byStatus("cancelled").length },
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <dd className="tabular text-lg font-medium text-foreground">
              {stat.value}
            </dd>
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>

      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="label-meta mb-3">{group.title}</h3>
          <ul className="flex flex-col gap-3">
            {group.items.map((appointment) => (
              <li key={appointment.id}>
                <AppointmentCard
                  appointment={appointment}
                  userRole="DOCTOR"
                  refetchAppointments={fetchAppointments}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
