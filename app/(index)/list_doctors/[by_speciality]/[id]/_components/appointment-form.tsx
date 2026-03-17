"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Loader2,
  Clock3,
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { bookAppointment } from "@/actions/patient";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

interface Slot {
  startTime: string;
  endTime: string;
  formatted?: string;
}

interface AppointmentFormProps {
  doctorId: string;
  slot: Slot;
  onBack: () => void;
  onComplete: () => void;
}

export function AppointmentForm({
  doctorId,
  slot,
  onBack,
  onComplete,
}: AppointmentFormProps) {
  const [description, setDescription] = useState("");

  const { loading, data, execute: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);

    await submitBooking(formData);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Rendez-vous réservé avec succès !");
      onComplete();
    }
  }, [data, onComplete]);

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
            <Calendar className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Date
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">
            {format(new Date(slot.startTime), "EEEE d MMMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
            <Clock3 className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Horaire
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <Label htmlFor="description" className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Décrivez votre besoin médical
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Optionnel, mais utile pour préparer la consultation.
            </p>
          </div>
        </div>

        <Textarea
          id="description"
          placeholder="Expliquez brièvement le motif de votre consultation, vos symptômes ou la question que vous souhaitez aborder."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-32 rounded-[1.25rem] border-emerald-100 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500 dark:border-emerald-900/40 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <div className="mt-4 flex items-start gap-3 rounded-[1.25rem] bg-slate-50 p-4 dark:bg-slate-900/80">
          <Stethoscope className="mt-0.5 h-4 w-4 text-emerald-700 dark:text-emerald-300" />
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Ces informations seront partagées avec le médecin avant votre
            rendez-vous afin de faciliter la prise en charge.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex-1 rounded-full border-emerald-200 bg-white py-6 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Changer de créneau
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-emerald-600 py-6 text-white hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Réservation en cours...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Confirmer la réservation
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
