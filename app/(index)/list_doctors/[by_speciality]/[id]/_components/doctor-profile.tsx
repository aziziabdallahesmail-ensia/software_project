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
    <div className="min-h-[calc(100vh-var(--header-height))] bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl space-y-8">
        <div className="page-header">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-secondary text-primary">
                  {doctor.imageUrl ? (
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.full_name ?? "Photo du médecin"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                  <Stethoscope className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-3">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {doctor.specialty}
                </Badge>
                <div className="space-y-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Dr. {doctor.full_name}
                  </h1>
                  <p className="text-muted-foreground max-w-lg">
                    Consultez son parcours, vérifiez ses créneaux disponibles et
                    réservez votre rendez-vous dans un cadre simple et rassurant.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <InfoBadge icon={Medal} text={`${doctor.experience} ans d'expérience`} />
                  <InfoBadge icon={CalendarCheck} text={`${totalSlots || 0} créneaux disponibles`} />
                </div>
              </div>
            </div>

            <Button
              onClick={toggleBooking}
              size="lg"
              className="lg:self-start"
            >
              {showBooking ? (
                <>
                  Masquer la réservation
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Prendre rendez-vous"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="space-y-6">
            <Card>
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
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="icon-container icon-container-sm bg-card">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Des créneaux sont disponibles
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ce praticien propose actuellement des rendez-vous sur
                        les prochains jours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Alert className="border-warning/30 bg-warning/5">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-warning">
                      Aucun créneau disponible pour les prochains jours. Vous
                      pourrez réessayer ultérieurement.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-container-md">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    À propos de Dr. {doctor.full_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Présentation du parcours et de l'expertise
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {doctor.description ||
                  "Ce médecin n'a pas encore ajouté de description. Vous pouvez toujours prendre rendez-vous pour une consultation."}
              </p>
            </CardContent>
          </Card>
        </div>

        {showBooking && (
          <div id="booking-section">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="icon-container icon-container-md">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Réserver un rendez-vous
                    </h2>
                    <p className="text-sm text-muted-foreground">
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
                  <div className="text-center py-8">
                    <div className="icon-container icon-container-lg mx-auto mb-4 bg-secondary text-muted-foreground">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      Aucun créneau disponible
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Ce médecin n'a aucun créneau de rendez-vous disponible
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
    </div>
  );
}

function InfoBadge({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {text}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="metric-card">
      <div className="icon-container icon-container-sm mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
