"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Clock3,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

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
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date || ""
  );

  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };

  const currentDayData = days.find((d) => d.date === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Choisir une date
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Commencez par sélectionner le jour souhaité.
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map((day) => {
          const hasSlots = day.slots.length > 0;
          const isSelected = selectedDay === day.date;

          return (
            <button
              key={day.date}
              onClick={() => hasSlots && setSelectedDay(day.date)}
              disabled={!hasSlots}
              className={`min-w-[108px] rounded-[1.5rem] border px-4 py-4 text-left transition ${
                isSelected
                  ? "border-emerald-300 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30"
                  : hasSlots
                    ? "border-emerald-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-slate-900/70 dark:hover:border-emerald-800/60 dark:hover:bg-slate-900"
                    : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900/50"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {format(new Date(day.date), "EEE", { locale: fr })}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {format(new Date(day.date), "d")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {format(new Date(day.date), "MMM", { locale: fr })}
              </p>
              <p className="mt-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {hasSlots ? `${day.slots.length} créneaux` : "Aucun créneau"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Horaires disponibles
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentDayData
                ? format(new Date(currentDayData.date), "EEEE d MMMM yyyy", {
                    locale: fr,
                  })
                : "Choisissez une date"}
            </p>
          </div>
        </div>

        {currentDayData && currentDayData.slots.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {currentDayData.slots.map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;

              return (
                <button
                  key={slot.startTime}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-medium transition ${
                    isSelected
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-800/60"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock3 className="h-4 w-4" />
                  )}
                  {format(new Date(slot.startTime), "HH:mm")}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.5rem] bg-slate-50 p-8 text-center dark:bg-slate-900/80">
            <p className="font-medium text-slate-900 dark:text-slate-50">
              Aucun créneau disponible pour cette date.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Veuillez sélectionner un autre jour.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className="rounded-full bg-emerald-600 px-6 py-6 text-white hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
