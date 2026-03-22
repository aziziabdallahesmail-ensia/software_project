"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock3,
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
  addAppointmentNotes,
  markAppointmentCompleted,
} from "@/actions/doctor";
import { JoinCallButton } from "@/components/join-call-button";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AppointmentCardProps {
  appointment: {
    id: string;
    startTime: Date | string;
    endTime: Date | string;
    status: string;
    notes?: string;
    patientDescription?: string;
    videoRoomName?: string;
    callDurationMinutes?: number;
    patient?: { full_name: string; email?: string; specialty?: string };
    doctor?: { full_name: string; email?: string; specialty?: string };
  };
  userRole: "DOCTOR" | "PATIENT";
  refetchAppointments?: () => void;
}

export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}: AppointmentCardProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

  const {
    loading: cancelLoading,
    execute: submitCancel,
    data: cancelData,
  } = useFetch(cancelAppointment);
  const {
    loading: notesLoading,
    execute: submitNotes,
    data: notesData,
  } = useFetch(addAppointmentNotes);
  const {
    loading: completeLoading,
    execute: submitMarkCompleted,
    data: completeData,
  } = useFetch(markAppointmentCompleted);

  const formatTime = (dateString: Date | string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return "";
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status.toLowerCase() !== "scheduled") {
      return false;
    }
    const now = new Date();
    const appointmentStartTime = new Date(appointment.startTime);
    return now >= appointmentStartTime;
  };

  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  const handleMarkCompleted = async () => {
    if (completeLoading) return;
    if (window.confirm("Êtes-vous sûr de vouloir marquer ce rendez-vous comme terminé ?")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitMarkCompleted(formData);
    }
  };

  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Rendez-vous annulé avec succès");
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [cancelData, refetchAppointments, router]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Rendez-vous marqué comme terminé");
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [completeData, refetchAppointments, router]);

  useEffect(() => {
    if (notesData?.success) {
      toast.success("Notes enregistrées avec succès");
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [notesData, refetchAppointments, router]);

  const otherParty = userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const statusColors = getStatusColors(appointment.status.toLowerCase());

  return (
    <>
      <Card className={`transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${statusColors.cardClass}`}>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={`icon-container icon-container-md ${statusColors.iconBg}`}>
                {userRole === "DOCTOR" ? <User className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {userRole === "DOCTOR" ? "Patient" : "Médecin"}
                </p>
                <h3 className="text-base font-semibold text-foreground">
                  {userRole === "DOCTOR" ? otherParty?.full_name : `Dr. ${otherParty?.full_name}`}
                </h3>
                {userRole === "PATIENT" && (
                  <p className="text-xs text-muted-foreground">{otherParty?.specialty}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={statusColors.badgeVariant as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}>
                {appointment.status}
              </Badge>
              {appointment.videoRoomName && (
                <Badge variant="info" className="gap-1">
                  <Video className="h-3 w-3" />
                  Vidéo
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoTile
              icon={Calendar}
              label="Date"
              value={format(new Date(appointment.startTime), "d MMM yyyy")}
            />
            <InfoTile
              icon={Clock3}
              label="Heure"
              value={`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
            />
          </div>

          {appointment.status.toLowerCase() === "completed" && appointment.callDurationMinutes && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="icon-container icon-container-sm bg-card">
                <Video className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Consultation vidéo terminée</p>
                <p className="text-xs text-muted-foreground">{appointment.callDurationMinutes} minutes</p>
              </div>
              <Badge variant="success">Terminée</Badge>
            </div>
          )}

          {appointment.status.toLowerCase() === "scheduled" && (
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Consultation vidéo</span>
              </div>
              <JoinCallButton
                appointmentId={appointment.id}
                startTime={appointment.startTime}
                endTime={appointment.endTime}
                status={appointment.status}
                userRole={userRole.toLowerCase() as "doctor" | "patient"}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {canMarkCompleted() && (
              <Button
                size="sm"
                onClick={handleMarkCompleted}
                disabled={completeLoading}
                className="gap-1.5"
              >
                {completeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Marquer terminé
              </Button>
            )}

            {appointment.status.toLowerCase() === "scheduled" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelAppointment}
                disabled={cancelLoading}
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                {cancelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Annuler
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen(true)}
              className="gap-1.5"
            >
              <FileText className="h-4 w-4" />
              Détails
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-lg font-semibold">
                Détails du rendez-vous
              </DialogTitle>
              <Badge variant={statusColors.badgeVariant as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}>
                {appointment.status}
              </Badge>
            </div>
            <DialogDescription>
              {appointment.status.toLowerCase() === "scheduled"
                ? "Gérez votre rendez-vous à venir"
                : "Consultez les informations du rendez-vous"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
              <div className={`icon-container icon-container-md ${statusColors.iconBg}`}>
                {userRole === "DOCTOR" ? <User className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {userRole === "DOCTOR" ? "Patient" : "Médecin"}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {userRole === "DOCTOR" ? otherParty?.full_name : `Dr. ${otherParty?.full_name}`}
                </p>
                {userRole === "DOCTOR" && (
                  <p className="text-xs text-muted-foreground">{otherParty?.email}</p>
                )}
                {userRole === "PATIENT" && (
                  <p className="text-xs text-muted-foreground">{otherParty?.specialty}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoTile
                icon={Calendar}
                label="Date"
                value={format(new Date(appointment.startTime), "EEEE d MMMM yyyy")}
              />
              <InfoTile
                icon={Clock3}
                label="Durée"
                value={`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
              />
            </div>

            {appointment.patientDescription && (
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {userRole === "DOCTOR" ? "Description du patient" : "Votre description"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {appointment.patientDescription}
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Notes
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {appointment.notes || "Aucune note ajoutée pour le moment."}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-row">
            <div className="flex flex-wrap gap-2">
              {appointment.status.toLowerCase() === "scheduled" && (
                <JoinCallButton
                  appointmentId={appointment.id}
                  startTime={appointment.startTime}
                  endTime={appointment.endTime}
                  status={appointment.status}
                  userRole={userRole.toLowerCase() as "doctor" | "patient"}
                />
              )}
              {canMarkCompleted() && (
                <Button onClick={handleMarkCompleted} disabled={completeLoading} className="gap-2">
                  {completeLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Marquer terminé
                </Button>
              )}
              {appointment.status.toLowerCase() === "scheduled" && (
                <Button
                  variant="outline"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  {cancelLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Annuler
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

function getStatusColors(status: string) {
  switch (status) {
    case "completed":
      return {
        cardClass: "border-success/30",
        iconBg: "bg-success/10 text-success",
        badgeVariant: "success",
      };
    case "cancelled":
      return {
        cardClass: "border-destructive/30",
        iconBg: "bg-destructive/10 text-destructive",
        badgeVariant: "destructive",
      };
    default:
      return {
        cardClass: "",
        iconBg: "bg-primary/10 text-primary",
        badgeVariant: "info",
      };
  }
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
