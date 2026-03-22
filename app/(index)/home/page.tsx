import { ThemeSwitcher } from "@/components/theme-switcher";
import LandingPage from "@/components/landing-page";
import { getCurrentUser } from "@/actions/set_user_role";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Activity,
  HeartPulse,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user && user.role) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="flex-1 container mx-auto px-4 lg:px-6 py-8 lg:py-12 max-w-7xl">
          <div className="page-header mb-8">
            <div className="flex flex-col gap-4">
              <Badge variant="outline" className="w-fit bg-primary/5 text-primary border-primary/20">
                Tableau de bord {user.role === "patient" ? "Patient" : user.role === "doctor" ? "Médecin" : "Administrateur"}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Bienvenue, <span className="text-primary">{user.full_name || user.email?.split("@")[0] || "Utilisateur"}</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {user.role === "patient" && "Gérez votre santé en toute sérénité. Trouvez des spécialistes et planifiez vos rendez-vous en quelques clics."}
                {user.role === "doctor" && "Optimisez votre temps. Gérez vos consultations et vos patients avec une fluidité absolue."}
                {user.role === "admin" && "Supervision complète. Pilotez la plateforme et administrez les utilisateurs sans effort."}
              </p>
            </div>
          </div>

          {user.role === "patient" && (
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <MetricCard
                label="Rendez-vous à venir"
                value="--"
                icon={Calendar}
              />
              <MetricCard
                label="Consultations passées"
                value="--"
                icon={Stethoscope}
              />
              <MetricCard
                label="Médecins consultés"
                value="--"
                icon={HeartPulse}
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {user.role === "patient" && (
              <>
                <ActionCard
                  icon={Stethoscope}
                  title="Trouver un médecin"
                  description="Explorez notre réseau de spécialistes et prenez rendez-vous facilement."
                  href="/list_doctors"
                />
                <ActionCard
                  icon={Calendar}
                  title="Mes rendez-vous"
                  description="Consultez, modifiez ou annulez vos prochaines consultations."
                  href="/appointments"
                />
                <ActionCard
                  icon={HeartPulse}
                  title="Mon dossier médical"
                  description="Accédez rapidement à l'historique complet de votre santé."
                  href="/appointments"
                />
              </>
            )}

            {user.role === "doctor" && (
              <>
                <ActionCard
                  icon={Calendar}
                  title="Mon agenda"
                  description="Configurez vos disponibilités et vos horaires de travail."
                  href="/doctor"
                />
                <ActionCard
                  icon={User}
                  title="Mes patients"
                  description="Gérez et consultez les dossiers de vos patients du jour."
                  href="/doctor"
                />
                <ActionCard
                  icon={Activity}
                  title="Statistiques"
                  description="Analysez votre activité médicale et l'affluence du cabinet."
                  href="/doctor"
                />
              </>
            )}

            {user.role === "admin" && (
              <>
                <ActionCard
                  icon={User}
                  title="Vérifications en attente"
                  description="Passez en revue et validez les nouveaux professionnels."
                  href="/admin/pending-verification"
                />
                <ActionCard
                  icon={Stethoscope}
                  title="Médecins inscrits"
                  description="Consultez et gérez la base de données des praticiens."
                  href="/list_doctors"
                />
                <ActionCard
                  icon={Activity}
                  title="Configuration Système"
                  description="Ajustez les paramètres globaux de la plateforme santé."
                  href="/admin/configuration"
                />
              </>
            )}
          </div>

          <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold mb-2">
                    {user.role === "patient" && "Prêt pour votre prochaine consultation ?"}
                    {user.role === "doctor" && "Accédez à votre espace professionnel"}
                    {user.role === "admin" && "Tableau de bord administration"}
                  </h2>
                  <p className="text-primary-foreground/80 text-sm lg:text-base">
                    {user.role === "patient" && "Découvrez les meilleurs praticiens et planifiez une rencontre en quelques étapes simples."}
                    {user.role === "doctor" && "Gérez facilement vos créneaux et optimisez l'organisation de votre pratique."}
                    {user.role === "admin" && "Supervisez l'intégralité du système depuis votre centre de contrôle dédié."}
                  </p>
                </div>
                <Link
                  href={
                    user.role === "patient"
                      ? "/list_doctors"
                      : user.role === "doctor"
                      ? "/doctor"
                      : "/admin"
                  }
                >
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
                  >
                    {user.role === "patient" && "Trouver un spécialiste"}
                    {user.role === "doctor" && "Ouvrir l'Espace"}
                    {user.role === "admin" && "Administration Centrale"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="w-full flex items-center justify-center border-t border-border/60 bg-card/50 py-4 mt-auto">
          <ThemeSwitcher />
        </footer>
      </div>
    );
  }

  if (user && !user.role) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center pt-8">
            <div className="icon-container icon-container-lg mx-auto mb-4">
              <User className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Profil Incomplet</CardTitle>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <p className="text-muted-foreground mb-6">
              Sélectionnez votre type de compte pour débuter.
            </p>
            <Link href="/role_selection">
              <Button className="w-full">
                Finaliser l'inscription
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="flex-1 relative">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 dark:bg-primary/20 blur-[100px] opacity-70 pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/10 dark:bg-accent/20 blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-400/5 dark:bg-blue-900/10 blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 md:gap-24 px-4 sm:px-6 py-12">
          <LandingPage />
        </div>
      </div>
      <footer className="w-full flex items-center justify-center border-t border-border/60 py-6">
        <ThemeSwitcher />
      </footer>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30">
        <CardContent className="p-6">
          <div className="icon-container icon-container-md mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className="icon-container icon-container-md bg-secondary text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
