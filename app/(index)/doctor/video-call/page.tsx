"use client";

import VideoCall from "@/components/video-call";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

/* Hallmark · design-system: design.md
 * Invalid-request state only; the call surface itself is VideoCall. */

export default function VideoCallPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  if (!appointmentId) {
    return (
      <div className="mx-auto w-full max-w-[36rem] px-4 py-12">
        <span className="icon-container icon-container-lg mb-4 border-warning/30 bg-warning-soft text-warning">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-medium tracking-display">
          Lien de consultation incomplet
        </h1>
        <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">
          Aucun identifiant de rendez-vous n&apos;a été fourni. Rejoignez la
          consultation depuis votre espace praticien.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/doctor">Retour</Link>
        </Button>
      </div>
    );
  }

  return <VideoCall appointmentId={appointmentId} backLink="/doctor" />;
}
