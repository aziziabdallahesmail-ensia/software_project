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
import { CheckCircle, Clock3, ExternalLink, MoreHorizontal, UserRound, XCircle } from "lucide-react";

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
    <div className="card-clinical p-5 border-warning/30 hover:border-warning/50 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className="relative icon-container icon-container-lg bg-warning/10 text-warning flex-shrink-0">
          <UserRound className="h-6 w-6" />
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-warning-foreground">
            <Clock3 className="h-3 w-3" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">
                Dr. {doctor.full_name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-warning/5 text-warning border-warning/20">
                  {doctor.specialty}
                </Badge>
                <Badge variant="warning">
                  <Clock3 className="h-3 w-3 mr-1" />
                  En attente
                </Badge>
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
            {doctor.credentialUrl && (
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <a href={doctor.credentialUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Documents
                </a>
              </Button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-success border-success/30 hover:bg-success/10 hover:text-success"
                onClick={() => onApprove?.(doctor.id)}
                disabled={isPending}
              >
                <CheckCircle className="h-4 w-4" />
                Approuver
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onReject?.(doctor.id)}
                disabled={isPending}
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
