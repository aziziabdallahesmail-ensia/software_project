import Link from "next/link";
import Image from "next/image";
import { Stethoscope, ShieldCheck, Video, CalendarClock } from "lucide-react";

/* Hallmark · macrostructure: Split Studio · design-system: design.md · designed-as-app
 * Entry pages are a diptych: reassurance panel left, form right.
 * Replaces the centered floating card. On mobile the panel collapses to a
 * compact masthead so the form stays above the fold.
 *
 * The panel carries a photograph under a scrim. Copy on it uses the on-dark
 * tokens (stage-fg / stage-accent), never text-white — see design.md. */

const assurances = [
  { icon: ShieldCheck, label: "Praticiens vérifiés par notre équipe" },
  { icon: Video, label: "Consultations vidéo chiffrées" },
  { icon: CalendarClock, label: "Créneaux disponibles en temps réel" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Reassurance panel — photograph under an anchor-tinted scrim. */}
      <aside className="relative hidden overflow-hidden border-r border-border bg-scrim lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Image
          src="/images/auth-consultation.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 0px"
          className="object-cover object-center"
        />
        {/* Scrim: anchor-tinted, never a flat black wash. */}
        <div aria-hidden className="absolute inset-0 bg-scrim/[0.82]" />

        <Link
          href="/home"
          className="relative inline-flex items-center gap-2.5 rounded-[var(--radius-control)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="icon-container icon-container-sm border-stage-accent/30 bg-stage-accent/15 text-stage-accent">
            <Stethoscope className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-medium tracking-display text-stage-fg">
            MédiConnect
          </span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="font-display text-2xl font-medium leading-tight tracking-display text-stage-fg">
            Le soin commence par un rendez-vous simple à prendre.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stage-fg/75">
            Trouvez un praticien, réservez un créneau et rejoignez votre
            consultation — sur une seule plateforme.
          </p>

          <ul className="mt-8 space-y-3 border-t border-stage-fg/20 pt-6">
            {assurances.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-sm text-stage-fg/85"
              >
                <Icon className="h-4 w-4 shrink-0 text-stage-accent" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="label-meta relative text-stage-fg/60">
          Plateforme de rendez-vous médicaux
        </p>
      </aside>

      {/* Form column */}
      <main className="flex min-h-svh flex-col justify-center px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/home"
          className="mb-8 inline-flex w-fit items-center gap-2.5 rounded-[var(--radius-control)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
        >
          <span className="icon-container icon-container-sm border-primary/25 bg-primary-soft text-primary">
            <Stethoscope className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-medium tracking-display">
            MédiConnect
          </span>
        </Link>

        <div className="w-full max-w-[26rem]">{children}</div>
      </main>
    </div>
  );
}
