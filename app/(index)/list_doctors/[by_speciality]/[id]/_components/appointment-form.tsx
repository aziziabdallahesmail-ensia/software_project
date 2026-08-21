"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, ArrowLeft } from "lucide-react";
import { bookAppointment } from "@/actions/patient";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

/* Hallmark · design-system: design.md
 * Confirmation step. The chosen slot is restated as a read-only summary in
 * mono, so the patient can verify before committing. */

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
      toast.success("Rendez-vous réservé.");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Read-only summary of the chosen slot */}
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border sm:grid-cols-2">
        <div className="bg-card p-4">
          <dt className="label-meta">Date</dt>
          <dd className="mt-1.5 text-sm font-medium first-letter:uppercase">
            {format(new Date(slot.startTime), "EEEE d MMMM yyyy", {
              locale: fr,
            })}
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-meta">Horaire</dt>
          <dd className="tabular mt-1.5 text-sm font-medium">
            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
          </dd>
        </div>
      </dl>

      <div>
        <Label htmlFor="description">Motif de la consultation</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Facultatif. Ces informations sont transmises au praticien avant le
          rendez-vous.
        </p>
        <Textarea
          id="description"
          placeholder="Décrivez brièvement vos symptômes ou la question que vous souhaitez aborder."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2.5 min-h-28"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border-soft pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
          Changer de créneau
        </Button>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Réservation…" : "Confirmer le rendez-vous"}
        </Button>
      </div>
    </form>
  );
}
