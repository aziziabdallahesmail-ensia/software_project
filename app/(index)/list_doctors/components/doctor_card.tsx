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
    <Card className="group h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-secondary text-primary">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.full_name || "Médecin"}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">
                Dr. {doctor.full_name}
              </h3>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {doctor.specialty}
              </Badge>
            </div>
          </div>

          {doctor.isFeatured && (
            <Badge variant="warning" className="gap-1">
              <Star className="h-3 w-3 fill-current" />
              Recommandé
            </Badge>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="metric-card">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Medal className="h-3.5 w-3.5 text-primary" />
              Expérience
            </div>
            <p className="text-sm font-semibold text-foreground">
              {doctor.experience || 0} ans
            </p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Stethoscope className="h-3.5 w-3.5 text-primary" />
              Statut
            </div>
            <p className="text-sm font-semibold text-foreground">
              Médecin vérifié
            </p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground flex-1">
          {doctor.description ||
            "Médecin spécialiste vérifié et disponible pour des consultations."}
        </p>

        <Button className="w-full gap-2" asChild>
          <Link href={`/list_doctors/${doctor.specialty}/${doctor.id}`}>
            <Calendar className="h-4 w-4" />
            Voir le profil
            <ArrowRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
