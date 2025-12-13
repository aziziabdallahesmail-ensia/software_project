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
  isPending 
}: DoctorCardProps) {
  return (
    <div className="bg-card rounded-xl border p-6 hover:shadow-lg transition-all group">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-icons-round text-primary text-2xl">
            person
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                Dr. {doctor.full_name}
              </h3>
              <Badge variant="secondary" className="mt-1">
                {doctor.specialty}
              </Badge>
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
                visibility
              </span>
              Voir détails
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
                {doctor.isActive ? (
                  <DropdownMenuItem 
                    className="text-orange-600 focus:text-orange-600"
                    onClick={() => onSuspend?.(doctor.id)}
                    disabled={isPending}
                  >
                    <span className="material-icons-round text-base mr-2">
                      block
                    </span>
                    Suspendre
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    className="text-green-600 focus:text-green-600"
                    onClick={() => onActivate?.(doctor.id)}
                    disabled={isPending}
                  >
                    <span className="material-icons-round text-base mr-2">
                      check_circle
                    </span>
                    Activer
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {doctor.isPromoted ? (
                  <DropdownMenuItem
                    onClick={() => onUnpromote?.(doctor.id)}
                    disabled={isPending}
                  >
                    <span className="material-icons-round text-base mr-2">
                      arrow_downward
                    </span>
                    Retirer promotion
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onPromote?.(doctor.id)}
                    disabled={isPending}
                  >
                    <span className="material-icons-round text-base mr-2">
                      star
                    </span>
                    Promouvoir
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
