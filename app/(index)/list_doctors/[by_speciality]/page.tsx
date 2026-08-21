import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctor";
import { DoctorCard } from "../components/doctor_card";
import { SearchX, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

/* Hallmark · macrostructure: Catalogue · design-system: design.md
 * The count is read from the query, never invented. A failed query is reported
 * as a failure — it must not masquerade as "no doctors found". */

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

  const count = doctors?.length ?? 0;

  return (
    <div>
      <Link
        href="/list_doctors"
        className="mb-6 inline-flex items-center gap-1.5 whitespace-nowrap rounded text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Toutes les spécialités
      </Link>

      <header className="page-header">
        <p className="label-meta">Spécialité</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.1] tracking-display">
            {decodedSpecialty}
          </h1>
          {!error && (
            <p className="text-sm text-muted-foreground">
              <span className="tabular text-foreground">{count}</span>{" "}
              {count > 1 ? "praticiens vérifiés" : "praticien vérifié"}
            </p>
          )}
        </div>
      </header>

      {error ? (
        <div className="surface flex items-start gap-3 border-destructive/25 bg-destructive-soft p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <h2 className="font-display text-base font-medium tracking-display text-destructive">
              Liste momentanément indisponible
            </h2>
            <p className="mt-1 text-sm text-destructive/90">
              Nous n&apos;avons pas pu charger les praticiens de cette
              spécialité. Réessayez dans quelques instants.
            </p>
          </div>
        </div>
      ) : count > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-4">
          {doctors!.map((doctor) => (
            <li key={doctor.id} className="flex">
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <span className="icon-container icon-container-lg shrink-0">
            <SearchX className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-medium tracking-display">
              Aucun praticien dans cette spécialité
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Aucun médecin vérifié n&apos;exerce actuellement en{" "}
              {decodedSpecialty.toLowerCase()}. Explorez une autre spécialité.
            </p>
          </div>
          <Link
            href="/list_doctors"
            className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] border border-border px-4 text-sm font-medium transition-colors duration-base ease-out hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Voir les spécialités
          </Link>
        </div>
      )}
    </div>
  );
}
