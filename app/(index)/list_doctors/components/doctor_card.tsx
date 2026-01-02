import { User, Star, Calendar, Medal, Stethoscope, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Doctor {
  id: string;
  full_name?: string | null;
  specialty?: string | null;
  experience?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  isFeatured?: boolean | null;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:scale-[1.02]">
      {/* Featured Badge */}
      {doctor.isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Recommandé
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden shadow-lg group-hover:border-indigo-500/50 transition-all duration-300">
              {doctor.imageUrl ? (
                <img
                  src={doctor.imageUrl}
                  alt={doctor.full_name || "Médecin"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-indigo-400" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Name & Specialty */}
          <h3 className="font-bold text-white text-xl mb-2 group-hover:text-indigo-300 transition-colors">
            Dr. {doctor.full_name}
          </h3>

          <Badge
            variant="outline"
            className="bg-indigo-500/10 border-indigo-500/30 text-indigo-300 mb-3"
          >
            {doctor.specialty}
          </Badge>

          {/* Experience */}
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Medal className="h-4 w-4 text-amber-400" />
            <span>{doctor.experience || 0} ans d&apos;expérience</span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
            {doctor.description || "Médecin spécialiste vérifié et disponible pour des consultations."}
          </p>

          {/* Verified Badge */}
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Star className="h-3 w-3 fill-current" />
            Médecin Vérifié
          </div>

          {/* Action Button */}
          <Button
            asChild
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-5 rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-indigo-500/25"
          >
            <Link href={`/list_doctors/${doctor.specialty}/${doctor.id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              Voir le Profil
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}