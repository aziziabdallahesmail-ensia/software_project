"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Power, Star, StarOff, UserRound } from "lucide-react";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * One administered practitioner. Actions live behind a menu so the row stays
 * scannable; state is carried by the shared chip vocabulary. */

interface DoctorCardProps {
  doctor: {
    id: string;
    full_name: string;
    specialty: string;
    description: string;
    experience?: number;
    isActive?: boolean;
    isPromoted?: boolean;
  };
  onActivate?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onPromote?: (id: string) => void;
  onUnpromote?: (id: string) => void;
  isPending?: boolean;
}

export function DoctorCard({
  doctor,
  onActivate,
  onSuspend,
  onPromote,
  onUnpromote,
  isPending,
}: DoctorCardProps) {
  return (
    <article className="surface p-4">
      <div className="flex items-start gap-3.5">
        <span className="icon-container icon-container-md shrink-0">
          <UserRound className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="truncate font-display text-base font-medium tracking-display">
              Dr. {doctor.full_name}
            </h3>
            <span className="truncate text-xs text-muted-foreground">
              {doctor.specialty}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {doctor.isActive ? (
              <Badge variant="success">Actif</Badge>
            ) : (
              <Badge variant="secondary">Suspendu</Badge>
            )}
            {doctor.isPromoted && (
              <Badge variant="warning" dot={false}>
                <Star className="h-3 w-3 fill-current" />
                Mis en avant
              </Badge>
            )}
            {typeof doctor.experience === "number" && (
              <span className="text-xs text-muted-foreground">
                <span className="tabular">{doctor.experience}</span>{" "}
                {doctor.experience > 1 ? "ans" : "an"}
              </span>
            )}
          </div>

          {doctor.description && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {doctor.description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              aria-label={`Actions pour Dr. ${doctor.full_name}`}
              className="shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {doctor.isPromoted ? (
              <DropdownMenuItem
                onClick={() => onUnpromote?.(doctor.id)}
                className="cursor-pointer"
              >
                <StarOff className="mr-2 h-4 w-4" />
                Retirer la mise en avant
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onPromote?.(doctor.id)}
                className="cursor-pointer"
              >
                <Star className="mr-2 h-4 w-4" />
                Mettre en avant
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {doctor.isActive ? (
              <DropdownMenuItem
                onClick={() => onSuspend?.(doctor.id)}
                className="cursor-pointer text-destructive focus:bg-destructive-soft focus:text-destructive"
              >
                <Power className="mr-2 h-4 w-4" />
                Suspendre le compte
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onActivate?.(doctor.id)}
                className="cursor-pointer"
              >
                <Power className="mr-2 h-4 w-4" />
                Réactiver le compte
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
