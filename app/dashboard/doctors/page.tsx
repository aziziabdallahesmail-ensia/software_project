"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Users, 
  FileText, 
  Video, 
  Bell, 
  Settings,
  TrendingUp,
  Clock,
  MessageCircle,
  Star,
  Phone,
  MapPin,
  Stethoscope,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

// Mock data
const upcomingAppointments = [
  {
    id: 1,
    patientName: "Marie Dubois",
    time: "09:00",
    duration: "30min",
    type: "Nouvelle consultation",
    status: "confirmed",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    patientName: "Pierre Martin",
    time: "10:00", 
    duration: "45min",
    type: "Suivi cardiologie",
    status: "confirmed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    patientName: "Sophie Laurent",
    time: "11:30",
    duration: "30min",
    type: "Téléconsultation",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

const recentPatients = [
  {
    id: 1,
    name: "Marie Dubois",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-15",
    condition: "Hypertension",
    status: "stable"
  },
  {
    id: 2,
    name: "Pierre Martin", 
    lastVisit: "2024-01-14",
    nextAppointment: "2024-01-28",
    condition: "Diabète type 2",
    status: "improving"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    lastVisit: "2024-01-13", 
    nextAppointment: "2024-02-13",
    condition: "Asthme",
    status: "stable"
  }
];

const quickStats = [
  { label: "Consultations aujourd'hui", value: "8", change: "+2", icon: Users },
  { label: "Patients en attente", value: "3", change: "-1", icon: Clock },
  { label: "Taux de satisfaction", value: "98%", change: "+3%", icon: Star },
  { label: "Revenu du jour", value: "€1,240", change: "+12%", icon: TrendingUp }
];

// Simple Tabs component with proper TypeScript definitions
interface SimpleTabsTriggerProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function SimpleTabs({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function SimpleTabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex space-x-1 rounded-lg bg-muted p-1">{children}</div>;
}

function SimpleTabsTrigger({ 
  children, 
  active = false,
  onClick
}: SimpleTabsTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function SimpleTabsContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-4">{children}</div>;
}

export default function DoctorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startVideoCall = (appointmentId: number) => {
    // Video call implementation
    console.log("Starting video call for appointment:", appointmentId);
  };

  return (
    <div className="min-h-screen bg-background/50">
      {/* Header - Même style que la landing page */}
      <header className="border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Tableau de bord médecin</h1>
                <p className="text-muted-foreground">
                  {currentTime.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-primary bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-white font-bold">
                  EM
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Dr. Élodie Martin</p>
                  <p className="text-sm text-muted-foreground">Cardiologue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Stats - Même style que les métriques de la landing page */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="border-border/70 bg-background/60 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">{stat.change} vs hier</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Appointments */}
              <Card className="border-border/70 bg-background/80">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-xl">Rendez-vous à venir</CardTitle>
                    <CardDescription>Prochaines consultations aujourd&apos;hui</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Voir l&apos;agenda
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border border-border/70 rounded-lg hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-white font-semibold">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{appointment.patientName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {appointment.time} • {appointment.duration}
                            </span>
                            <Badge 
                              variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.type === "Téléconsultation" && (
                          <Button 
                            size="sm" 
                            onClick={() => startVideoCall(appointment.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Démarrer
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity & Patients */}
              <SimpleTabs>
                <SimpleTabsList>
                  <SimpleTabsTrigger 
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                  >
                    Aperçu des patients
                  </SimpleTabsTrigger>
                  <SimpleTabsTrigger 
                    active={activeTab === "activity"}
                    onClick={() => setActiveTab("activity")}
                  >
                    Activité récente
                  </SimpleTabsTrigger>
                </SimpleTabsList>
                
                <SimpleTabsContent>
                  {activeTab === "overview" && (
                    <Card className="border-border/70 bg-background/80">
                      <CardHeader>
                        <CardTitle>Dossiers patients récents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentPatients.map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between p-4 border border-border/70 rounded-lg hover:bg-muted/40 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{patient.name}</p>
                                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={
                                    patient.status === 'stable' ? 'default' :
                                    patient.status === 'improving' ? 'secondary' : 'destructive'
                                  }
                                >
                                  {patient.status === 'stable' ? 'Stable' : 
                                   patient.status === 'improving' ? 'En amélioration' : 'Critique'}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Prochain RDV: {new Date(patient.nextAppointment).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {activeTab === "activity" && (
                    <Card className="border-border/70 bg-background/80">
                      <CardHeader>
                        <CardTitle>Activité récente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground text-center py-8">
                            Aucune activité récente
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </SimpleTabsContent>
              </SimpleTabs>
            </div>

            {/* Right Column - Quick Actions & Metrics */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card className="border-border/70 bg-background/80">
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Nouvelle téléconsultation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Rédiger une ordonnance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Ajouter un patient
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier un RDV
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="border-border/70 bg-background/80">
                <CardHeader>
                  <CardTitle>Emploi du temps</CardTitle>
                  <CardDescription>Votre planning aujourd&apos;hui</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Consultations complétées</span>
                      <span className="font-semibold text-foreground">5/8</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: '62.5%' }}
                      ></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disponibilité restante:</span>
                        <span className="text-foreground">3 créneaux</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prochaine pause:</span>
                        <span className="text-foreground">12:30 - 13:30</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="border-border/70 bg-background/80">
                <CardHeader>
                  <CardTitle>Contacts urgents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border/70 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Phone className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">SAMU</p>
                        <p className="text-xs text-muted-foreground">15</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-border/70 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Hôpital Central</p>
                        <p className="text-xs text-muted-foreground">Réanimation</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}