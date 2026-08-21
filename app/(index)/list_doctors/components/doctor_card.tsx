import Image from "next/image";
import Link from "next/link";
import { User, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* Hallmark · macrostructure: Catalogue · design-system: design.md
 * One practitioner tile. Experience is a real field; nothing here is invented.
 * The whole tile is the link — no nested button inside an anchor. */

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
    <Link
      href={`/list_doctors/${doctor.specialty}/${doctor.id}`}
      className="surface-interactive group flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-control)] border border-border-soft bg-muted text-muted-foreground">
          {doctor.imageUrl ? (
            <Image
              src={doctor.imageUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-medium tracking-display text-foreground">
            Dr. {doctor.full_name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {doctor.specialty}
          </p>
        </div>

        {doctor.isFeatured && (
          <Badge variant="warning" dot={false} className="shrink-0">
            <Star className="h-3 w-3 fill-current" />
            Recommandé
          </Badge>
        )}
      </div>

      {doctor.description && (
        <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {doctor.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-soft pt-3.5">
        <span className="text-xs text-muted-foreground">
          {typeof doctor.experience === "number" ? (
            <>
              <span className="tabular text-foreground">
                {doctor.experience}
              </span>{" "}
              {doctor.experience > 1 ? "ans d'expérience" : "an d'expérience"}
            </>
          ) : (
            "Expérience non renseignée"
          )}
        </span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-primary">
          Voir le profil
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
