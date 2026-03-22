"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock3,
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
import { Card, CardContent } from "@/components/ui/card";

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

  const {
    loading,
    execute: submitSlots,
    data: responseData,
  } = useFetch(setAvailability);

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
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
  }

  const onSubmit = async (formData: FormData) => {
    if (loading) return;

    const submitFormData = new FormData();
    const startDate = createLocalDateFromTime(formData.startTime);
    const endDate = createLocalDateFromTime(formData.endTime);

    if (startDate >= endDate) {
      toast.error("L'heure de fin doit être après l'heure de début");
      return;
    }

    submitFormData.append("startTime", startDate.toISOString());
    submitFormData.append("endTime", endDate.toISOString());

    await submitSlots(submitFormData);
  };

  useEffect(() => {
    if (responseData?.success) {
      setShowForm(false);
      toast.success("Créneaux de disponibilité mis à jour avec succès");
    }
  }, [responseData]);

  const formatTimeString = (dateString: Date | string): string => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return "Heure invalide";
    }
  };

  const availableSlots = slots.filter((s) => s.status === "available");
  const bookedSlots = slots.filter((s) => s.status === "booked");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard
          icon={CheckCircle2}
          label="Disponibles"
          value={availableSlots.length}
        />
        <MetricCard icon={CalendarClock} label="Réservés" value={bookedSlots.length} />
      </div>

      <Card>
        <CardContent className="p-5">
          {!showForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Créneaux actuels
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Les créneaux ouverts aux réservations patients.
                  </p>
                </div>
                <Badge variant="secondary">
                  {slots.length} créneau{slots.length > 1 ? "x" : ""}
                </Badge>
              </div>

              {slots.length === 0 ? (
                <div className="text-center py-6">
                  <div className="icon-container icon-container-md mx-auto mb-3 bg-secondary text-muted-foreground">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Aucun créneau défini
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajoutez vos disponibilités pour permettre aux patients de
                    réserver une consultation.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="icon-container icon-container-sm bg-card">
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {formatTimeString(slot.startTime)} -{" "}
                            {formatTimeString(slot.endTime)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Durée: 1 heure
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={slot.status === "booked" ? "info" : "outline"}
                      >
                        {slot.status === "booked" ? "Réservé" : "Disponible"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={() => setShowForm(true)}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un créneau
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Nouveau créneau
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Définissez l'heure de début et de fin.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="iconSm"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-xs">Heure de début</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime", {
                      required: "L'heure de début est requise",
                    })}
                  />
                  {errors.startTime && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-xs">Heure de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register("endTime", {
                      required: "L'heure de fin est requise",
                    })}
                  />
                  {errors.endTime && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30">
        <div className="icon-container icon-container-sm bg-card flex-shrink-0">
          <AlertCircle className="h-4 w-4" />
        </div>
        <p className="text-xs text-muted-foreground">
          Les disponibilités définissent les créneaux visibles par les
          patients. Les rendez-vous déjà réservés restent conservés.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="metric-card">
      <div className="icon-container icon-container-sm mb-2">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
