import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Settings, ShieldCheck, BellRing } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfigurationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar />
          <section className="flex-1">
            <Card>
              <CardContent className="p-6 lg:p-8">
                <div className="max-w-3xl space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="icon-container icon-container-lg">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Configuration
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        Cette section est prête pour recevoir les futurs réglages
                        de la plateforme.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <PreviewCard
                      icon={ShieldCheck}
                      title="Sécurité"
                      description="Paramètres d'accès, rôles et contrôle opérationnel."
                    />
                    <PreviewCard
                      icon={BellRing}
                      title="Notifications"
                      description="Préférences liées aux alertes et aux validations."
                    />
                    <PreviewCard
                      icon={Settings}
                      title="Système"
                      description="Options globales destinées à l'administration."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

function PreviewCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="metric-card">
      <div className="icon-container icon-container-md mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
