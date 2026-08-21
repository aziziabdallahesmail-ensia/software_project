"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CalendarX2 } from "lucide-react";

/* Hallmark · design-system: design.md
 * Times are machine-readable values → mono (.tabular).
 * Selection is carried by border + ground + aria-pressed, never colour alone. */

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

interface SlotPickerProps {
  days: Day[];
  onSelectSlot: (slot: Slot) => void;
}

export function SlotPicker({ days, onSelectSlot }: SlotPickerProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date || "",
  );

  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };

  const currentDayData = days.find((d) => d.date === selectedDay);

  return (
    <div className="flex flex-col gap-6">
      {/* Day strip */}
      <section>
        <h3 className="label-meta">Jour</h3>
        <div
          className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Choisir un jour"
        >
          {days.map((day) => {
            const hasSlots = day.slots.length > 0;
            const isSelected = selectedDay === day.date;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => {
                  if (hasSlots) {
                    setSelectedDay(day.date);
                    setSelectedSlot(null);
                  }
                }}
                disabled={!hasSlots}
                aria-pressed={isSelected}
                className={`w-[5.5rem] shrink-0 rounded-[var(--radius-card)] border px-3 py-3 text-center transition-[border-color,background-color] duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-primary bg-primary-soft"
                    : hasSlots
                      ? "border-border bg-card hover:border-primary/40"
                      : "cursor-not-allowed border-border-soft bg-muted/40 opacity-60"
                }`}
              >
                <span className="label-meta block">
                  {format(new Date(day.date), "EEE", { locale: fr })}
                </span>
                <span
                  className={`tabular mt-1 block text-xl font-medium ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {format(new Date(day.date), "d")}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {format(new Date(day.date), "MMM", { locale: fr })}
                </span>
                <span className="mt-2 block text-[0.6875rem] text-muted-foreground">
                  {hasSlots ? (
                    <>
                      <span className="tabular">{day.slots.length}</span>{" "}
                      {day.slots.length > 1 ? "créneaux" : "créneau"}
                    </>
                  ) : (
                    "complet"
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Times */}
      <section className="border-t border-border-soft pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="label-meta">Horaire</h3>
          {currentDayData && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(currentDayData.date), "EEEE d MMMM yyyy", {
                locale: fr,
              })}
            </p>
          )}
        </div>

        {currentDayData && currentDayData.slots.length > 0 ? (
          <div
            className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(min(100%,5rem),1fr))] gap-2"
            role="group"
            aria-label="Choisir un horaire"
          >
            {currentDayData.slots.map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;

              return (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  aria-pressed={isSelected}
                  className={`tabular rounded-[var(--radius-control)] border px-2 py-2.5 text-sm transition-[border-color,background-color,color] duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  {format(new Date(slot.startTime), "HH:mm")}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-card)] border border-border-soft bg-muted/40 p-4">
            <CalendarX2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aucun créneau ce jour-là. Choisissez une autre date.
            </p>
          </div>
        )}
      </section>

      <div className="flex justify-end border-t border-border-soft pt-5">
        <Button onClick={confirmSelection} disabled={!selectedSlot} size="lg">
          {selectedSlot
            ? `Continuer avec ${format(new Date(selectedSlot.startTime), "HH:mm")}`
            : "Choisissez un créneau"}
        </Button>
      </div>
    </div>
  );
}
