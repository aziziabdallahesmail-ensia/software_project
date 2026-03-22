import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import { Stethoscope, Search, ArrowRight } from "lucide-react";

export default async function DoctorsPage() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl">
        <div className="page-header mb-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <Stethoscope className="h-4 w-4" />
                Recherche médicale
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Trouvez un médecin dans un environnement clair et rassurant.
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Parcourez les spécialités disponibles, comparez les profils des
                praticiens et choisissez la consultation qui correspond à votre
                besoin en toute confiance.
              </p>
            </div>

            <div className="flex flex-col gap-4">
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
        </div>

        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              Choisissez une spécialité
            </h2>
            <p className="text-sm text-muted-foreground">
              Chaque catégorie vous mène vers les praticiens vérifiés correspondants.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {SPECIALTIES.map((specialty) => (
              <Link
                key={specialty.name}
                href={`/list_doctors/${specialty.name}`}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex flex-col items-start gap-4 p-5">
                    <div className="icon-container icon-container-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <specialty.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {specialty.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Voir les praticiens
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30">
      <div className="icon-container icon-container-md bg-card">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
