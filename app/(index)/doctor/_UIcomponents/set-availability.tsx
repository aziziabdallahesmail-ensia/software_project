"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Plus,
  Loader2,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { setAvailability } from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Slot {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  doctorId: string;
}

interface SetAvailabilityProps {
  slots: Slot[];
}

interface FormData {
  startTime: string;
  endTime: string;
}

export function SetAvailability({ slots }: SetAvailabilityProps) {
  const [showForm, setShowForm] = useState(false);

  // Custom hook for server action
  const {
    loading,
    execute: submitSlots,
    data: responseData,
  } = useFetch(setAvailability);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  function createLocalDateFromTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    return date;
  }

  // Handle slot submission
  const onSubmit = async (formData: FormData) => {
    if (loading) return;

    const submitFormData = new FormData();

    // Create date objects
    const startDate = createLocalDateFromTime(formData.startTime);
    const endDate = createLocalDateFromTime(formData.endTime);

    if (startDate >= endDate) {
      toast.error("L'heure de fin doit être après l'heure de début");
      return;
    }

    // Add to form data
    submitFormData.append("startTime", startDate.toISOString());
    submitFormData.append("endTime", endDate.toISOString());

    await submitSlots(submitFormData);
  };

  useEffect(() => {
    if (responseData && responseData?.success) {
      setShowForm(false);
      toast.success("Créneaux de disponibilité mis à jour avec succès");
    }
  }, [responseData]);

  // Format time string for display
  const formatTimeString = (dateString: Date | string): string => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch (e) {
      return "Heure invalide";
    }
  };

  // Count available vs booked slots
  const availableSlots = slots.filter((s) => s.status === "available");
  const bookedSlots = slots.filter((s) => s.status === "booked");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <CalendarClock className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Mes Disponibilités
              </h2>
              <p className="text-white/80 text-sm">
                Configurez vos créneaux de consultation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-white" />
              <span className="text-white font-medium text-sm">
                {slots.length} créneaux
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Disponibles
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {availableSlots.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Réservés
                </p>
                <p className="text-2xl font-bold text-amber-400">
                  {bookedSlots.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <CardContent className="p-6">
          {!showForm ? (
            <div className="space-y-6">
              {/* Current Slots */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Créneaux actuels
                </h3>

                {slots.length === 0 ? (
                  <div className="relative rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-700/50 p-8 text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 mb-4">
                        <CalendarClock className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="text-slate-300 font-medium mb-2">
                        Aucun créneau défini
                      </p>
                      <p className="text-slate-500 text-sm">
                        Ajoutez vos disponibilités pour permettre aux patients
                        de prendre rendez-vous.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {slots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className={`
                          relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
                          ${
                            slot.status === "booked"
                              ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30"
                              : "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30"
                          }
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`
                            h-12 w-12 rounded-xl flex items-center justify-center
                            ${
                              slot.status === "booked"
                                ? "bg-amber-500/20"
                                : "bg-green-500/20"
                            }
                          `}
                          >
                            <Clock
                              className={`h-6 w-6 ${slot.status === "booked" ? "text-amber-400" : "text-green-400"}`}
                            />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-lg">
                              {formatTimeString(slot.startTime)} -{" "}
                              {formatTimeString(slot.endTime)}
                            </p>
                            <p className="text-sm text-slate-400">
                              Durée: 1 heure
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`
                            font-medium px-3 py-1
                            ${
                              slot.status === "booked"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-green-500/20 text-green-300 border-green-500/40"
                            }
                          `}
                        >
                          {slot.status === "booked" ? "Réservé" : "Disponible"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Button */}
              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter un créneau de disponibilité
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-400" />
                  Nouveau créneau
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="startTime"
                    className="text-sm font-medium text-slate-300"
                  >
                    Heure de début
                  </Label>
                  <div className="relative">
                    <Input
                      id="startTime"
                      type="time"
                      {...register("startTime", {
                        required: "L'heure de début est requise",
                      })}
                      className="bg-slate-800/50 border-slate-700 text-white h-12 text-lg rounded-xl focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                  {errors.startTime && (
                    <p className="text-sm font-medium text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="endTime"
                    className="text-sm font-medium text-slate-300"
                  >
                    Heure de fin
                  </Label>
                  <div className="relative">
                    <Input
                      id="endTime"
                      type="time"
                      {...register("endTime", {
                        required: "L'heure de fin est requise",
                      })}
                      className="bg-slate-800/50 border-slate-700 text-white h-12 text-lg rounded-xl focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                  {errors.endTime && (
                    <p className="text-sm font-medium text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white py-6 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Enregistrer le créneau
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 border-purple-500/20 shadow-lg">
        <CardContent className="p-5">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                Comment fonctionnent les disponibilités ?
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Définir vos créneaux de disponibilité permet aux patients de
                réserver des consultations pendant ces horaires. Les mêmes
                disponibilités s&apos;appliquent à tous les jours. Vous pouvez
                modifier vos disponibilités à tout moment, mais les rendez-vous
                déjà réservés ne seront pas affectés.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}