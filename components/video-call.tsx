"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTitle } from "@/components/page-title"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from "lucide-react"
import { initializeVideoCall, endVideoCall } from "@/actions/video-call"
import toast from "react-hot-toast"

interface VideoCallProps {
  appointmentId: string
  backLink: string
}

export default function VideoCall({ appointmentId, backLink }: VideoCallProps) {
  const router = useRouter()
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  
  const [room, setRoom] = useState<any>(null)
  const [localParticipant, setLocalParticipant] = useState<any>(null)
  const [remoteParticipant, setRemoteParticipant] = useState<any>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [isConnecting, setIsConnecting] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [appointmentData, setAppointmentData] = useState<any>(null)
  const [notes, setNotes] = useState("")

  // Connect to Twilio Video Room
  useEffect(() => {
    let mounted = true
    let twilioRoom: any = null

    async function connectToRoom() {
      try {
        setIsConnecting(true)
        setConnectionError(null)

        // Initialize video call (creates room + gets token)
        const result = await initializeVideoCall(appointmentId)
        
        if (!mounted) return

        setAppointmentData(result.appointment)

        // Dynamically import Twilio Video SDK
        const Video = (await import("twilio-video")).default

        // Connect to the room
        twilioRoom = await Video.connect(result.token, {
          name: result.roomName,
          audio: true,
          video: { width: 1280, height: 720 },
        })

        if (!mounted) {
          twilioRoom.disconnect()
          return
        }

        setRoom(twilioRoom)
        setLocalParticipant(twilioRoom.localParticipant)

        // Attach local participant tracks
        twilioRoom.localParticipant.tracks.forEach((publication: any) => {
          if (publication.track) {
            attachTrack(publication.track, localVideoRef.current)
          }
        })

        // Handle remote participants already in the room
        twilioRoom.participants.forEach((participant: any) => {
          handleParticipantConnected(participant)
        })

        // Handle new participants joining
        twilioRoom.on("participantConnected", handleParticipantConnected)

        // Handle participants leaving
        twilioRoom.on("participantDisconnected", handleParticipantDisconnected)

        setIsConnecting(false)
        toast.success("Connected to video call")
      } catch (error: any) {
        console.error("Error connecting to room:", error)
        if (mounted) {
          setConnectionError(error.message || "Failed to connect to video call")
          setIsConnecting(false)
          toast.error(error.message || "Failed to connect")
        }
      }
    }

    connectToRoom()

    return () => {
      mounted = false
      if (twilioRoom) {
        twilioRoom.disconnect()
      }
    }
  }, [appointmentId])

  // Timer for call duration
  useEffect(() => {
    if (!room || isConnecting) return

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [room, isConnecting])

  // Handle remote participant connection
  function handleParticipantConnected(participant: any) {
    setRemoteParticipant(participant)

    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        attachTrack(publication.track, remoteVideoRef.current, remoteAudioRef.current)
      }
    })

    participant.on("trackSubscribed", (track: any) => {
      attachTrack(track, remoteVideoRef.current, remoteAudioRef.current)
    })
  }

  // Handle remote participant disconnection
  function handleParticipantDisconnected(participant: any) {
    setRemoteParticipant(null)
    toast(`${participant.identity} left the call`)
  }

  // Attach track to video/audio element
  function attachTrack(track: any, videoElement: HTMLElement | null, audioElement?: HTMLElement | null) {
    if (track.kind === "video" && videoElement) {
      track.attach(videoElement)
    } else if (track.kind === "audio" && audioElement) {
      track.attach(audioElement)
    }
  }

  // Toggle camera
  const toggleCamera = () => {
    if (room && localParticipant) {
      localParticipant.videoTracks.forEach((publication: any) => {
        if (cameraOn) {
          publication.track.disable()
        } else {
          publication.track.enable()
        }
      })
      setCameraOn(!cameraOn)
    }
  }

  // Toggle microphone
  const toggleMic = () => {
    if (room && localParticipant) {
      localParticipant.audioTracks.forEach((publication: any) => {
        if (micOn) {
          publication.track.disable()
        } else {
          publication.track.enable()
        }
      })
      setMicOn(!micOn)
    }
  }

  // End call
  const handleEndCall = async () => {
    try {
      // Disconnect from Twilio room
      if (room) {
        room.disconnect()
      }

      // Update backend
      await endVideoCall(appointmentId)
      
      toast.success("Call ended")
      router.push(backLink)
    } catch (error: any) {
      console.error("Error ending call:", error)
      toast.error("Failed to end call properly")
      router.push(backLink)
    }
  }


  function formatTime(s: number) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0")
    const ss = String(s % 60).padStart(2, "0")
    return `${mm}:${ss}`
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-background/50 dark:bg-surface-900 p-6">
        <div className="container mx-auto">
          <PageTitle title="Video Call" backLink={backLink} />
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Connection Error</CardTitle>
              <CardDescription>{connectionError}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push(backLink)} className="w-full">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background/50 dark:bg-surface-900 p-6">
        <div className="container mx-auto">
          <PageTitle title="Video Call" backLink={backLink} />
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Connecting...</CardTitle>
              <CardDescription>Please wait while we connect you to the call</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const doctorName = appointmentData?.doctor?.full_name || "Doctor"
  const patientName = appointmentData?.patient?.full_name || "Patient"

  return (
    <div className="min-h-screen bg-background/50 dark:bg-surface-900 p-6">
      <div className="container mx-auto">
        <PageTitle title="Video Call" backLink={backLink} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 relative overflow-hidden">
            <CardHeader className="p-0">
              <CardTitle className="sr-only">Remote video</CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-black">
              {/* Remote video */}
              <div className="relative w-full h-[60vh] lg:h-[72vh] bg-black">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                {/* Remote audio (hidden) */}
                <audio ref={remoteAudioRef} autoPlay />
                
                {!remoteParticipant && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Waiting for other participant...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating local preview */}
              <div className="absolute right-6 bottom-6 w-40 h-28 lg:w-56 lg:h-40 bg-muted rounded-lg overflow-hidden ring-1 ring-ring/20">
                <video 
                  ref={localVideoRef} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted 
                  playsInline 
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-sm">
                    Camera Off
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-3 bg-background/60 backdrop-blur rounded-full p-2">
                <Button 
                  variant={micOn ? "ghost" : "destructive"} 
                  size="icon" 
                  onClick={toggleMic}
                  title={micOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>

                <Button 
                  variant={cameraOn ? "ghost" : "destructive"} 
                  size="icon" 
                  onClick={toggleCamera}
                  title={cameraOn ? "Turn off camera" : "Turn on camera"}
                >
                  {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={handleEndCall}
                  title="End call"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>Secure — {formatTime(seconds)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Doctor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-medium">
                  {doctorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{doctorName}</div>
                  <div className="text-sm text-muted-foreground">
                    {appointmentData?.doctor?.specialty || "Doctor"}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {remoteParticipant?.identity?.includes("doctor") || localParticipant?.identity?.includes("doctor") ? "In call" : "Waiting"}
                </div>
              </div>

              {/* Patient */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-medium">
                  {patientName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{patientName}</div>
                  <div className="text-sm text-muted-foreground">Patient</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {remoteParticipant?.identity?.includes("patient") || localParticipant?.identity?.includes("patient") ? "In call" : "Waiting"}
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">Session notes</label>
                <Textarea 
                  rows={6} 
                  placeholder="Add notes for this session (private)" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="mt-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      // TODO: Save notes to appointment
                      toast.success("Notes saved")
                    }}
                  >
                    Save notes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
