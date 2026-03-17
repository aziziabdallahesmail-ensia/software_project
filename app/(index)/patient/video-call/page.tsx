"use client";

import VideoCall from "@/components/video-call";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientVideoCallPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_rgba(251,252,249,1)_0%,_rgba(244,247,242,1)_100%)] p-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_rgba(11,15,14,1)_0%,_rgba(8,11,10,1)_100%)]">
        <div className="container mx-auto">
          <Card className="mx-auto mt-8 max-w-md rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
            <CardHeader>
              <CardTitle>Demande invalide</CardTitle>
              <CardDescription>
                Aucun identifiant de rendez-vous n&apos;a été fourni. Rejoignez
                l&apos;appel depuis votre liste de rendez-vous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/appointments">
                <Button className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                  Retour aux rendez-vous
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <VideoCall appointmentId={appointmentId} backLink="/appointments" />;
}
