"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  Medal,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Stethoscope,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlotPicker } from "./slot-picker";
import { AppointmentForm } from "./appointment-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Slot {
  startTime: string;
  endTime: string;
  formatted?: string;
}

interface Day {
  date: string;
  displayDate: string;
  slots: Slot[];
}

interface Doctor {
  id: string;
  full_name?: string;
  specialty: string;
  experience: number;
  description: string;
  imageUrl?: string;
}

interface DoctorProfileProps {
  doctor: Doctor;
  availableDays: Day[];
}

export function DoctorProfile({ doctor, availableDays }: DoctorProfileProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const router = useRouter();

  // Calculate total available slots
  const totalSlots = availableDays?.reduce(
    (total, day) => total + day.slots.length,
    0
  );

  const toggleBooking = () => {
    setShowBooking(!showBooking);
    if (!showBooking) {
      setTimeout(() => {
        document.getElementById("booking-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingComplete = () => {
    router.push("/appointments");
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Doctor Photo */}
          <div className="relative">
            <div className="w-36 h-36 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm shadow-xl border-4 border-white/30">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.full_name ?? "Doctor's photo"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Dr. {doctor.full_name}
            </h1>
            <Badge className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-1 mb-4">
              {doctor.specialty}
            </Badge>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Medal className="h-4 w-4 text-yellow-300" />
                <span className="text-white text-sm">
                  {doctor.experience} ans d&apos;expérience
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CalendarCheck className="h-4 w-4 text-white" />
                <span className="text-white text-sm">
                  {totalSlots || 0} créneaux disponibles
                </span>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <Button
            onClick={toggleBooking}
            size="lg"
            className="bg-white text-emerald-700 hover:bg-white/90 font-semibold px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            {showBooking ? (
              <>
                Masquer la réservation
                <ChevronUp className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Prendre Rendez-vous
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - About & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 border-2">
              <CardContent className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                  <Medal className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {doctor.experience}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Années d&apos;exp.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/30 border-2">
              <CardContent className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-teal-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {totalSlots || 0}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Créneaux
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Availability Alert */}
          {totalSlots > 0 ? (
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Disponible maintenant
                    </p>
                    <p className="text-slate-400 text-xs">
                      {totalSlots} créneaux sur les 4 prochains jours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-amber-300">
                Aucun créneau disponible pour les 4 prochains jours. Veuillez
                réessayer plus tard.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Column - Description */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 shadow-lg h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    À propos de Dr. {doctor.full_name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Parcours professionnel et expertise
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {doctor.description ||
                    "Ce médecin n'a pas encore ajouté de description. Vous pouvez toujours prendre rendez-vous pour une consultation."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Section */}
      {showBooking && (
        <div id="booking-section" className="animate-in slide-in-from-top-4">
          <Card className="border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-6 border-b border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Réserver un Rendez-vous
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Sélectionnez un créneau et fournissez les détails de votre
                    consultation
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              {totalSlots > 0 ? (
                <>
                  {!selectedSlot && (
                    <SlotPicker
                      days={availableDays}
                      onSelectSlot={handleSlotSelect}
                    />
                  )}

                  {selectedSlot && (
                    <AppointmentForm
                      doctorId={doctor.id}
                      slot={selectedSlot}
                      onBack={() => setSelectedSlot(null)}
                      onComplete={handleBookingComplete}
                    />
                  )}
                </>
              ) : (
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-4">
                      <Calendar className="h-8 w-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Aucun créneau disponible
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Ce médecin n&apos;a aucun créneau de rendez-vous disponible
                      pour les 4 prochains jours. Veuillez réessayer plus tard
                      ou essayer un autre médecin.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}