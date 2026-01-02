"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
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
  const [action, setAction] = useState<string | null>(null); // 'cancel' or 'notes'
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

  // UseFetch hooks for server actions
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

  // Format date and time
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Format time only
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  // Check if appointment can be marked as completed
  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status.toLowerCase() !== "scheduled") {
      return false;
    }
    const now = new Date();
    const appointmentStartTime = new Date(appointment.startTime);
    return now >= appointmentStartTime;
  };

  // Handle cancel appointment
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

  // Handle mark as completed
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

  // Handle save notes (doctor only)
  const handleSaveNotes = async () => {
    if (notesLoading || userRole !== "DOCTOR") return;

    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
  };

  // Handle successful operations
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

  // Determine other party information based on user role
  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;

  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Médecin";
  const otherPartyIcon = userRole === "DOCTOR" ? <User /> : <Stethoscope />;

  // Status color scheme
  const getStatusColors = () => {
    const status = appointment.status.toLowerCase();
    switch (status) {
      case "completed":
        return {
          bg: "bg-gradient-to-br from-green-500/10 to-teal-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          badge: "bg-green-500/20 text-green-300 border-green-500/40",
        };
      case "cancelled":
        return {
          bg: "bg-gradient-to-br from-red-500/10 to-rose-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-300 border-red-500/40",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        };
    }
  };

  const statusColors = getStatusColors();

  return (
    <>
      <Card className={`${statusColors.bg} ${statusColors.border} border-2 hover:shadow-lg hover:scale-[1.01] transition-all duration-300`}>
        <CardContent className="p-6">
          {/* Status Badge - Top Right */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`${statusColors.bg} rounded-xl p-3 shadow-md`}>
                {otherPartyIcon}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {otherPartyLabel}
                </p>
                <h3 className="text-lg font-bold text-white">
                  {userRole === "DOCTOR"
                    ? otherParty.full_name
                    : `Dr. ${otherParty.full_name}`}
                </h3>
                {userRole === "PATIENT" && (
                  <p className="text-sm text-muted-foreground">
                    {otherParty.specialty}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={`${statusColors.badge} font-semibold px-3 py-1`}
              >
                {appointment.status}
              </Badge>
              {appointment.videoRoomName && (
                <Badge
                  variant="outline"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold px-3 py-1"
                >
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className={`h-px ${statusColors.border} mb-4`}></div>

          {/* Date & Time Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 bg-background/40 rounded-lg p-3">
              <Calendar className={`h-5 w-5 ${statusColors.text}`} />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-white">
                  {format(new Date(appointment.startTime), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-background/40 rounded-lg p-3">
              <Clock className={`h-5 w-5 ${statusColors.text}`} />
              <div>
                <p className="text-xs text-muted-foreground">Heure</p>
                <p className="text-sm font-medium text-white">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Video Call Duration - Show for completed appointments with video calls */}
          {appointment.status.toLowerCase() === "completed" && appointment.callDurationMinutes && (
            <div className="mb-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-400" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Durée de la consultation vidéo</p>
                  <p className="text-sm font-semibold text-purple-300">
                    {appointment.callDurationMinutes} minutes
                  </p>
                </div>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/40">
                  Terminée
                </Badge>
              </div>
            </div>
          )}

          {/* Video Call Section - Prominent for scheduled appointments */}
          {appointment.status.toLowerCase() === "scheduled" && (
            <div className="mb-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Video className="h-5 w-5 text-purple-400" />
                <h4 className="text-sm font-semibold text-purple-300">Consultation vidéo</h4>
                {appointment.videoRoomName && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/40 text-xs">
                    Salle créée
                  </Badge>
                )}
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {canMarkCompleted() && (
              <Button
                size="sm"
                onClick={handleMarkCompleted}
                disabled={completeLoading}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium"
              >
                {completeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Marquer terminé
                  </>
                )}
              </Button>
            )}
            
            {/* Cancel Button - Visible on card for scheduled appointments */}
            {appointment.status.toLowerCase() === "scheduled" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelAppointment}
                disabled={cancelLoading}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium"
              >
                {cancelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </>
                )}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              className={`${statusColors.border} ${statusColors.text} hover:bg-background/60 font-medium`}
              onClick={() => setOpen(true)}
            >
              <FileText className="h-4 w-4 mr-1" />
              Voir les détails
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className={`h-6 w-6 ${statusColors.text}`} />
                Détails du rendez-vous
              </DialogTitle>
              <Badge
                variant="outline"
                className={`${statusColors.badge} font-semibold px-3 py-1`}
              >
                {appointment.status}
              </Badge>
            </div>
            <DialogDescription>
              {appointment.status.toLowerCase() === "scheduled"
                ? "Gérer votre rendez-vous à venir"
                : "Voir les informations du rendez-vous"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Other Party Information */}
            <div className={`${statusColors.bg} rounded-xl p-4 ${statusColors.border} border`}>
              <div className="flex items-center gap-4">
                <div className={`bg-background/60 rounded-full p-4 ${statusColors.text}`}>
                  {otherPartyIcon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {otherPartyLabel}
                  </p>
                  <p className="text-xl font-bold text-white">
                    {userRole === "DOCTOR"
                      ? otherParty.full_name
                      : `Dr. ${otherParty.full_name}`}
                  </p>
                  {userRole === "DOCTOR" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {otherParty.email}
                    </p>
                  )}
                  {userRole === "PATIENT" && (
                    <p className={`text-sm ${statusColors.text} font-medium mt-1`}>
                      {otherParty.specialty}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Appointment Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/40 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className={`h-5 w-5 ${statusColors.text}`} />
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                    Date
                  </h4>
                </div>
                <p className="text-lg font-medium text-white">
                  {formatDateTime(appointment.startTime)}
                </p>
              </div>
              <div className="bg-background/40 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className={`h-5 w-5 ${statusColors.text}`} />
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                    Durée
                  </h4>
                </div>
                <p className="text-lg font-medium text-white">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </p>
              </div>
            </div>

            {/* Video Call Information */}
            {appointment.videoRoomName && (
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Video className="h-6 w-6 text-purple-400" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wide">
                      Consultation vidéo
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {appointment.status.toLowerCase() === "completed" 
                        ? "Consultation terminée"
                        : "Salle de consultation vidéo créée"}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      appointment.status.toLowerCase() === "completed"
                        ? "bg-green-500/20 text-green-300 border-green-500/40"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    }
                  >
                    {appointment.status.toLowerCase() === "completed" ? "Terminée" : "Active"}
                  </Badge>
                </div>
                {appointment.callDurationMinutes && (
                  <div className="bg-background/40 rounded-lg p-3 border border-purple-500/30">
                    <p className="text-sm text-white">
                      <span className="text-muted-foreground">Durée de l'appel:</span>{" "}
                      <span className="font-semibold text-purple-300">{appointment.callDurationMinutes} minutes</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Patient Description */}
            {appointment.patientDescription && (
              <div className="bg-background/40 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className={`h-5 w-5 ${statusColors.text}`} />
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                    {userRole === "DOCTOR"
                      ? "Description du patient"
                      : "Votre description"}
                  </h4>
                </div>
                <p className="text-white leading-relaxed whitespace-pre-line">
                  {appointment.patientDescription}
                </p>
              </div>
            )}

            {/* Doctor Notes */}
            <div className="bg-background/40 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className={`h-5 w-5 ${statusColors.text}`} />
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
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
                      className={`${statusColors.text} hover:bg-background/60 font-medium`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {appointment.notes ? "Modifier les notes" : "Ajouter des notes"}
                    </Button>
                  )}
              </div>

              {userRole === "DOCTOR" && action === "notes" ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Entrez vos notes cliniques ici..."
                    className="bg-background border-border min-h-[120px] text-white"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={notesLoading}
                      className="border-border"
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                    >
                      {notesLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Enregistrer les notes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-background/60 rounded-lg p-4 border border-border/50 min-h-[100px]">
                  {appointment.notes ? (
                    <p className="text-white leading-relaxed whitespace-pre-line">
                      {appointment.notes}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground italic">
                        Aucune note ajoutée pour le moment
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              {/* Join Video Call Button - Prominent in dialog */}
              {appointment.status.toLowerCase() === "scheduled" && (
                <JoinCallButton
                  appointmentId={appointment.id}
                  startTime={appointment.startTime}
                  endTime={appointment.endTime}
                  status={appointment.status}
                  userRole={userRole.toLowerCase() as "doctor" | "patient"}
                />
              )}
              
              {/* Mark as Complete Button - Only for doctors */}
              {canMarkCompleted() && (
                <Button
                  onClick={handleMarkCompleted}
                  disabled={completeLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold"
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

              {/* Cancel Button - For scheduled appointments */}
              {appointment.status.toLowerCase() === "scheduled" && (
                <Button
                  variant="outline"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Annuler le rendez-vous
                    </>
                  )}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}