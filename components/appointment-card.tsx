/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock3,
  User,
  Stethoscope,
  X,
  Edit,
  Loader2,
  CheckCircle,
  FileText,
  AlertCircle,
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
  appointment: any;
  userRole: "DOCTOR" | "PATIENT";
  refetchAppointments?: () => void;
}

export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}: AppointmentCardProps) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);
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

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "Invalid time";
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

    if (
      window.confirm(
        "Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée."
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  const handleMarkCompleted = async () => {
    if (completeLoading) return;

    if (
      window.confirm(
        "Êtes-vous sûr de vouloir marquer ce rendez-vous comme terminé ? Cette action ne peut pas être annulée."
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitMarkCompleted(formData);
    }
  };

  const handleSaveNotes = async () => {
    if (notesLoading || userRole !== "DOCTOR") return;

    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
  };

  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Rendez-vous annulé avec succès");
      setOpen(false);
      if (refetchAppointments) {
        refetchAppointments();
      } else {
        router.refresh();
      }
    }
  }, [cancelData, refetchAppointments, router]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Rendez-vous marqué comme terminé");
      setOpen(false);
      if (refetchAppointments) {
        refetchAppointments();
      } else {
        router.refresh();
      }
    }
  }, [completeData, refetchAppointments, router]);

  useEffect(() => {
    if (notesData?.success) {
      toast.success("Notes enregistrées avec succès");
      setAction(null);
      if (refetchAppointments) {
        refetchAppointments();
      } else {
        router.refresh();
      }
    }
  }, [notesData, refetchAppointments, router]);

  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;

  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Médecin";
  const otherPartyIcon = userRole === "DOCTOR" ? <User /> : <Stethoscope />;

  const statusColors = getStatusColors(appointment.status.toLowerCase());

  return (
    <>
      <Card className={`rounded-[1.75rem] border ${statusColors.border} ${statusColors.background} shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}>
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statusColors.iconWrap} ${statusColors.icon}`}>
                {otherPartyIcon}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {otherPartyLabel}
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {userRole === "DOCTOR"
                    ? otherParty.full_name
                    : `Dr. ${otherParty.full_name}`}
                </h3>
                {userRole === "PATIENT" && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {otherParty.specialty}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={`rounded-full border px-3 py-1 ${statusColors.badge}`}>
                {appointment.status}
              </Badge>
              {appointment.videoRoomName && (
                <Badge className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-emerald-700 hover:bg-white dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-emerald-300">
                  <Video className="mr-1 h-3.5 w-3.5" />
                  Vidéo
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoTile
              icon={Calendar}
              label="Date"
              value={format(new Date(appointment.startTime), "MMM d, yyyy")}
            />
            <InfoTile
              icon={Clock3}
              label="Heure"
              value={`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
            />
          </div>

          {appointment.status.toLowerCase() === "completed" && appointment.callDurationMinutes && (
            <div className="rounded-[1.25rem] border border-emerald-100 bg-white/80 p-4 dark:border-emerald-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Consultation vidéo terminée
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {appointment.callDurationMinutes} minutes
                    </p>
                  </div>
                </div>
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Terminée
                </Badge>
              </div>
            </div>
          )}

          {appointment.status.toLowerCase() === "scheduled" && (
            <div className="rounded-[1.25rem] border border-emerald-100 bg-white/80 p-4 dark:border-emerald-900/40 dark:bg-slate-900/70">
              <div className="mb-3 flex items-center gap-2">
                <Video className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Consultation vidéo
                </h4>
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
                className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {completeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Marquer terminé
                  </>
                )}
              </Button>
            )}

            {appointment.status.toLowerCase() === "scheduled" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelAppointment}
                disabled={cancelLoading}
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                {cancelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="mr-1 h-4 w-4" />
                    Annuler
                  </>
                )}
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
              onClick={() => setOpen(true)}
            >
              <FileText className="mr-1 h-4 w-4" />
              Voir les détails
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[1.75rem] border border-emerald-100/80 bg-white/95 dark:border-emerald-900/40 dark:bg-slate-950/95">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                <Calendar className={`h-5 w-5 ${statusColors.icon}`} />
                Détails du rendez-vous
              </DialogTitle>
              <Badge className={`rounded-full border px-3 py-1 ${statusColors.badge}`}>
                {appointment.status}
              </Badge>
            </div>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {appointment.status.toLowerCase() === "scheduled"
                ? "Gérez votre rendez-vous à venir"
                : "Consultez les informations du rendez-vous"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="rounded-[1.5rem] border border-emerald-100 bg-slate-50 p-4 dark:border-emerald-900/40 dark:bg-slate-900/80">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statusColors.iconWrap} ${statusColors.icon}`}>
                  {otherPartyIcon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {otherPartyLabel}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {userRole === "DOCTOR"
                      ? otherParty.full_name
                      : `Dr. ${otherParty.full_name}`}
                  </p>
                  {userRole === "DOCTOR" && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {otherParty.email}
                    </p>
                  )}
                  {userRole === "PATIENT" && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {otherParty.specialty}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoTile
                icon={Calendar}
                label="Date"
                value={formatDateTime(appointment.startTime)}
                large
              />
              <InfoTile
                icon={Clock3}
                label="Durée"
                value={`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
                large
              />
            </div>

            {appointment.videoRoomName && (
              <div className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 dark:border-emerald-900/40 dark:bg-slate-900/70">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        Consultation vidéo
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {appointment.status.toLowerCase() === "completed"
                          ? "Consultation terminée"
                          : "Salle de consultation créée"}
                      </p>
                    </div>
                  </div>
                  {appointment.callDurationMinutes && (
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {appointment.callDurationMinutes} min
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {appointment.patientDescription && (
              <DetailBlock
                icon={AlertCircle}
                title={userRole === "DOCTOR" ? "Description du patient" : "Votre description"}
              >
                {appointment.patientDescription}
              </DetailBlock>
            )}

            <div className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 dark:border-emerald-900/40 dark:bg-slate-900/70">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className={`h-4 w-4 ${statusColors.icon}`} />
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
                    Notes du médecin
                  </h4>
                </div>
                {userRole === "DOCTOR" &&
                  action !== "notes" &&
                  appointment.status.toLowerCase() !== "cancelled" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAction("notes")}
                      className="rounded-full"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      {appointment.notes ? "Modifier" : "Ajouter"}
                    </Button>
                  )}
              </div>

              {userRole === "DOCTOR" && action === "notes" ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Entrez vos notes cliniques ici..."
                    className="min-h-[120px] rounded-[1.25rem] border-emerald-100 bg-slate-50 dark:border-emerald-900/40 dark:bg-slate-900/80"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={notesLoading}
                      className="rounded-full"
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {notesLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-slate-900/80">
                  {appointment.notes ? (
                    <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {appointment.notes}
                    </p>
                  ) : (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                      Aucune note ajoutée pour le moment.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 flex-wrap gap-2">
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
                <Button
                  onClick={handleMarkCompleted}
                  disabled={completeLoading}
                  className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {completeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      En cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marquer terminé
                    </>
                  )}
                </Button>
              )}

              {appointment.status.toLowerCase() === "scheduled" && (
                <Button
                  variant="outline"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/30"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Annuler le rendez-vous
                    </>
                  )}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="rounded-full border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
            >
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
        background: "bg-emerald-50/70 dark:bg-emerald-950/20",
        border: "border-emerald-100 dark:border-emerald-900/40",
        icon: "text-emerald-700 dark:text-emerald-300",
        iconWrap: "bg-white dark:bg-slate-900",
        badge:
          "border-emerald-200 bg-white text-emerald-700 hover:bg-white dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-emerald-300",
      };
    case "cancelled":
      return {
        background: "bg-red-50/70 dark:bg-red-950/20",
        border: "border-red-100 dark:border-red-900/40",
        icon: "text-red-700 dark:text-red-300",
        iconWrap: "bg-white dark:bg-slate-900",
        badge:
          "border-red-200 bg-white text-red-700 hover:bg-white dark:border-red-900/50 dark:bg-slate-950/70 dark:text-red-300",
      };
    default:
      return {
        background: "bg-white/90 dark:bg-slate-950/70",
        border: "border-emerald-100 dark:border-emerald-900/40",
        icon: "text-emerald-700 dark:text-emerald-300",
        iconWrap: "bg-emerald-50 dark:bg-emerald-950/40",
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
      };
  }
}

function InfoTile({
  icon: Icon,
  label,
  value,
  large = false,
}: {
  icon: any;
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-slate-900/80">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        {label}
      </div>
      <p className={`${large ? "text-base" : "text-sm"} font-semibold text-slate-900 dark:text-slate-50`}>
        {value}
      </p>
    </div>
  );
}

function DetailBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 dark:border-emerald-900/40 dark:bg-slate-900/70">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
        <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
          {title}
        </h4>
      </div>
      <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
        {children}
      </p>
    </div>
  );
}
