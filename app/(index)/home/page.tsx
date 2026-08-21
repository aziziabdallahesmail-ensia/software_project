import LandingPage from "@/components/landing-page";
import { getCurrentUser } from "@/actions/set_user_role";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Calendar,
  ArrowRight,
  User,
  Activity,
  HeartPulse,
  ShieldQuestion,
} from "lucide-react";

/* Hallmark · macrostructure: Index-First (signed in) / Catalogue (signed out)
 * design-system: design.md · designed-as-app
 *
 * NOTE: the previous signed-in view showed three metric tiles hard-coded to
 * "--" — they were never wired to a data source, so they were dropped rather
 * than restyled. Real counts live on /appointments and /doctor.
 *
 * The signed-in view is grounded on a full-bleed photograph. Per design.md,
 * copy that overlaps photography sits under --ch-scrim; everything below the
 * greeting rides on opaque surfaces instead, so no text is ever read directly
 * off the image. */

type Action = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
};

const actionsByRole: Record<string, Action[]> = {
  patient: [
    {
      icon: Stethoscope,
      title: "Trouver un praticien",
      description: "Parcourez les spécialités et réservez un créneau.",
      href: "/list_doctors",
    },
    {
      icon: Calendar,
      title: "Mes rendez-vous",
      description: "Consultez, rejoignez ou annulez vos consultations.",
      href: "/appointments",
    },
    {
      icon: HeartPulse,
      title: "Mon historique",
      description: "Retrouvez vos consultations passées.",
      href: "/appointments",
    },
  ],
  doctor: [
    {
      icon: Calendar,
      title: "Mon agenda",
      description: "Définissez vos disponibilités et vos horaires.",
      href: "/doctor",
    },
    {
      icon: User,
      title: "Mes patients",
      description: "Consultez les rendez-vous de la journée.",
      href: "/doctor",
    },
    {
      icon: Activity,
      title: "Mon activité",
      description: "Suivez vos consultations à venir et passées.",
      href: "/doctor",
    },
  ],
  admin: [
    {
      icon: ShieldQuestion,
      title: "Vérifications en attente",
      description: "Examinez et validez les nouveaux dossiers.",
      href: "/admin/pending-verification",
    },
    {
      icon: Stethoscope,
      title: "Praticiens inscrits",
      description: "Gérez les comptes vérifiés de la plateforme.",
      href: "/admin",
    },
    {
      icon: Activity,
      title: "Configuration",
      description: "Paramètres globaux de la plateforme.",
      href: "/admin/configuration",
    },
  ],
};

const primaryDestination: Record<string, { href: string; label: string }> = {
  patient: { href: "/list_doctors", label: "Trouver un praticien" },
  doctor: { href: "/doctor", label: "Ouvrir mon espace" },
  admin: { href: "/admin", label: "Ouvrir l'administration" },
};

const roleLabel: Record<string, string> = {
  patient: "Patient",
  doctor: "Praticien",
  admin: "Administrateur",
};

/* Full-bleed ground for the signed-in views. Fixed, so the page scrolls over a
 * still photograph rather than dragging it along. The scrim is top-weighted:
 * the greeting is the only copy read directly off the image, and it sits at the
 * top, so the lower half stays light enough for the photo to read as a photo. */
function PageGround() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Image
        src="/images/hero-teleconsultation.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to bottom,",
            "oklch(var(--ch-scrim) / 0.88) 0%,",
            "oklch(var(--ch-scrim) / 0.82) 18%,",
            "oklch(var(--ch-scrim) / 0.72) 34%,",
            "oklch(var(--ch-scrim) / 0.62) 52%,",
            "oklch(var(--ch-scrim) / 0.55) 72%,",
            "oklch(var(--ch-scrim) / 0.52) 100%)",
          ].join(" "),
        }}
      />
    </div>
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user && user.role) {
    const actions = actionsByRole[user.role] ?? [];
    const destination = primaryDestination[user.role];
    const name =
      user.full_name || user.email?.split("@")[0] || "Utilisateur";

    return (
      <div className="relative flex-1">
        <PageGround />

        <div className="relative z-10 mx-auto w-full max-w-[68rem] px-4 py-8 lg:px-6 lg:py-10">
          {/* Read directly off the photograph — the only copy that is. */}
          <header className="border-b border-stage-rule/40 pb-6">
            <p className="label-meta text-stage-fg/70">
              {roleLabel[user.role] ?? "Compte"}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
              <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.1] tracking-display text-stage-fg">
                Bonjour, {name}
              </h1>
              {destination && (
                <Button asChild>
                  <Link href={destination.href}>
                    {destination.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </header>

          <section className="surface mt-8 p-5 sm:p-6">
            <h2 className="label-meta mb-3">Accès rapide</h2>
            <ul className="index-list">
              {actions.map(({ icon: Icon, title, description, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="index-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="icon-container icon-container-md shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {description}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  if (user && !user.role) {
    return (
      <div className="relative flex flex-1 items-center">
        <PageGround />

        <div className="relative z-10 mx-auto w-full max-w-[36rem] px-4 py-14">
          <div className="surface p-6 sm:p-8">
            <span className="icon-container icon-container-lg mb-4">
              <User className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-medium tracking-display">
              Choisissez votre profil
            </h1>
            <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">
              Indiquez si vous utilisez MédiConnect en tant que patient ou en
              tant que professionnel de santé pour accéder à votre espace.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/role_selection">
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}
