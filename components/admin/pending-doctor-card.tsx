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
import { Clock3, FileText, MoreVertical, UserRound } from "lucide-react";

interface PendingDoctorCardProps {
  doctor: {
    id: string;
    full_name: string;
    specialty: string;
    description: string;
    experience?: number;
    credentialUrl?: string;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isPending?: boolean;
}

export function PendingDoctorCard({
  doctor,
  onApprove,
  onReject,
  isPending,
}: PendingDoctorCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-amber-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-amber-900/40 dark:bg-slate-950/70">
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          <UserRound className="h-7 w-7" />
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
            <Clock3 className="h-3 w-3" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Dr. {doctor.full_name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                  {doctor.specialty}
                </Badge>
                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  En attente
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
              <FileText className="mr-1 h-4 w-4" />
              Voir documents
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending} className="rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                <DropdownMenuItem onClick={() => onApprove?.(doctor.id)} disabled={isPending}>
                  Approuver
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onReject?.(doctor.id)} disabled={isPending}>
                  Rejeter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
