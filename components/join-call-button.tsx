"use client"

import { Button } from "@/components/ui/button"
import { Video, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface JoinCallButtonProps {
  appointmentId: string
  startTime: Date
  endTime: Date
  status: string
  userRole: "doctor" | "patient"
}

export function JoinCallButton({
  appointmentId,
  startTime,
  endTime,
  status,
  userRole,
}: JoinCallButtonProps) {
  const [canJoin, setCanJoin] = useState(false)
  const [reason, setReason] = useState("")

  useEffect(() => {
    function checkEligibility() {
      // Only scheduled appointments can be joined
      if (status !== "scheduled") {
        setCanJoin(false)
        setReason(`Appointment is ${status}`)
        return
      }

      const now = new Date()
      const start = new Date(startTime)
      const end = new Date(endTime)

      // Allow joining 10 minutes before start time
      const startBuffer = new Date(start)
      startBuffer.setMinutes(startBuffer.getMinutes() - 10)

      // Allow joining up to 10 minutes after end time
      const endBuffer = new Date(end)
      endBuffer.setMinutes(endBuffer.getMinutes() + 10)

      if (now < startBuffer) {
        const minutesUntil = Math.floor(
          (startBuffer.getTime() - now.getTime()) / 60000
        )
        setCanJoin(false)
        setReason(`Available in ${minutesUntil} minutes`)
      } else if (now > endBuffer) {
        setCanJoin(false)
        setReason("Call window expired")
      } else {
        setCanJoin(true)
        setReason("")
      }
    }

    checkEligibility()
    // Re-check every minute
    const interval = setInterval(checkEligibility, 60000)

    return () => clearInterval(interval)
  }, [startTime, endTime, status])

  const videoCallPath =
    userRole === "doctor"
      ? `/doctor/video-call?appointmentId=${appointmentId}`
      : `/patient/video-call?appointmentId=${appointmentId}`

  if (status === "completed") {
    return (
      <Button variant="outline" size="sm" disabled>
        <XCircle className="h-4 w-4 mr-2" />
        Completed
      </Button>
    )
  }

  if (status === "cancelled") {
    return (
      <Button variant="outline" size="sm" disabled>
        <XCircle className="h-4 w-4 mr-2" />
        Cancelled
      </Button>
    )
  }

  if (!canJoin) {
    return (
      <Button variant="outline" size="sm" disabled title={reason}>
        <Clock className="h-4 w-4 mr-2" />
        {reason}
      </Button>
    )
  }

  return (
    <Link href={videoCallPath}>
      <Button size="sm" className="bg-green-600 hover:bg-green-700">
        <Video className="h-4 w-4 mr-2" />
        Join Call
      </Button>
    </Link>
  )
}
