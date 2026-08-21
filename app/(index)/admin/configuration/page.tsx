import { ShieldCheck, BellRing, Settings } from "lucide-react";

/* Hallmark · macrostructure: Index-First · design-system: design.md
 * Placeholder surface. It is labelled as not-yet-built rather than dressed up
 * as a working settings panel. */

const sections = [
  {
    icon: ShieldCheck,
    title: "Sécurité",
    description: "Accès, rôles et contrôle opérationnel.",
  },
  {
    icon: BellRing,
    title: "Notifications",
    description: "Alertes de vérification et rappels de rendez-vous.",
  },
  {
    icon: Settings,
    title: "Système",
    description: "Options globales de la plateforme.",
  },
];

export default function ConfigurationPage() {
  return (
    <div>
      <header className="page-header">
        <p className="label-meta">Administration</p>
        <h1 className="mt-2 font-display text-2xl font-medium leading-tight tracking-display">
          Configuration
        </h1>
        <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">
          Ces réglages ne sont pas encore actifs. Les sections ci-dessous
          décrivent ce que cet espace accueillera.
        </p>
      </header>

      <ul className="index-list">
        {sections.map(({ icon: Icon, title, description }) => (
          <li key={title} className="index-row">
            <span className="icon-container icon-container-md shrink-0">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {title}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {description}
              </span>
            </span>
            <span className="chip chip-neutral shrink-0">À venir</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
