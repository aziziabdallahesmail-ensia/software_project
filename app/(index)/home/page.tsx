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
  Activity
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  // If user is authenticated and has a role, show personalized dashboard
  if (user && user.role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenue, {user.full_name || user.email?.split("@")[0] || "Utilisateur"} 
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user.role === "patient" && "Gérez vos rendez-vous et consultez des médecins"}
              {user.role === "doctor" && "Gérez votre emploi du temps et vos consultations"}
              {user.role === "admin" && "Supervisez la plateforme et les utilisateurs"}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {user.role === "patient" && (
              <>
                <QuickActionCard
                  icon={Stethoscope}
                  title="Trouver un médecin"
                  description="Recherchez et consultez des spécialistes"
                  href="/list_doctors"
                  color="from-emerald-500 to-teal-600"
                />
                <QuickActionCard
                  icon={Calendar}
                  title="Mes rendez-vous"
                  description="Consultez vos rendez-vous à venir"
                  href="/appointments"
                  color="from-blue-500 to-indigo-600"
                />
                <QuickActionCard
                  icon={FileText}
                  title="Mon dossier médical"
                  description="Accédez à votre historique de santé"
                  href="/appointments"
                  color="from-purple-500 to-pink-600"
                />
              </>
            )}

            {user.role === "doctor" && (
              <>
                <QuickActionCard
                  icon={Calendar}
                  title="Mon agenda"
                  description="Gérez vos disponibilités"
                  href="/doctor"
                  color="from-emerald-500 to-teal-600"
                />
                <QuickActionCard
                  icon={User}
                  title="Mes patients"
                  description="Consultez les rendez-vous du jour"
                  href="/doctor"
                  color="from-blue-500 to-indigo-600"
                />
                <QuickActionCard
                  icon={Activity}
                  title="Statistiques"
                  description="Suivez votre activité"
                  href="/doctor"
                  color="from-purple-500 to-pink-600"
                />
              </>
            )}

            {user.role === "admin" && (
              <>
                <QuickActionCard
                  icon={User}
                  title="Vérifications en attente"
                  description="Validez les nouveaux médecins"
                  href="/admin/pending-verification"
                  color="from-emerald-500 to-teal-600"
                />
                <QuickActionCard
                  icon={Stethoscope}
                  title="Tous les médecins"
                  description="Gérez les professionnels de santé"
                  href="/list_doctors"
                  color="from-blue-500 to-indigo-600"
                />
                <QuickActionCard
                  icon={Activity}
                  title="Configuration"
                  description="Paramètres de la plateforme"
                  href="/admin/configuration"
                  color="from-purple-500 to-pink-600"
                />
              </>
            )}
          </div>

          {/* Stats Section for Patients */}
          {user.role === "patient" && (
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <StatCard
                label="Rendez-vous à venir"
                value="--"
                icon={Calendar}
              />
              <StatCard
                label="Consultations passées"
                value="--"
                icon={CheckCircle2}
              />
              <StatCard
                label="Médecins consultés"
                value="--"
                icon={Stethoscope}
              />
            </div>
          )}

          {/* Quick Access */}
          <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.role === "patient" && "Besoin d'une consultation ?"}
                    {user.role === "doctor" && "Gérez vos disponibilités"}
                    {user.role === "admin" && "Tableau de bord administrateur"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {user.role === "patient" && "Trouvez un spécialiste et prenez rendez-vous en quelques clics"}
                    {user.role === "doctor" && "Configurez votre agenda et vos créneaux de consultation"}
                    {user.role === "admin" && "Accédez à toutes les fonctionnalités d'administration"}
                  </p>
                </div>
                <Link
                  href={
                    user.role === "patient" ? "/list_doctors" : 
                    user.role === "doctor" ? "/doctor" : 
                    "/admin"
                  }
                >
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                    {user.role === "patient" && "Trouver un médecin"}
                    {user.role === "doctor" && "Mon espace"}
                    {user.role === "admin" && "Administration"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4 mt-8">
          <ThemeSwitcher />
        </footer>
      </div>
    );
  }

  // If user is authenticated but has no role, redirect to role selection
  if (user && !user.role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Complétez votre profil</CardTitle>
            <CardDescription>
              Choisissez votre type de compte pour accéder à toutes les fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/role_selection">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                Choisir mon profil
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
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col max-w-7xl w-full p-5">
          <LandingPage />
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}

// Helper Components
interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  color: string;
}

function QuickActionCard({ icon: Icon, title, description, href, color }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="pt-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
}
