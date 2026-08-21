"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  User,
  Stethoscope,
  X,
  Loader2,
  CheckCircle,
  FileText,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelAppointment,
  markAppointmentCompleted,
} from "@/actions/doctor";
import { JoinCallButton } from "@/components/join-call-button";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * One appointment row. Times are mono. Status uses the shared chip vocabulary
 * with French labels — the raw enum is never shown to the user.
 * Destructive actions confirm inline, scoped to the row (no window.confirm). */

interface AppointmentCardProps {
  appointment: {
    id: string;
    startTime: Date | string;
    endTime: Date | string;
    status: string;
    notes?: string | null;
    patientDescription?: string | null;
    videoRoomName?: string | null;
    callDurationMinutes?: number | null;
    patient?: { full_name: string | null; email?: string | null; specialty?: string | null } | null;
    doctor?: { full_name: string | null; email?: string | null; specialty?: string | null } | null;
  };
  userRole: "DOCTOR" | "PATIENT";
  refetchAppointments?: () => void;
}

type BadgeVariant = "secondary" | "destructive" | "success" | "warning" | "info";

const statusMeta: Record<string, { label: string; variant: BadgeVariant }> = {
  scheduled: { label: "Programmé", variant: "info" },
  completed: { label: "Terminé", variant: "success" },
  cancelled: { label: "Annulé", variant: "destructive" },
};

export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}: AppointmentCardProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState<null | "cancel" | "complete">(
    null,
  );
  const router = useRouter();

  const {
    loading: cancelLoading,
    execute: submitCancel,
    data: cancelData,
  } = useFetch(cancelAppointment);
  const {
    loading: completeLoading,
    execute: submitMarkCompleted,
    data: completeData,
  } = useFetch(markAppointmentCompleted);

  const status = appointment.status.toLowerCase();
  const meta = statusMeta[status] ?? {
    label: appointment.status,
    variant: "secondary" as BadgeVariant,
  };

  const formatTime = (dateString: Date | string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return "";
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || status !== "scheduled") return false;
    return new Date() >= new Date(appointment.startTime);
  };

  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitCancel(formData);
  };

  const handleMarkCompleted = async () => {
    if (completeLoading) return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitMarkCompleted(formData);
  };

  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Rendez-vous annulé.");
      setConfirming(null);
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [cancelData, refetchAppointments, router]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Rendez-vous marqué comme terminé.");
      setConfirming(null);
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [completeData, refetchAppointments, router]);

  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const partyName =
    userRole === "DOCTOR"
      ? otherParty?.full_name
      : `Dr. ${otherParty?.full_name}`;

  return (
    <>
      <article className="surface-interactive p-4 sm:p-5">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          {/* When */}
          <div className="w-full shrink-0 border-b border-border-soft pb-3 sm:w-32 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <p className="tabular text-lg font-medium leading-none text-foreground">
              {formatTime(appointment.startTime)}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground first-letter:uppercase">
              {format(new Date(appointment.startTime), "EEE d MMM yyyy", {
                locale: fr,
              })}
            </p>
            <p className="tabular mt-0.5 text-[0.6875rem] text-muted-foreground">
              → {formatTime(appointment.endTime)}
            </p>
          </div>

          {/* Who */}
          <div className="min-w-0 flex-1">
            <p className="label-meta">
              {userRole === "DOCTOR" ? "Patient" : "Praticien"}
            </p>
            <h3 className="mt-1 truncate font-display text-base font-medium tracking-display">
              {partyName}
            </h3>
            {userRole === "PATIENT" && otherParty?.specialty && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {otherParty.specialty}
              </p>
            )}
          </div>

          {/* State */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {status === "completed" &&
              typeof appointment.callDurationMinutes === "number" && (
                <span className="tabular text-xs text-muted-foreground">
                  {appointment.callDurationMinutes} min
                </span>
              )}
            {appointment.videoRoomName && (
              <Badge variant="secondary" dot={false}>
                <Video className="h-3 w-3" />
                Vidéo
              </Badge>
            )}
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-soft pt-3.5">
          {status === "scheduled" && (
            <JoinCallButton
              appointmentId={appointment.id}
              startTime={appointment.startTime}
              endTime={appointment.endTime}
              status={appointment.status}
              userRole={userRole.toLowerCase() as "doctor" | "patient"}
            />
          )}

          <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
            <FileText className="h-4 w-4" />
            Détails
          </Button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {canMarkCompleted() && confirming !== "complete" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirming("complete")}
              >
                <CheckCircle className="h-4 w-4" />
                Marquer terminé
              </Button>
            )}
            {status === "scheduled" && confirming !== "cancel" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirming("cancel")}
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            )}
          </div>
        </div>

        {/* Inline confirmation, scoped to this row */}
        {confirming && (
          <div
            role="alertdialog"
            aria-label="Confirmation"
            className={`mt-3 flex flex-wrap items-center gap-3 rounded-[var(--radius-control)] border p-3 ${
              confirming === "cancel"
                ? "border-destructive/25 bg-destructive-soft"
                : "border-border bg-muted/50"
            }`}
          >
            <p className="min-w-0 flex-1 text-sm">
              {confirming === "cancel"
                ? "Annuler ce rendez-vous ? Le créneau sera libéré."
                : "Marquer cette consultation comme terminée ?"}
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirming(null)}
                disabled={cancelLoading || completeLoading}
              >
                Retour
              </Button>
              <Button
                size="sm"
                variant={
                  confirming === "cancel" ? "destructiveSolid" : "default"
                }
                onClick={
                  confirming === "cancel"
                    ? handleCancelAppointment
                    : handleMarkCompleted
                }
                disabled={cancelLoading || completeLoading}
              >
                {(cancelLoading || completeLoading) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Confirmer
              </Button>
            </div>
          </div>
        )}
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="font-display text-lg font-medium tracking-display">
                Détails du rendez-vous
              </DialogTitle>
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </div>
            <DialogDescription>
              {status === "scheduled"
                ? "Gérez votre rendez-vous à venir."
                : "Informations de la consultation."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border-soft bg-muted/40 p-4">
              <span className="icon-container icon-container-md shrink-0">
                {userRole === "DOCTOR" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Stethoscope className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="label-meta">
                  {userRole === "DOCTOR" ? "Patient" : "Praticien"}
                </p>
                <p className="truncate text-sm font-medium">{partyName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {userRole === "DOCTOR"
                    ? otherParty?.email
                    : otherParty?.specialty}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border sm:grid-cols-2">
              <div className="bg-card p-4">
                <dt className="label-meta">Date</dt>
                <dd className="mt-1.5 text-sm font-medium first-letter:uppercase">
                  {format(new Date(appointment.startTime), "EEEE d MMMM yyyy", {
                    locale: fr,
                  })}
                </dd>
              </div>
              <div className="bg-card p-4">
                <dt className="label-meta">Horaire</dt>
                <dd className="tabular mt-1.5 text-sm font-medium">
                  {formatTime(appointment.startTime)} –{" "}
                  {formatTime(appointment.endTime)}
                </dd>
              </div>
            </dl>

            {appointment.patientDescription && (
              <div>
                <h4 className="label-meta">
                  {userRole === "DOCTOR"
                    ? "Motif indiqué par le patient"
                    : "Votre motif de consultation"}
                </h4>
                <p className="measure mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {appointment.patientDescription}
                </p>
              </div>
            )}

            <div>
              <h4 className="label-meta">Notes du praticien</h4>
              <p className="measure mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {appointment.notes || "Aucune note pour le moment."}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {status === "scheduled" && (
                <JoinCallButton
                  appointmentId={appointment.id}
                  startTime={appointment.startTime}
                  endTime={appointment.endTime}
                  status={appointment.status}
                  userRole={userRole.toLowerCase() as "doctor" | "patient"}
                />
              )}
              {canMarkCompleted() && (
                <Button
                  variant="outline"
                  onClick={handleMarkCompleted}
                  disabled={completeLoading}
                >
                  {completeLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Marquer terminé
                </Button>
              )}
              {status === "scheduled" && (
                <Button
                  variant="destructive"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Annuler le rendez-vous
                </Button>
              )}
            </div>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
