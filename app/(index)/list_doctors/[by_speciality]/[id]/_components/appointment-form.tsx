"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Loader2,
  Clock,
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

  // Use the useFetch hook to handle loading, data, and error states
  const { loading, data, execute: submitBooking } = useFetch(bookAppointment);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);

    // Submit booking using the function from useFetch
    await submitBooking(formData);
  };

  // Handle response after booking attempt
  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Rendez-vous réservé avec succès !");
        onComplete();
      }
    }
  }, [data, onComplete]);

  // Format time for display
  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-500 p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Confirmer le Rendez-vous
            </h2>
            <p className="text-white/80 text-sm">
              Vérifiez les détails et confirmez votre réservation
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appointment Details Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-emerald-500/30 p-6 shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Détails du Rendez-vous
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-white font-semibold">
                    {format(new Date(slot.startTime), "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-500/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Horaire
                  </p>
                  <p className="text-white font-semibold">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-400" />
              </div>
              <Label
                htmlFor="description"
                className="text-white font-semibold"
              >
                Décrivez votre préoccupation médicale
              </Label>
              <span className="text-xs text-slate-500 ml-auto">(optionnel)</span>
            </div>

            <Textarea
              id="description"
              placeholder="Veuillez fournir des détails sur votre préoccupation médicale ou ce que vous aimeriez discuter lors du rendez-vous..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-32 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 resize-none"
            />

            <p className="text-sm text-slate-400 flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">💡</span>
              Ces informations seront partagées avec le médecin avant votre
              rendez-vous.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white py-6 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Changer de créneau
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Réservation en cours...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirmer la Réservation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}