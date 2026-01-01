"use client"

import React, { useEffect, useRef, useState } from "react"
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
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"

export default function VideoCall() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let mounted = true
    let timer: number | undefined

    async function startLocal() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
        if (!mounted) return
        setStream(s)
        if (localVideoRef.current) localVideoRef.current.srcObject = s
        timer = window.setInterval(() => setSeconds((v) => v + 1), 1000)
      } catch (err) {
        console.error("Could not get user media:", err)
      }
    }

    startLocal()

    return () => {
      mounted = false
      if (timer) clearInterval(timer)
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!stream) return
    for (const t of stream.getVideoTracks()) t.enabled = cameraOn
    for (const t of stream.getAudioTracks()) t.enabled = micOn
  }, [cameraOn, micOn, stream])

  function formatTime(s: number) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0")
    const ss = String(s % 60).padStart(2, "0")
    return `${mm}:${ss}`
  }

  return (
    <div className="min-h-screen bg-background/50 dark:bg-surface-900 p-6">
      <div className="container mx-auto">
        <PageTitle title="Video Call" backLink="/appointments" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 relative overflow-hidden">
            <CardHeader className="p-0">
              <CardTitle className="sr-only">Remote video</CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-black">
              <video
                ref={remoteVideoRef}
                className="w-full h-[60vh] lg:h-[72vh] object-cover bg-black"
                autoPlay
                playsInline
              />

              {/* floating local preview */}
              <div className="absolute right-6 bottom-6 w-40 h-28 lg:w-56 lg:h-40 bg-muted rounded-lg overflow-hidden ring-1 ring-ring/20">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {!stream && <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Camera unavailable</div>}
              </div>

              {/* Controls */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-3 bg-background/60 backdrop-blur rounded-full p-2">
                <Button variant="ghost" size="icon" onClick={() => setMicOn((s) => !s)}>
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={() => setCameraOn((s) => !s)}>
                  {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button variant="destructive" size="icon" onClick={() => { if (stream) stream.getTracks().forEach((t) => t.stop()); setStream(null); }}>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-medium">P</div>
                <div className="flex-1">
                  <div className="font-medium">Patient Name</div>
                  <div className="text-sm text-muted-foreground">Joined — 2m</div>
                </div>
                <div className="text-sm text-muted-foreground">In call</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">Y</div>
                <div className="flex-1">
                  <div className="font-medium">You</div>
                  <div className="text-sm text-muted-foreground">Connected</div>
                </div>
                <div className="text-sm text-muted-foreground">Host</div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Session notes</label>
                <Textarea rows={6} placeholder="Add notes for this session (private)" />
                <div className="mt-3">
                  <Button className="w-full">Save notes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
