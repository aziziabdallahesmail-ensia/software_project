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

export function PendingDoctorCard({ doctor, onApprove, onReject, isPending }: PendingDoctorCardProps) {
  return (
    <div className="bg-card rounded-xl border-2 border-orange-200 dark:border-orange-900/40 p-6 hover:shadow-lg transition-all group">
      <div className="flex items-start gap-4">
        {/* Avatar with pending indicator */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <span className="material-icons-round text-orange-600 dark:text-orange-400 text-2xl">
              person
            </span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="material-icons-round text-white text-sm">
              schedule
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                Dr. {doctor.full_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">
                  {doctor.specialty}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700">
                  En attente
                </Badge>
              </div>
            </div>
            {doctor.experience && (
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-foreground">
                  {doctor.experience} ans
                </p>
                <p className="text-xs text-muted-foreground">d&apos;expérience</p>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {doctor.description}
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <span className="material-icons-round text-base mr-1">
                description
              </span>
              Voir documents
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending}>
                  <span className="material-icons-round text-base">
                    more_vert
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  className="text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950"
                  onClick={() => onApprove?.(doctor.id)}
                  disabled={isPending}
                >
                  <span className="material-icons-round text-base mr-2">
                    check_circle
                  </span>
                  Approuver
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={() => onReject?.(doctor.id)}
                  disabled={isPending}
                >
                  <span className="material-icons-round text-base mr-2">
                    cancel
                  </span>
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
