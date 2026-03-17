import { ThemeSwitcher } from "@/components/theme-switcher";
import LandingPage from "@/components/landing-page";
import { getCurrentUser } from "@/actions/set_user_role";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  User,
  FileText,
  Activity,
  Sparkles,
  HeartPulse
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  // If user is authenticated and has a role, show personalized dashboard
  if (user && user.role) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/20 dark:bg-emerald-900/40 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-400/20 dark:bg-teal-900/40 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-blue-400/20 dark:bg-blue-900/40 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20 max-w-7xl">
          {/* Welcome Header */}
          <div className="flex flex-col mb-16 gap-6 justify-center">
            <div className="space-y-6 max-w-3xl">
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-md px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Tableau de bord {user.role === "patient" ? "Patient" : user.role === "doctor" ? "Médecin" : "Administrateur"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">{user.full_name || user.email?.split("@")[0] || "Utilisateur"}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {user.role === "patient" && "Gérez votre santé en toute sérénité. Trouvez des spécialistes et planifiez vos rendez-vous en quelques clics."}
                {user.role === "doctor" && "Optimisez votre temps. Gérez vos consultations et vos patients avec une fluidité absolue."}
                {user.role === "admin" && "Supervision complète. Pilotez la plateforme et administrez les utilisateurs sans effort."}
              </p>
            </div>
          </div>

          {/* Stats Section for Patients */}
          {user.role === "patient" && (
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              <StatCard label="Rendez-vous à venir" value="--" icon={Calendar} trend="+1 prévu" />
              <StatCard label="Consultations passées" value="--" icon={CheckCircle2} trend="Dossier à jour" />
              <StatCard label="Médecins consultés" value="--" icon={Stethoscope} trend="Suivi" />
            </div>
          )}

          {/* Quick Actions / Feature Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {user.role === "patient" && (
              <>
                <ModernCard
                  icon={Stethoscope}
                  title="Trouver un médecin"
                  description="Explorez notre réseau de spécialistes et prenez rendez-vous facilement."
                  href="/list_doctors"
                  accentClass="from-emerald-500 to-teal-400"
                />
                <ModernCard
                  icon={Calendar}
                  title="Mes rendez-vous"
                  description="Consultez, modifiez ou annulez vos prochaines consultations."
                  href="/appointments"
                  accentClass="from-blue-500 to-indigo-400"
                />
                <ModernCard
                  icon={HeartPulse}
                  title="Mon dossier médical"
                  description="Accédez rapidement à l'historique complet de votre santé."
                  href="/appointments"
                  accentClass="from-purple-500 to-pink-400"
                />
              </>
            )}

            {user.role === "doctor" && (
              <>
                <ModernCard
                  icon={Calendar}
                  title="Mon agenda"
                  description="Configurez vos disponibilités et vos horaires de travail."
                  href="/doctor"
                  accentClass="from-emerald-500 to-teal-400"
                />
                <ModernCard
                  icon={User}
                  title="Mes patients"
                  description="Gérez et consultez les dossiers de vos patients du jour."
                  href="/doctor"
                  accentClass="from-blue-500 to-indigo-400"
                />
                <ModernCard
                  icon={Activity}
                  title="Statistiques"
                  description="Analysez votre activité médicale et l'affluence du cabinet."
                  href="/doctor"
                  accentClass="from-purple-500 to-pink-400"
                />
              </>
            )}

            {user.role === "admin" && (
              <>
                <ModernCard
                  icon={User}
                  title="Vérifications en attente"
                  description="Passez en revue et validez les nouveaux professionnels."
                  href="/admin/pending-verification"
                  accentClass="from-emerald-500 to-teal-400"
                />
                <ModernCard
                  icon={Stethoscope}
                  title="Médecins inscrits"
                  description="Consultez et gérez la base de données des praticiens."
                  href="/list_doctors"
                  accentClass="from-blue-500 to-indigo-400"
                />
                <ModernCard
                  icon={Activity}
                  title="Configuration Système"
                  description="Ajustez les paramètres globaux de la plateforme santé."
                  href="/admin/configuration"
                  accentClass="from-purple-500 to-pink-400"
                />
              </>
            )}
          </div>

          {/* Quick Access CTA */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 p-1 border border-slate-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmZiZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[1.4rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
              <div className="max-w-xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  {user.role === "patient" && "Prêt pour votre prochaine consultation ?"}
                  {user.role === "doctor" && "Accédez à votre espace professionnel"}
                  {user.role === "admin" && "Tableau de bord administration"}
                </h3>
                <p className="text-slate-400 text-base md:text-lg">
                  {user.role === "patient" && "Découvrez les meilleurs praticiens et planifiez une rencontre en quelques étapes simples."}
                  {user.role === "doctor" && "Gérez facilement vos créneaux et optimisez l'organisation de votre pratique."}
                  {user.role === "admin" && "Supervisez l'intégralité du système depuis votre centre de contrôle dédié."}
                </p>
              </div>
              <Link
                href={
                  user.role === "patient" ? "/list_doctors" : 
                  user.role === "doctor" ? "/doctor" : 
                  "/admin"
                }
                className="shrink-0 w-full md:w-auto"
              >
                <Button size="lg" className="w-full h-14 px-8 text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105">
                  {user.role === "patient" && "Trouver un spécialiste"}
                  {user.role === "doctor" && "Ouvrir l'Espace"}
                  {user.role === "admin" && "Administration Centrale"}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <footer className="w-full relative z-10 flex items-center justify-center border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md mx-auto text-center py-6 mt-12">
          <ThemeSwitcher />
        </footer>
      </div>
    );
  }

  // If user is authenticated but has no role, redirect to role selection
  if (user && !user.role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="text-center pt-8">
            <div className="mx-auto mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full shadow-inner">
              <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Profil Incomplet</CardTitle>
            <CardDescription className="text-base text-slate-500 dark:text-slate-400 mt-2">
              Sélectionnez votre type de compte pour débuter.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <Link href="/role_selection">
              <Button className="w-full h-12 text-base bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl transition-all shadow-md">
                Finaliser l'inscription
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, show landing page
  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col max-w-7xl w-full p-5">
          <LandingPage />
        </div>
        <footer className="w-full flex items-center justify-center border-t border-slate-200 dark:border-slate-800 mx-auto text-center py-6 mt-10">
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}

// Helper Components
interface ModernCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  accentClass: string;
}

function ModernCard({ icon: Icon, title, description, href, accentClass }: ModernCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="relative h-full overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] transition-all duration-300 hover:-translate-y-1 rounded-2xl group-hover:border-slate-300 dark:group-hover:border-slate-700">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${accentClass} transition-opacity duration-500`} />
        
        <CardContent className="p-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentClass} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 dark:group-hover:from-slate-100 dark:group-hover:to-slate-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
}

function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-all">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full opacity-50 transition-transform group-hover:scale-150 duration-500 mix-blend-multiply dark:mix-blend-screen" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-1 rounded-full">{trend}</span>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 shadow-sm rounded-xl">
            <Icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
