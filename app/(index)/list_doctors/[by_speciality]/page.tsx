import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctor";
import { DoctorCard } from "../components/doctor_card";
import { Stethoscope, Users, Search } from "lucide-react";

interface PageProps {
  params: Promise<{ by_speciality: string }>;
}

export default async function DoctorSpecialtyPage({ params }: PageProps) {
  const { by_speciality: specialty } = await params;

  // Redirect to main doctors page if no specialty is provided
  if (!specialty) {
    redirect("/doctors");
  }

  // Decode the specialty from URL
  const decodedSpecialty = decodeURIComponent(specialty);

  // Fetch doctors by specialty
  const { doctors, error } = await getDoctorsBySpecialty(decodedSpecialty);

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium uppercase tracking-wide mb-1">
                Spécialité
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
                {decodedSpecialty}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Médecins disponibles</p>
              <p className="text-2xl font-bold text-white">
                {doctors?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {doctors && doctors.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Nos Médecins Spécialistes
              </h2>
              <p className="text-slate-400 text-sm">
                Choisissez un médecin pour prendre rendez-vous
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-12 text-center shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-6">
              <Search className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Aucun médecin disponible
            </h3>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              Il n&apos;y a actuellement aucun médecin vérifié dans cette
              spécialité. Veuillez réessayer plus tard ou choisir une autre
              spécialité.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}