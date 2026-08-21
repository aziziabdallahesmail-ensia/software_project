"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, UserRound, XCircle } from "lucide-react";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * A verification dossier. Approve and reject are irreversible for the
 * applicant, so both confirm inline before firing. */

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
  const [confirming, setConfirming] = useState<null | "approve" | "reject">(
    null,
  );

  return (
    <article className="surface p-4">
      <div className="flex items-start gap-3.5">
        <span className="icon-container icon-container-md shrink-0 border-warning/30 bg-warning-soft text-warning">
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
            <Badge variant="warning">En attente</Badge>
            {typeof doctor.experience === "number" && (
              <span className="text-xs text-muted-foreground">
                <span className="tabular">{doctor.experience}</span>{" "}
                {doctor.experience > 1 ? "ans d'expérience" : "an d'expérience"}
              </span>
            )}
          </div>

          {doctor.description && (
            <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {doctor.description}
            </p>
          )}

          {doctor.credentialUrl && (
            <a
              href={doctor.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Consulter le justificatif
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {confirming ? (
        <div
          role="alertdialog"
          aria-label="Confirmation"
          className={`mt-4 flex flex-wrap items-center gap-3 rounded-[var(--radius-control)] border p-3 ${
            confirming === "reject"
              ? "border-destructive/25 bg-destructive-soft"
              : "border-success/25 bg-success-soft"
          }`}
        >
          <p className="min-w-0 flex-1 text-sm">
            {confirming === "reject"
              ? "Refuser ce dossier ? Le praticien en sera informé."
              : "Approuver ce praticien ? Son profil deviendra visible aux patients."}
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirming(null)}
              disabled={isPending}
            >
              Retour
            </Button>
            <Button
              size="sm"
              variant={confirming === "reject" ? "destructiveSolid" : "default"}
              disabled={isPending}
              onClick={() => {
                if (confirming === "reject") onReject?.(doctor.id);
                else onApprove?.(doctor.id);
                setConfirming(null);
              }}
            >
              Confirmer
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border-soft pt-3.5">
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => setConfirming("reject")}
          >
            <XCircle className="h-4 w-4" />
            Refuser
          </Button>
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => setConfirming("approve")}
          >
            <CheckCircle className="h-4 w-4" />
            Approuver
          </Button>
        </div>
      )}
    </article>
  );
}
