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
import { Award, MoreHorizontal, Power, ShieldCheck, Star, UserRound } from "lucide-react";

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
    <div className="card-clinical p-5 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className="icon-container icon-container-lg bg-primary/10 text-primary flex-shrink-0">
          <UserRound className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">
                Dr. {doctor.full_name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {doctor.specialty}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    doctor.isActive
                      ? "bg-success/5 text-success border-success/20"
                      : "bg-destructive/5 text-destructive border-destructive/20"
                  }
                >
                  {doctor.isActive ? "Actif" : "Suspendu"}
                </Badge>
                {doctor.isPromoted && (
                  <Badge variant="info">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    En avant
                  </Badge>
                )}
              </div>
            </div>

            {doctor.experience && (
              <div className="metric-card text-center flex-shrink-0">
                <p className="text-xl font-semibold text-foreground">
                  {doctor.experience}
                </p>
                <p className="text-xs text-muted-foreground">ans</p>
              </div>
            )}
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
            {doctor.description}
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Détails
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="iconSm" disabled={isPending}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-lg">
                {doctor.isActive ? (
                  <DropdownMenuItem
                    onClick={() => onSuspend?.(doctor.id)}
                    disabled={isPending}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <Power className="h-4 w-4" />
                    Suspendre
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onActivate?.(doctor.id)}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Activer
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {doctor.isPromoted ? (
                  <DropdownMenuItem
                    onClick={() => onUnpromote?.(doctor.id)}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <Award className="h-4 w-4" />
                    Retirer mise en avant
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onPromote?.(doctor.id)}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Mettre en avant
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
