import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctor";
import { DoctorCard } from "../components/doctor_card";
import { Stethoscope, Users, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ by_speciality: string }>;
}

export default async function DoctorSpecialtyPage({ params }: PageProps) {
  const { by_speciality: specialty } = await params;

  if (!specialty) {
    redirect("/list_doctors");
  }

  const decodedSpecialty = decodeURIComponent(specialty);
  const { doctors, error } = await getDoctorsBySpecialty(decodedSpecialty);

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl">
        <div className="page-header mb-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <Link
                href="/list_doctors"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux spécialités
              </Link>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Spécialité sélectionnée
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {decodedSpecialty}
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Retrouvez les médecins vérifiés de cette spécialité et accédez
                  à leur profil pour réserver un rendez-vous en quelques étapes.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <InfoCard
                icon={Users}
                title={`${doctors?.length || 0} médecin${(doctors?.length || 0) > 1 ? "s" : ""}`}
                description="Disponibles dans cette spécialité"
              />
              <InfoCard
                icon={Stethoscope}
                title="Profils vérifiés"
                description="Présentés avec une interface claire et sereine"
              />
            </div>
          </div>
        </div>

        {doctors && doctors.length > 0 ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Médecins disponibles
              </h2>
              <p className="text-sm text-muted-foreground">
                Sélectionnez le praticien qui correspond à votre besoin.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </section>
        ) : (
          <section className="card-clinical p-8 text-center">
            <div className="icon-container icon-container-lg mx-auto mb-4 bg-secondary text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Aucun médecin disponible
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Il n'y a actuellement aucun médecin vérifié dans cette
              spécialité. Vous pouvez revenir à la liste générale et explorer une
              autre spécialité.
            </p>
          </section>
        )}
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
