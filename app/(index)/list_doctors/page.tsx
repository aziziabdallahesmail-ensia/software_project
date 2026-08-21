import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";
import { ArrowRight } from "lucide-react";

/* Hallmark · macrostructure: Catalogue · design-system: design.md
 * A visual index of inventory. Uniform tiles, hairline borders, one accent on
 * hover. No hero, no gradient panel, no invented statistics. */

export default async function DoctorsPage() {
  return (
    <div>
      <header className="page-header">
        <p className="label-meta">Annuaire</p>
        <h1 className="mt-2 font-display text-[length:var(--text-display)] font-medium leading-[1.1] tracking-display">
          Choisissez une spécialité
        </h1>
        <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
          Parcourez les {SPECIALTIES.length} spécialités disponibles, puis
          consultez les praticiens vérifiés correspondants et leurs créneaux.
        </p>
      </header>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-3">
        {SPECIALTIES.map((specialty) => (
          <li key={specialty.name}>
            <Link
              href={`/list_doctors/${specialty.name}`}
              className="surface-interactive group flex h-full items-center gap-3.5 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="icon-container icon-container-md shrink-0 transition-colors duration-base ease-out group-hover:border-primary/30 group-hover:bg-primary-soft group-hover:text-primary">
                <specialty.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {specialty.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Voir les praticiens
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-base group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
