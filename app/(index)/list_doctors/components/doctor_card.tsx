import Image from "next/image";
import { User, Star, Calendar, Medal, Stethoscope, ArrowRight } from "lucide-react";
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
    <Card className="group h-full rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:border-emerald-900/40 dark:bg-slate-950/70 dark:hover:border-emerald-800/60">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.full_name || "Médecin"}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-7 w-7" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Dr. {doctor.full_name}
              </h3>
              <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                {doctor.specialty}
              </Badge>
            </div>
          </div>

          {doctor.isFeatured && (
            <Badge className="rounded-full bg-amber-500 px-3 py-1 text-white hover:bg-amber-500">
              <Star className="mr-1 h-3.5 w-3.5 fill-current" />
              Recommandé
            </Badge>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/80">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Medal className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              Expérience
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {doctor.experience || 0} ans
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/80">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              Statut
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Médecin vérifié
            </p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {doctor.description ||
            "Médecin spécialiste vérifié et disponible pour des consultations."}
        </p>

        <Button
          asChild
          className="mt-auto w-full rounded-full bg-emerald-600 py-6 text-white hover:bg-emerald-700"
        >
          <Link href={`/list_doctors/${doctor.specialty}/${doctor.id}`}>
            <Calendar className="mr-2 h-4 w-4" />
            Voir le profil
            <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
