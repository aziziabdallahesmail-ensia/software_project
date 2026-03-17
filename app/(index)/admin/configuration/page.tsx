/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Settings, ShieldCheck, BellRing } from "lucide-react";

export default function ConfigurationPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_rgba(251,252,249,1)_0%,_rgba(244,247,242,1)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_rgba(11,15,14,1)_0%,_rgba(8,11,10,1)_100%)]">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <AdminSidebar />
          <section className="flex-1">
            <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70 md:p-8">
              <div className="max-w-3xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Configuration
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
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
            </div>
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
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-slate-50 p-5 dark:border-emerald-900/40 dark:bg-slate-900/80">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
