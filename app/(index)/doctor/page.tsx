import { getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { Stethoscope, Calendar, Clock, User } from "lucide-react";
import { SetAvailability } from "./_UIcomponents/set-availability";
import DoctorAppointmentsList from "./_UIcomponents/list-appointments";

export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();
  const availability = await getDoctorAvailability();

  // Redirect if not a doctor
  if (user?.role !== "doctor") {
    redirect("/role_selection");
  }

  // If not verified, redirect to verification page
  if (user?.verificationStatus !== "verified") {
    redirect("/doctor/still-in-verification");
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Tableau de Bord Médecin
              </h1>
              <p className="text-white/80 text-lg">
                Gérez vos rendez-vous et disponibilités
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Connecté en tant que</p>
              <p className="text-white font-semibold">{user?.full_name || "Docteur"}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm">Rendez-vous</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">Aujourd&apos;hui</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm">Créneaux</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{availability?.length || 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm">Spécialité</span>
            </div>
            <p className="text-lg font-bold text-white mt-2 truncate">{user?.specialty || "Non définie"}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm">Statut</span>
            </div>
            <p className="text-lg font-bold text-green-300 mt-2">Vérifié ✓</p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Appointments Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mes Rendez-vous</h2>
              <p className="text-slate-400 text-sm">Consultations planifiées</p>
            </div>
          </div>
          <DoctorAppointmentsList />
        </section>

        {/* Availability Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mes Disponibilités</h2>
              <p className="text-slate-400 text-sm">Créneaux de consultation</p>
            </div>
          </div>
          <SetAvailability slots={availability || []} />
        </section>
      </div>
    </div>
  );
}