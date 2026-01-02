"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  CalendarClock,
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

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };

  const currentDayData = days.find((d) => d.date === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 p-6 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <CalendarClock className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Choisir un Créneau
            </h2>
            <p className="text-white/80 text-sm">
              Sélectionnez une date et un horaire disponible
            </p>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="h-5 w-5 text-teal-400" />
          <h3 className="text-lg font-semibold text-white">
            Sélectionnez une date
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {days.map((day) => {
            const hasSlots = day.slots.length > 0;
            const isSelected = selectedDay === day.date;

            return (
              <button
                key={day.date}
                onClick={() => hasSlots && setSelectedDay(day.date)}
                disabled={!hasSlots}
                className={`
                  relative flex-shrink-0 flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 min-w-[100px]
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500 shadow-lg shadow-teal-500/20"
                      : hasSlots
                        ? "bg-slate-800/50 border-slate-700 hover:border-teal-500/50 hover:bg-slate-800"
                        : "bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span
                  className={`text-xs uppercase tracking-wide ${isSelected ? "text-teal-400" : "text-slate-500"}`}
                >
                  {format(new Date(day.date), "EEE", { locale: fr })}
                </span>
                <span
                  className={`text-2xl font-bold mt-1 ${isSelected ? "text-white" : "text-slate-300"}`}
                >
                  {format(new Date(day.date), "d")}
                </span>
                <span
                  className={`text-xs mt-1 ${isSelected ? "text-teal-300" : "text-slate-500"}`}
                >
                  {format(new Date(day.date), "MMM", { locale: fr })}
                </span>
                {hasSlots && (
                  <span
                    className={`
                    mt-2 text-xs px-2 py-0.5 rounded-full font-medium
                    ${isSelected ? "bg-teal-500/30 text-teal-300" : "bg-slate-700 text-slate-400"}
                  `}
                  >
                    {day.slots.length} créneaux
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">
            Horaires disponibles
          </h3>
        </div>

        {currentDayData && currentDayData.slots.length > 0 ? (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

            <p className="text-slate-400 text-sm mb-4">
              {format(new Date(currentDayData.date), "EEEE d MMMM yyyy", {
                locale: fr,
              })}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentDayData.slots.map((slot) => {
                const isSelected = selectedSlot?.startTime === slot.startTime;

                return (
                  <Card
                    key={slot.startTime}
                    onClick={() => handleSlotSelect(slot)}
                    className={`
                      cursor-pointer transition-all duration-300 border-2
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20"
                          : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800"
                      }
                    `}
                  >
                    <CardContent className="p-4 flex items-center justify-center gap-2">
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-500" />
                      )}
                      <span
                        className={`font-medium ${isSelected ? "text-white" : "text-slate-300"}`}
                      >
                        {format(new Date(slot.startTime), "HH:mm")}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50 mb-4">
              <CalendarClock className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">
              Aucun créneau disponible pour cette date.
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Veuillez sélectionner une autre date.
            </p>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
          className={`
            px-8 py-6 rounded-xl font-semibold transition-all duration-300
            ${
              selectedSlot
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:scale-[1.02]"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          Continuer
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}