"use client";

import { Button } from "@/components/ui/button";
import { Video, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Hallmark · design-system: design.md
 * Eligibility logic unchanged (10-minute buffers either side, re-checked every
 * minute). Copy translated to French — the rest of the platform is French. */

interface JoinCallButtonProps {
  appointmentId: string;
  startTime: Date | string;
  endTime: Date | string;
  status: string;
  userRole: "doctor" | "patient";
}

export function JoinCallButton({
  appointmentId,
  startTime,
  endTime,
  status,
  userRole,
}: JoinCallButtonProps) {
  const [canJoin, setCanJoin] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    function checkEligibility() {
      // Only scheduled appointments can be joined
      if (status !== "scheduled") {
        setCanJoin(false);
        setReason("Consultation non disponible");
        return;
      }

      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      // Allow joining 10 minutes before start time
      const startBuffer = new Date(start);
      startBuffer.setMinutes(startBuffer.getMinutes() - 10);

      // Allow joining up to 10 minutes after end time
      const endBuffer = new Date(end);
      endBuffer.setMinutes(endBuffer.getMinutes() + 10);

      if (now < startBuffer) {
        const minutesUntil = Math.floor(
          (startBuffer.getTime() - now.getTime()) / 60000,
        );
        setCanJoin(false);
        setReason(
          minutesUntil >= 60
            ? `Ouvre dans ${Math.floor(minutesUntil / 60)} h`
            : `Ouvre dans ${minutesUntil} min`,
        );
      } else if (now > endBuffer) {
        setCanJoin(false);
        setReason("Créneau expiré");
      } else {
        setCanJoin(true);
        setReason("");
      }
    }

    checkEligibility();
    // Re-check every minute
    const interval = setInterval(checkEligibility, 60000);

    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  const videoCallPath =
    userRole === "doctor"
      ? `/doctor/video-call?appointmentId=${appointmentId}`
      : `/patient/video-call?appointmentId=${appointmentId}`;

  if (status === "completed") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <XCircle className="h-4 w-4" />
        Consultation terminée
      </Button>
    );
  }

  if (status === "cancelled") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <XCircle className="h-4 w-4" />
        Annulée
      </Button>
    );
  }

  if (!canJoin) {
    return (
      <Button variant="ghost" size="sm" disabled title={reason}>
        <Clock className="h-4 w-4" />
        {reason}
      </Button>
    );
  }

  return (
    <Button size="sm" asChild>
      <Link href={videoCallPath}>
        <Video className="h-4 w-4" />
        Rejoindre la consultation
      </Link>
    </Button>
  );
}
