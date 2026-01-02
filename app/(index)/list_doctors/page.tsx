import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import { Stethoscope, Search, ArrowRight } from "lucide-react";

export default async function DoctorsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-500 p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg mb-6">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Trouvez Votre Médecin
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl">
            Parcourez nos spécialités et réservez un rendez-vous avec nos
            professionnels de santé qualifiés
          </p>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Choisissez une Spécialité
            </h2>
            <p className="text-slate-400 text-sm">
              Sélectionnez une spécialité pour voir les médecins disponibles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty.name}
              href={`/list_doctors/${specialty.name}`}
            >
              <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.03] cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full relative">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30 group-hover:border-emerald-500/50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                      <div className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        <specialty.icon className="h-7 w-7" />
                      </div>
                    </div>

                    <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {specialty.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">
                      <span>Voir les médecins</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}