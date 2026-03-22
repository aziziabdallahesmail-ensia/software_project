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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background p-6">
        <div className="container mx-auto">
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Demande invalide</CardTitle>
              <CardDescription>
                Aucun identifiant de rendez-vous n&apos;a été fourni. Rejoignez
                l&apos;appel depuis votre liste de rendez-vous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/appointments">
                <Button className="w-full">Retour aux rendez-vous</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <VideoCall appointmentId={appointmentId} backLink="/appointments" />;
}
