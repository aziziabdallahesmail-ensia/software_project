"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, Users } from "lucide-react";
import { initializeVideoCall, leaveVideoCall } from "@/actions/video-call";
import toast from "react-hot-toast";

interface VideoCallProps {
  appointmentId: string;
  backLink: string;
}

export default function VideoCall({ appointmentId, backLink }: VideoCallProps) {
  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const [room, setRoom] = useState<any>(null);
  const [localParticipant, setLocalParticipant] = useState<any>(null);
  const [remoteParticipant, setRemoteParticipant] = useState<any>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    let twilioRoom: any = null;

    async function connectToRoom() {
      try {
        setIsConnecting(true);
        setConnectionError(null);

        const result = await initializeVideoCall(appointmentId);

        if (!mounted) return;

        setAppointmentData(result.appointment);

        const Video = (await import("twilio-video")).default;

        twilioRoom = await Video.connect(result.token, {
          name: result.roomName,
          audio: true,
          video: { width: 1280, height: 720 },
        });

        if (!mounted) {
          twilioRoom.disconnect();
          return;
        }

        setRoom(twilioRoom);
        setLocalParticipant(twilioRoom.localParticipant);

        twilioRoom.localParticipant.tracks.forEach((publication: any) => {
          if (publication.track) {
            attachTrack(publication.track, localVideoRef.current);
          }
        });

        twilioRoom.participants.forEach((participant: any) => {
          handleParticipantConnected(participant);
        });

        twilioRoom.on("participantConnected", handleParticipantConnected);
        twilioRoom.on("participantDisconnected", handleParticipantDisconnected);

        setIsConnecting(false);
        toast.success("Connexion à l'appel vidéo établie");
      } catch (error: any) {
        console.error("Error connecting to room:", error);
        if (mounted) {
          setConnectionError(error.message || "Impossible de se connecter à l'appel vidéo");
          setIsConnecting(false);
          toast.error(error.message || "Impossible de se connecter");
        }
      }
    }

    connectToRoom();

    return () => {
      mounted = false;
      if (twilioRoom) {
        twilioRoom.disconnect();
      }
    };
  }, [appointmentId]);

  useEffect(() => {
    if (!room || isConnecting) return;

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [room, isConnecting]);

  function handleParticipantConnected(participant: any) {
    setRemoteParticipant(participant);

    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        attachTrack(publication.track, remoteVideoRef.current, remoteAudioRef.current);
      }
    });

    participant.on("trackSubscribed", (track: any) => {
      attachTrack(track, remoteVideoRef.current, remoteAudioRef.current);
    });
  }

  function handleParticipantDisconnected(participant: any) {
    setRemoteParticipant(null);
    toast(`${participant.identity} a quitté l'appel`);
  }

  function attachTrack(track: any, videoElement: HTMLElement | null, audioElement?: HTMLElement | null) {
    if (track.kind === "video" && videoElement) {
      track.attach(videoElement);
    } else if (track.kind === "audio" && audioElement) {
      track.attach(audioElement);
    }
  }

  const toggleCamera = () => {
    if (room && localParticipant) {
      localParticipant.videoTracks.forEach((publication: any) => {
        if (cameraOn) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setCameraOn(!cameraOn);
    }
  };

  const toggleMic = () => {
    if (room && localParticipant) {
      localParticipant.audioTracks.forEach((publication: any) => {
        if (micOn) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setMicOn(!micOn);
    }
  };

  const handleEndCall = async () => {
    try {
      if (room) {
        room.disconnect();
      }

      await leaveVideoCall(appointmentId);

      toast.success("Vous avez quitté l'appel.");
      router.push(backLink);
    } catch (error: any) {
      console.error("Error leaving call:", error);
      toast.error("Impossible de quitter l'appel correctement");
      router.push(backLink);
    }
  }

  function formatTime(s: number) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background p-6">
        <div className="container mx-auto">
          <PageTitle title="Appel vidéo" backLink={backLink} backLabel="Retour" />
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Erreur de connexion</CardTitle>
              <CardDescription>{connectionError}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push(backLink)} className="w-full">
                Revenir
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background p-6">
        <div className="container mx-auto">
          <PageTitle title="Appel vidéo" backLink={backLink} backLabel="Retour" />
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Connexion en cours...</CardTitle>
              <CardDescription>Veuillez patienter pendant la connexion à l&apos;appel.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const doctorName = appointmentData?.doctor?.full_name || "Docteur";
  const patientName = appointmentData?.patient?.full_name || "Patient";

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background p-6">
      <div className="container mx-auto">
        <PageTitle title="Appel vidéo" backLink={backLink} backLabel="Retour" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 relative overflow-hidden">
            <CardContent className="p-0 bg-black rounded-xl overflow-hidden">
              <div className="relative w-full h-[60vh] lg:h-[72vh] bg-black">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                <audio ref={remoteAudioRef} autoPlay />

                {!remoteParticipant && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <div className="text-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">En attente de l&apos;autre participant...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute right-4 bottom-4 w-36 h-24 lg:w-48 lg:h-32 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-white text-xs">
                    Caméra désactivée
                  </div>
                )}
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2 bg-card/90 backdrop-blur rounded-full p-2">
                <Button
                  variant={micOn ? "ghost" : "destructive"}
                  size="icon"
                  onClick={toggleMic}
                  title={micOn ? "Couper le micro" : "Réactiver le micro"}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={cameraOn ? "ghost" : "destructive"}
                  size="icon"
                  onClick={toggleCamera}
                  title={cameraOn ? "Couper la caméra" : "Réactiver la caméra"}
                >
                  {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleEndCall}
                  title="Quitter l'appel"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Participants</CardTitle>
              <CardDescription className="text-xs">
                Connexion sécurisée • {formatTime(seconds)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {doctorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{doctorName}</div>
                  <div className="text-xs text-muted-foreground">
                    {appointmentData?.doctor?.specialty || "Docteur"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-success flex items-center justify-center text-success-foreground text-sm font-medium">
                  {patientName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{patientName}</div>
                  <div className="text-xs text-muted-foreground">Patient</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
