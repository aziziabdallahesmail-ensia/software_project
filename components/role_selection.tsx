"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  User, 
  Stethoscope, 
  Building2, 
  ArrowRight, 
  CheckCircle2,
  Shield,
  Clock,
  Sparkles
} from "lucide-react";

type Role = "patient" | "doctor" | "admin";

const roles = [
  {
    id: "patient",
    title: "Patient",
    description: "Consultez des médecins, gérez vos rendez-vous et suivez votre santé",
    icon: User,
    features: ["Consultations vidéo", "Dossier médical", "Rappels intelligents", "Ordonnances en ligne"],
    badge: "Le plus populaire",
    color: "from-blue-500 to-cyan-500",
    stats: "120k+ patients"
  },
  {
    id: "doctor",
    title: "Professionnel de santé",
    description: "Gérez votre cabinet, consultez à distance et suivez vos patients",
    icon: Stethoscope,
    features: ["Tableau de bord avancé", "Gestion des dossiers", "Agenda intelligent", "Téléconsultation HD"],
    badge: "Certifié",
    color: "from-green-500 to-emerald-500",
    stats: "1.2k+ praticiens"
  },
  {
    id: "admin",
    title: "Administrateur",
    description: "Supervisez la plateforme, gérez les utilisateurs et les statistiques",
    icon: Building2,
    features: ["Analytics temps réel", "Gestion des accès", "Support utilisateurs", "Rapports détaillés"],
    badge: "Staff",
    color: "from-purple-500 to-violet-500",
    stats: "Accès complet"
  }
];

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsContinuing(true);
    // Simulate API call for role selection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically:
    // 1. Save role preference to user profile
    // 2. Redirect to appropriate dashboard
    // 3. Set user permissions
    
    console.log(`Role selected: ${selectedRole}`);
    setIsContinuing(false);
    
    // Redirect logic would go here
    if (selectedRole === "doctor") {
      window.location.href = "/dashboard/doctors";
    } else if (selectedRole === "patient") {
      window.location.href = "/dashboard/patient";
    } else {
      window.location.href = "/dashboard/admin";
    }
  };

  return (
    <div className="min-h-screen bg-background/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-4 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Sélection du profil
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Comment souhaitez-vous utiliser{" "}
            <span className="text-primary">MedConnect</span>?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez votre profil pour personnaliser votre expérience et accéder aux outils adaptés à vos besoins.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 border-2 border-border/70 bg-background/80 backdrop-blur hover:shadow-xl",
                selectedRole === role.id
                  ? "border-primary shadow-lg scale-105"
                  : "hover:border-border"
              )}
              onClick={() => handleRoleSelect(role.id as Role)}
            >
              {/* Selection Indicator */}
              {selectedRole === role.id && (
                <div className="absolute -top-2 -right-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500 fill-current" />
                </div>
              )}

              {/* Badge */}
              {role.badge && (
                <div className="absolute -top-3 left-4">
                  <Badge 
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                  >
                    {role.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 pt-8">
                {/* Icon */}
                <div className={cn(
                  "mx-auto mb-4 rounded-2xl p-4 bg-gradient-to-r text-white",
                  role.color
                )}>
                  <role.icon className="h-8 w-8" />
                </div>

                <CardTitle className="text-2xl text-foreground">{role.title}</CardTitle>
                <CardDescription className="text-base h-12 flex items-center justify-center">
                  {role.description}
                </CardDescription>

                {/* Stats */}
                <div className="text-sm text-muted-foreground font-medium">
                  {role.stats}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <ul className="space-y-3">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-12 py-6 text-lg font-semibold h-14"
            disabled={!selectedRole || isContinuing}
            onClick={handleContinue}
          >
            {isContinuing ? (
              <>
                <Clock className="h-5 w-5 animate-spin mr-2" />
                Configuration en cours...
              </>
            ) : (
              <>
                Continuer vers le tableau de bord
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          {!selectedRole && (
            <p className="text-muted-foreground mt-4">
              Veuillez sélectionner un profil pour continuer
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-full px-4 py-2 border border-border/70">
            <Shield className="h-4 w-4" />
            Votre choix peut être modifié ultérieurement dans les paramètres du compte
          </div>
        </div>
      </div>
    </div>
  );
}