"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Video, CheckCircle, XCircle } from "lucide-react"
import { canJoinVideoCall, initializeVideoCall, getVideoCallStatus } from "@/actions/video-call"
import { getTestAppointments } from "@/actions/test"
import toast from "react-hot-toast"

export default function TestVideoCallPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  useEffect(() => {
    loadTestData()
  }, [])

  async function loadTestData() {
    try {
      setLoading(true)
      const data = await getTestAppointments()
      setAppointments(data)
    } catch (error: any) {
      console.error("Error loading test data:", error)
      toast.error("Failed to load appointments: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function testCanJoin(appointmentId: string) {
    try {
      const result = await canJoinVideoCall(appointmentId)
      setTestResults(prev => ({
        ...prev,
        [appointmentId]: { type: 'canJoin', success: result.canJoin, message: result.reason }
      }))
      
      if (result.canJoin) {
        toast.success("✅ Can join call!")
      } else {
        toast.error(`❌ Cannot join: ${result.reason}`)
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [appointmentId]: { type: 'canJoin', success: false, message: error.message }
      }))
      toast.error(error.message)
    }
  }

  async function testInitialize(appointmentId: string) {
    try {
      const result = await initializeVideoCall(appointmentId)
      setTestResults(prev => ({
        ...prev,
        [appointmentId]: { 
          type: 'initialize', 
          success: true, 
          data: {
            roomName: result.roomName,
            roomSid: result.roomSid,
            hasToken: !!result.token,
            userRole: result.userRole
          }
        }
      }))
      
      toast.success(`✅ Room created: ${result.roomName}`)
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [appointmentId]: { type: 'initialize', success: false, message: error.message }
      }))
      toast.error(error.message)
    }
  }

  async function testGetStatus(appointmentId: string) {
    try {
      const result = await getVideoCallStatus(appointmentId)
      setTestResults(prev => ({
        ...prev,
        [appointmentId]: { 
          type: 'status', 
          success: true, 
          data: result
        }
      }))
      
      toast.success("✅ Status fetched")
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [appointmentId]: { type: 'status', success: false, message: error.message }
      }))
      toast.error(error.message)
    }
  }

  async function testFullFlow(appointmentId: string) {
    router.push(`/doctor/video-call?appointmentId=${appointmentId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-background/50">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">🧪 Video Call Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Test your video call backend implementation
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No appointments found. Create some test appointments first.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const result = testResults[appointment.id]
              
              return (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {appointment.doctor.full_name} ↔ {appointment.patient.full_name}
                        </CardTitle>
                        <CardDescription>
                          {new Date(appointment.startTime).toLocaleString()} - {new Date(appointment.endTime).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        appointment.status === 'scheduled' ? 'default' :
                        appointment.status === 'completed' ? 'secondary' :
                        'destructive'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Test Results */}
                    {result && (
                      <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-start gap-2">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium capitalize">{result.type} Test</div>
                            {result.message && (
                              <div className="text-sm mt-1 opacity-80">{result.message}</div>
                            )}
                            {result.data && (
                              <pre className="text-xs mt-2 p-2 bg-black/10 dark:bg-white/10 rounded overflow-auto">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Video Call Info */}
                    {appointment.videoRoomSid && (
                      <div className="text-sm space-y-1 p-3 bg-muted rounded-lg">
                        <div><strong>Room Name:</strong> {appointment.videoRoomName}</div>
                        <div><strong>Room SID:</strong> {appointment.videoRoomSid}</div>
                        {appointment.doctorJoinedAt && (
                          <div><strong>Doctor Joined:</strong> {new Date(appointment.doctorJoinedAt).toLocaleTimeString()}</div>
                        )}
                        {appointment.patientJoinedAt && (
                          <div><strong>Patient Joined:</strong> {new Date(appointment.patientJoinedAt).toLocaleTimeString()}</div>
                        )}
                        {appointment.callDurationMinutes && (
                          <div><strong>Duration:</strong> {appointment.callDurationMinutes} minutes</div>
                        )}
                      </div>
                    )}

                    {/* Test Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testCanJoin(appointment.id)}
                      >
                        Test Can Join
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testInitialize(appointment.id)}
                      >
                        Test Initialize
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testGetStatus(appointment.id)}
                      >
                        Test Get Status
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => testFullFlow(appointment.id)}
                        className="gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Test Full Video Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📝 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Test Can Join:</strong> Checks if the current user can join the call (auth, time window, status)</li>
              <li><strong>Test Initialize:</strong> Creates Twilio room and generates access token (backend only)</li>
              <li><strong>Test Get Status:</strong> Fetches current video call status from database</li>
              <li><strong>Test Full Video Call:</strong> Opens the actual video call page (tests frontend + backend integration)</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <strong>⚠️ Note:</strong> To test the full video call, you need two browser windows (one as doctor, one as patient) or use incognito mode.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
