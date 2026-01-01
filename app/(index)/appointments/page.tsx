import { getPatientAppointments } from "@/actions/patient";
import { PageTitle } from "@/components/page-title";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/set_user_role";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Stethoscope, AlertCircle } from "lucide-react";
import { AppointmentCard } from "@/components/appointment-card";
import { Badge } from "@/components/ui/badge";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "patient") {
    redirect("/role_selection");
  }

  const appointments = await getPatientAppointments();

  // Categorize appointments by status
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Mes Rendez-vous
              </h1>
              <p className="text-muted-foreground">
                Gérez et suivez tous vos rendez-vous médicaux
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30 border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      À venir
                    </p>
                    <p className="text-3xl font-bold text-blue-400">
                      {scheduledAppointments.length}
                    </p>
                  </div>
                  <div className="bg-blue-500/20 rounded-full p-3">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30 border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Terminés
                    </p>
                    <p className="text-3xl font-bold text-green-400">
                      {completedAppointments.length}
                    </p>
                  </div>
                  <div className="bg-green-500/20 rounded-full p-3">
                    <Stethoscope className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/30 border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Annulés
                    </p>
                    <p className="text-3xl font-bold text-red-400">
                      {cancelledAppointments.length}
                    </p>
                  </div>
                  <div className="bg-red-500/20 rounded-full p-3">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-8">
            {/* Scheduled Appointments */}
            {scheduledAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 px-3 py-1 text-sm font-semibold">
                    {scheduledAppointments.length} Rendez-vous à venir
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {scheduledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Appointments */}
            {completedAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/40 px-3 py-1 text-sm font-semibold">
                    {completedAppointments.length} Rendez-vous terminés
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {completedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Appointments */}
            {cancelledAppointments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/40 px-3 py-1 text-sm font-semibold">
                    {cancelledAppointments.length} Rendez-vous annulés
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="PATIENT"
                      refetchAppointments={getPatientAppointments}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20 border-2">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
                  <Calendar className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Aucun rendez-vous prévu
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Vous n&apos;avez pas encore de rendez-vous programmé. Parcourez nos
                  médecins et réservez votre première consultation.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Stethoscope className="h-4 w-4" />
                  <span>Consultez notre liste de médecins spécialisés</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}