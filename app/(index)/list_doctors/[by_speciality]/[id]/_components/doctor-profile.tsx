/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock3,
  Medal,
  FileText,
  ChevronUp,
  AlertCircle,
  Stethoscope,
  CalendarCheck,
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
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="grid gap-8 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
          <div className="relative">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.75rem] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.full_name ?? "Photo du médecin"}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
              <Stethoscope className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              {doctor.specialty}
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                Dr. {doctor.full_name}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Consultez son parcours, vérifiez ses créneaux disponibles et
                réservez votre rendez-vous dans un cadre simple et rassurant.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <InfoBadge icon={Medal} text={`${doctor.experience} ans d'expérience`} />
              <InfoBadge icon={CalendarCheck} text={`${totalSlots || 0} créneaux disponibles`} />
            </div>
          </div>

          <Button
            onClick={toggleBooking}
            size="lg"
            className="rounded-full bg-emerald-600 px-8 py-6 text-white hover:bg-emerald-700"
          >
            {showBooking ? (
              <>
                Masquer la réservation
                <ChevronUp className="ml-2 h-5 w-5" />
              </>
            ) : (
              "Prendre rendez-vous"
            )}
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  icon={Medal}
                  value={String(doctor.experience)}
                  label="Années d'expérience"
                />
                <MetricCard
                  icon={Calendar}
                  value={String(totalSlots || 0)}
                  label="Créneaux disponibles"
                />
              </div>

              {totalSlots > 0 ? (
                <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        Des créneaux sont disponibles
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Ce praticien propose actuellement des rendez-vous sur
                        les prochains jours.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert className="rounded-[1.5rem] border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    Aucun créneau disponible pour les prochains jours. Vous
                    pourrez réessayer ultérieurement.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
          <CardContent className="p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  À propos de Dr. {doctor.full_name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Présentation du parcours et de l&apos;expertise
                </p>
              </div>
            </div>

            <p className="whitespace-pre-line text-base leading-7 text-slate-600 dark:text-slate-300">
              {doctor.description ||
                "Ce médecin n'a pas encore ajouté de description. Vous pouvez toujours prendre rendez-vous pour une consultation."}
            </p>
          </CardContent>
        </Card>
      </div>

      {showBooking && (
        <div id="booking-section">
          <Card className="rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Réserver un rendez-vous
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Choisissez un créneau puis confirmez les détails de votre
                    consultation.
                  </p>
                </div>
              </div>

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
                <div className="rounded-[1.5rem] bg-slate-50 p-8 text-center dark:bg-slate-900/80">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Aucun créneau disponible
                  </h3>
                  <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Ce médecin n&apos;a aucun créneau de rendez-vous disponible
                    pour les prochains jours. Veuillez réessayer plus tard ou
                    consulter un autre praticien.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoBadge({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 dark:border-emerald-900/40 dark:bg-slate-900/80 dark:text-slate-200">
      <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
      {text}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-slate-900/80">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
