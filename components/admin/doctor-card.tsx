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
import { Award, MoreVertical, Power, ShieldCheck, Star, UserRound } from "lucide-react";

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
    <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/40 dark:bg-slate-950/70">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <UserRound className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Dr. {doctor.full_name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {doctor.specialty}
                </Badge>
                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  {doctor.isActive ? "Actif" : "Suspendu"}
                </Badge>
              </div>
            </div>

            {doctor.experience && (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right dark:bg-slate-900/80">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Expérience
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {doctor.experience} ans
                </p>
              </div>
            )}
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {doctor.description}
          </p>

          <div className="mt-5 flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <ShieldCheck className="mr-1 h-4 w-4" />
              Voir détails
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending} className="rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-2xl">
                {doctor.isActive ? (
                  <DropdownMenuItem
                    onClick={() => onSuspend?.(doctor.id)}
                    disabled={isPending}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Suspendre
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onActivate?.(doctor.id)}
                    disabled={isPending}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Activer
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {doctor.isPromoted ? (
                  <DropdownMenuItem
                    onClick={() => onUnpromote?.(doctor.id)}
                    disabled={isPending}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Retirer la mise en avant
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onPromote?.(doctor.id)}
                    disabled={isPending}
                  >
                    <Star className="mr-2 h-4 w-4" />
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
