"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from "lucide-react";
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
  const [userRole, setUserRole] = useState<"doctor" | "patient" | null>(null);

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
        setUserRole(result.userRole === "doctor" ? "doctor" : "patient");

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
      <div className="mx-auto w-full max-w-[36rem] px-4 py-12">
        <PageTitle
          title="Consultation vidéo"
          eyebrow="Connexion interrompue"
          backLink={backLink}
          backLabel="Retour"
        />
        <div className="surface flex items-start gap-3 border-destructive/25 bg-destructive-soft p-5">
          <PhoneOff className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="min-w-0">
            <h2 className="font-display text-base font-medium tracking-display text-destructive">
              La connexion a échoué
            </h2>
            <p className="mt-1 break-words text-sm text-destructive/90">
              {connectionError}
            </p>
          </div>
        </div>
        <Button className="mt-6" onClick={() => router.push(backLink)}>
          Revenir
        </Button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="mx-auto w-full max-w-[36rem] px-4 py-12">
        <PageTitle
          title="Consultation vidéo"
          eyebrow="Connexion"
          backLink={backLink}
          backLabel="Retour"
        />
        <div className="surface flex items-center gap-3 p-5">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Établissement de la connexion sécurisée…
          </p>
        </div>
      </div>
    );
  }

  const doctorName = appointmentData?.doctor?.full_name || "Praticien";
  const patientName = appointmentData?.patient?.full_name || "Patient";

  // The local participant is whoever is watching; the other side is present
  // only once their tracks arrive.
  const viewerIsDoctor = userRole === "doctor";
  const participants = [
    {
      key: "doctor",
      name: doctorName,
      role: appointmentData?.doctor?.specialty || "Praticien",
      isViewer: viewerIsDoctor,
      present: viewerIsDoctor || Boolean(remoteParticipant),
    },
    {
      key: "patient",
      name: patientName,
      role: "Patient",
      isViewer: !viewerIsDoctor,
      present: !viewerIsDoctor || Boolean(remoteParticipant),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[88rem] px-4 py-8 lg:px-6">
      <PageTitle
        title="Consultation vidéo"
        eyebrow="En cours"
        backLink={backLink}
        backLabel="Retour"
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
        {/* Stage */}
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-stage">
          <div className="relative h-[58vh] w-full lg:h-[70vh]">
            <video
              ref={remoteVideoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
            />
            <audio ref={remoteAudioRef} autoPlay />

            {!remoteParticipant && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stage text-center">
                <Loader2 className="h-5 w-5 animate-spin text-stage-fg/70" />
                <p className="px-6 text-sm text-stage-fg/70">
                  En attente de l&apos;autre participant…
                </p>
              </div>
            )}
          </div>

          {/* Self view */}
          <div className="absolute bottom-4 right-4 h-24 w-36 overflow-hidden rounded-[var(--radius-control)] border border-stage-rule bg-stage-2 lg:h-32 lg:w-48">
            <video
              ref={localVideoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-stage-2 px-2 text-center text-xs text-stage-fg/70">
                Caméra désactivée
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-[var(--radius-chip)] border border-border bg-card p-1.5">
            <Button
              variant={micOn ? "ghost" : "destructiveSolid"}
              size="icon"
              onClick={toggleMic}
              aria-pressed={!micOn}
              aria-label={micOn ? "Couper le micro" : "Réactiver le micro"}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={cameraOn ? "ghost" : "destructiveSolid"}
              size="icon"
              onClick={toggleCamera}
              aria-pressed={!cameraOn}
              aria-label={cameraOn ? "Couper la caméra" : "Réactiver la caméra"}
            >
              {cameraOn ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="destructiveSolid"
              size="icon"
              onClick={handleEndCall}
              aria-label="Quitter la consultation"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Session panel */}
        <aside className="surface flex flex-col p-5">
          <div className="flex items-center justify-between gap-3 border-b border-border-soft pb-3">
            <h2 className="label-meta">Session</h2>
            <span className="tabular text-sm font-medium text-foreground">
              {formatTime(seconds)}
            </span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Connexion chiffrée de bout en bout.
          </p>

          <h3 className="label-meta mt-5">Participants</h3>
          <ul className="mt-3 flex flex-col divide-y divide-border-soft border-y border-border-soft">
            {participants.map((person) => (
              <li key={person.key} className="flex items-center gap-3 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-border-soft bg-muted text-sm font-medium text-muted-foreground">
                  {person.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {person.name}
                    {person.isViewer && (
                      <span className="text-muted-foreground"> (vous)</span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {person.role}
                  </span>
                </span>
                <Badge variant={person.present ? "success" : "secondary"}>
                  {person.present ? "Connecté" : "En attente"}
                </Badge>
              </li>
            ))}
          </ul>

          <Button
            variant="destructive"
            className="mt-5 w-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-4 w-4" />
            Quitter la consultation
          </Button>
        </aside>
      </div>
    </div>
  );
}
