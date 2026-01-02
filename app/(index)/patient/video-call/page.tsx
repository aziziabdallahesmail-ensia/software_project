"use client"

import VideoCall from "@/components/video-call"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PatientVideoCallPage() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")

  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-background/50 dark:bg-surface-900 p-6">
        <div className="container mx-auto">
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle>Invalid Request</CardTitle>
              <CardDescription>
                No appointment ID provided. Please join from your appointments list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/appointments">
                <Button className="w-full">Go to Appointments</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <VideoCall appointmentId={appointmentId} backLink="/appointments" />
}
