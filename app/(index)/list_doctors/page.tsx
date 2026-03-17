/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import { Stethoscope, Search, ArrowRight } from "lucide-react";

export default async function DoctorsPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="grid gap-8 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Stethoscope className="h-4 w-4" />
              Recherche médicale
            </div>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
                Trouvez un médecin dans un environnement clair et rassurant.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                Parcourez les spécialités disponibles, comparez les profils des
                praticiens et choisissez la consultation qui correspond à votre
                besoin en toute confiance.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <InfoCard
              icon={Search}
              title="Parcours simple"
              description="Choisissez une spécialité puis consultez les profils disponibles."
            />
            <InfoCard
              icon={Stethoscope}
              title={`${SPECIALTIES.length} spécialités`}
              description="Une organisation sobre pour accéder plus vite au bon praticien."
            />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Choisissez une spécialité
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chaque catégorie vous mène vers les praticiens vérifiés
              correspondants.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty.name}
              href={`/list_doctors/${specialty.name}`}
              className="group"
            >
              <Card className="h-full rounded-[1.5rem] border border-emerald-100/80 bg-white/85 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:border-emerald-900/40 dark:bg-slate-950/70 dark:hover:border-emerald-800/60">
                <CardContent className="flex h-full flex-col items-start gap-5 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <specialty.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {specialty.name}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition group-hover:text-emerald-700 dark:text-slate-400 dark:group-hover:text-emerald-300">
                      Voir les praticiens
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-100/80 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
