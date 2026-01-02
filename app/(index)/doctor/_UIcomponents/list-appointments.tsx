"use client";

import { useEffect } from "react";
import { getDoctorAppointments } from "@/actions/doctor";
import { AppointmentCard } from "@/components/appointment-card";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Loader2, CalendarX2 } from "lucide-react";
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
  }, []);

  const appointments = data?.appointments || [];

  // Categorize appointments - will update whenever data changes
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
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Mes Rendez-vous
              </h2>
              <p className="text-white/80 text-sm">
                Gérez vos consultations programmées
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-white" />
              <span className="text-white font-medium text-sm">
                {scheduledAppointments.length} à venir
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  À venir
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {scheduledAppointments.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Terminés
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {completedAppointments.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/30 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Annulés
                </p>
                <p className="text-2xl font-bold text-red-400">
                  {cancelledAppointments.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <CalendarX2 className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      {loading ? (
        <Card className="border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm shadow-lg">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 opacity-20 animate-ping absolute"></div>
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center relative">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <p className="text-lg font-medium text-slate-300">
                Chargement des rendez-vous...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : appointments.length > 0 ? (
        <div className="space-y-6">
          {/* Scheduled Appointments */}
          {scheduledAppointments.length > 0 && (
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 px-3 py-1 text-sm font-semibold">
                {scheduledAppointments.length} Rendez-vous à venir
              </Badge>
              <div className="grid gap-4">
                {scheduledAppointments.map((appointment: any) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="DOCTOR"
                    refetchAppointments={fetchAppointments}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Appointments */}
          {completedAppointments.length > 0 && (
            <div className="space-y-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/40 px-3 py-1 text-sm font-semibold">
                {completedAppointments.length} Rendez-vous terminés
              </Badge>
              <div className="grid gap-4">
                {completedAppointments.map((appointment: any) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="DOCTOR"
                    refetchAppointments={fetchAppointments}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cancelled Appointments */}
          {cancelledAppointments.length > 0 && (
            <div className="space-y-4">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/40 px-3 py-1 text-sm font-semibold">
                {cancelledAppointments.length} Rendez-vous annulés
              </Badge>
              <div className="grid gap-4">
                {cancelledAppointments.map((appointment: any) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="DOCTOR"
                    refetchAppointments={fetchAppointments}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardContent className="py-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-rose-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-inner">
                  <CalendarX2 className="h-12 w-12 text-slate-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Aucun rendez-vous programmé
              </h3>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Vous n&apos;avez pas encore de rendez-vous. Assurez-vous
                d&apos;avoir défini vos disponibilités pour permettre aux
                patients de prendre rendez-vous.
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>Vos disponibilités déterminent les créneaux proposés</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}