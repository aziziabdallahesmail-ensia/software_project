/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          icon={CheckCircle2}
          label="Disponibles"
          value={availableSlots.length}
        />
        <MetricCard icon={CalendarClock} label="Réservés" value={bookedSlots.length} />
      </div>

      <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
        {!showForm ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Créneaux actuels
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Les créneaux ouverts aux réservations patients.
                </p>
              </div>
              <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                {slots.length} créneau{slots.length > 1 ? "x" : ""}
              </Badge>
            </div>

            {slots.length === 0 ? (
              <div className="rounded-[1.5rem] bg-slate-50 p-8 text-center dark:bg-slate-900/80">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <p className="mt-4 font-semibold text-slate-900 dark:text-slate-50">
                  Aucun créneau défini
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Ajoutez vos disponibilités pour permettre aux patients de
                  réserver une consultation.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-emerald-100 bg-slate-50 p-4 dark:border-emerald-900/40 dark:bg-slate-900/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300">
                        <Clock3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-50">
                          {formatTimeString(slot.startTime)} -{" "}
                          {formatTimeString(slot.endTime)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Durée: 1 heure
                        </p>
                      </div>
                    </div>
                    <Badge className="rounded-full border border-emerald-200 bg-white px-4 py-1 text-slate-700 hover:bg-white dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200">
                      {slot.status === "booked" ? "Réservé" : "Disponible"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={() => setShowForm(true)}
              className="w-full rounded-full bg-emerald-600 py-6 text-white hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter un créneau de disponibilité
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Nouveau créneau
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Définissez l&apos;heure de début et de fin.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime", {
                    required: "L'heure de début est requise",
                  })}
                  className="h-12 rounded-2xl border-emerald-100 bg-slate-50 dark:border-emerald-900/40 dark:bg-slate-900/80"
                />
                {errors.startTime && (
                  <p className="flex items-center gap-1 text-sm font-medium text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register("endTime", {
                    required: "L'heure de fin est requise",
                  })}
                  className="h-12 rounded-2xl border-emerald-100 bg-slate-50 dark:border-emerald-900/40 dark:bg-slate-900/80"
                />
                {errors.endTime && (
                  <p className="flex items-center gap-1 text-sm font-medium text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="flex-1 rounded-full border-emerald-200 bg-white py-6 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-emerald-600 py-6 text-white hover:bg-emerald-700"
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
      </div>

      <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <AlertCircle className="h-4 w-4" />
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Les disponibilités définissent les créneaux visibles par les
            patients. Les rendez-vous déjà réservés restent conservés.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-white/85 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  );
}
