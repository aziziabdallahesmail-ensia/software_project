"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { setAvailability } from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * Slots are a list, not a card grid. Times are mono so columns align. */

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
      minutes,
    );
  }

  const onSubmit = async (formData: FormData) => {
    if (loading) return;

    const submitFormData = new FormData();
    const startDate = createLocalDateFromTime(formData.startTime);
    const endDate = createLocalDateFromTime(formData.endTime);

    if (startDate >= endDate) {
      toast.error("L'heure de fin doit être après l'heure de début.");
      return;
    }

    submitFormData.append("startTime", startDate.toISOString());
    submitFormData.append("endTime", endDate.toISOString());

    await submitSlots(submitFormData);
  };

  useEffect(() => {
    if (responseData?.success) {
      setShowForm(false);
      toast.success("Disponibilités mises à jour.");
    }
  }, [responseData]);

  const formatTimeString = (dateString: Date | string): string => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return "--:--";
    }
  };

  const availableSlots = slots.filter((s) => s.status === "available");
  const bookedSlots = slots.filter((s) => s.status === "booked");

  return (
    <div className="surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-soft pb-4">
        <dl className="flex flex-wrap gap-x-6 gap-y-1">
          <div className="flex items-baseline gap-2">
            <dd className="tabular text-lg font-medium">
              {availableSlots.length}
            </dd>
            <dt className="text-xs text-muted-foreground">libres</dt>
          </div>
          <div className="flex items-baseline gap-2">
            <dd className="tabular text-lg font-medium">
              {bookedSlots.length}
            </dd>
            <dt className="text-xs text-muted-foreground">réservés</dt>
          </div>
        </dl>

        <Button
          size="sm"
          variant={showForm ? "ghost" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Fermer
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Ajouter un créneau
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-b border-border-soft py-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Début</Label>
              <Input
                id="startTime"
                type="time"
                className="tabular"
                aria-invalid={errors.startTime ? true : undefined}
                {...register("startTime", {
                  required: "Heure de début requise",
                })}
              />
              {errors.startTime && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">Fin</Label>
              <Input
                id="endTime"
                type="time"
                className="tabular"
                aria-invalid={errors.endTime ? true : undefined}
                {...register("endTime", { required: "Heure de fin requise" })}
              />
              {errors.endTime && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Le créneau est enregistré pour la journée en cours et découpé
            automatiquement en consultations.
          </p>

          <div className="mt-4 flex justify-end">
            <Button type="submit" size="sm" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      )}

      {slots.length > 0 ? (
        <ul className="index-list mt-4">
          {slots.map((slot) => (
            <li key={slot.id} className="index-row">
              <span className="tabular text-sm font-medium text-foreground">
                {formatTimeString(slot.startTime)} –{" "}
                {formatTimeString(slot.endTime)}
              </span>
              <span className="text-xs text-muted-foreground first-letter:uppercase">
                {format(new Date(slot.startTime), "EEE d MMM", { locale: fr })}
              </span>
              <span className="ml-auto">
                {slot.status === "available" ? (
                  <Badge variant="success">Libre</Badge>
                ) : slot.status === "booked" ? (
                  <Badge variant="info">Réservé</Badge>
                ) : (
                  <Badge variant="secondary">Bloqué</Badge>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          Aucun créneau défini. Ajoutez une plage horaire pour que les patients
          puissent réserver.
        </p>
      )}
    </div>
  );
}
