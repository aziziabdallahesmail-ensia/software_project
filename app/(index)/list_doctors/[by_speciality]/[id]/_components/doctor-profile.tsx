"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Stethoscope, CalendarCheck, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotPicker } from "./slot-picker";
import { AppointmentForm } from "./appointment-form";

/* Hallmark · macrostructure: Catalogue (detail view) · design-system: design.md
 * Identity + about on the left, booking as the right rail. State machine is
 * unchanged: toggle → pick slot → confirm → /appointments. */

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
    0,
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
    <div>
      {/* Identity */}
      <header className="page-header">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-border bg-muted text-muted-foreground">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <User className="h-7 w-7" />
              )}
            </span>

            <div className="min-w-0">
              <p className="label-meta">{doctor.specialty}</p>
              <h1 className="mt-1.5 font-display text-2xl font-medium leading-tight tracking-display sm:text-3xl">
                Dr. {doctor.full_name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="success">Praticien vérifié</Badge>
                {typeof doctor.experience === "number" &&
                  doctor.experience > 0 && (
                    <Badge variant="secondary" dot={false}>
                      <span className="tabular">{doctor.experience}</span>
                      {doctor.experience > 1 ? " ans" : " an"} d&apos;expérience
                    </Badge>
                  )}
              </div>
            </div>
          </div>

          <Button
            onClick={toggleBooking}
            size="lg"
            variant={showBooking ? "outline" : "default"}
            className="shrink-0"
          >
            {showBooking ? (
              <>
                Masquer les créneaux
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <CalendarCheck className="h-4 w-4" />
                Prendre rendez-vous
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        {/* About */}
        <section className="surface p-5">
          <h2 className="label-meta">Présentation</h2>
          <p className="measure mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {doctor.description ||
              "Ce praticien n'a pas encore ajouté de présentation. Vous pouvez néanmoins réserver une consultation."}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-control)] border border-border-soft bg-border-soft">
            <div className="bg-card p-3.5">
              <dt className="label-meta">Spécialité</dt>
              <dd className="mt-1 truncate text-sm font-medium">
                {doctor.specialty}
              </dd>
            </div>
            <div className="bg-card p-3.5">
              <dt className="label-meta">Créneaux ouverts</dt>
              <dd className="tabular mt-1 text-sm font-medium">
                {totalSlots ?? 0}
              </dd>
            </div>
          </dl>
        </section>

        {/* Availability summary */}
        <section className="surface p-5">
          <div className="flex items-center justify-between gap-3 border-b border-border-soft pb-3">
            <h2 className="label-meta">Disponibilités</h2>
            {totalSlots > 0 ? (
              <Badge variant="success">Créneaux ouverts</Badge>
            ) : (
              <Badge variant="warning">Complet</Badge>
            )}
          </div>

          {totalSlots > 0 ? (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="tabular text-foreground">{totalSlots}</span>{" "}
                {totalSlots > 1 ? "créneaux répartis" : "créneau réparti"} sur
                les prochains jours.
              </p>
              {!showBooking && (
                <Button onClick={toggleBooking} className="mt-4">
                  <CalendarCheck className="h-4 w-4" />
                  Voir les créneaux
                </Button>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Ce praticien n&apos;a aucun créneau ouvert pour les prochains
              jours. Réessayez plus tard ou consultez un autre praticien de la
              même spécialité.
            </p>
          )}
        </section>
      </div>

      {/* Booking */}
      {showBooking && (
        <section id="booking-section" className="surface mt-6 p-5 lg:p-6">
          <div className="border-b border-border pb-4">
            <h2 className="font-display text-lg font-medium tracking-display">
              Réserver un rendez-vous
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choisissez un créneau, puis confirmez le motif de votre
              consultation.
            </p>
          </div>

          <div className="pt-5">
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
              <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border-soft bg-muted/40 p-4">
                <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Aucun créneau disponible pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
