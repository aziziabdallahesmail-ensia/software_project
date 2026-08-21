import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";
import {
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  UsersRound,
  CalendarCheck,
  Video,
  FileText,
  User,
  ArrowRight,
} from "lucide-react";

/* Hallmark · macrostructure: Catalogue (marketing variant) · design-system: design.md
 * genre: modern-minimal · nav: N1b · footer: Ft2 · enrichment: none
 *
 * NOTE ON COPY: the previous version shipped a proof bar reading
 * "500+ patients accompagnés · 30 professionnels certifiés · 4.9/5 satisfaction".
 * Those figures were not backed by any data source, so they were removed rather
 * than restyled. The specialty count below is read from lib/specialities.
 * The testimonials remain as authored — see the handoff note. */

const steps = [
  {
    id: "01",
    title: "Créez votre profil",
    description:
      "Inscrivez-vous en quelques secondes et choisissez votre rôle : patient ou praticien.",
    icon: UsersRound,
  },
  {
    id: "02",
    title: "Réservez un créneau",
    description:
      "Consultez les disponibilités réelles des spécialistes et réservez directement.",
    icon: CalendarCheck,
  },
  {
    id: "03",
    title: "Consultez en vidéo",
    description:
      "Rejoignez une consultation vidéo chiffrée depuis votre navigateur.",
    icon: Video,
  },
  {
    id: "04",
    title: "Suivez votre activité",
    description:
      "Praticiens : gérez vos rendez-vous et vos créneaux depuis un tableau de bord dédié.",
    icon: FileText,
  },
];

const guarantees = [
  {
    title: "Sécurité des données",
    description:
      "Vos données médicales sont protégées selon des normes strictes.",
    icon: ShieldCheck,
  },
  {
    title: "Expérience sans friction",
    description:
      "Une interface sobre, pensée pour aller à l'essentiel rapidement.",
    icon: CheckCircle2,
  },
  {
    title: "Praticiens vérifiés",
    description:
      "Chaque dossier est examiné et validé par notre équipe avant publication.",
    icon: Stethoscope,
  },
];

const userProfiles = [
  {
    id: "patient",
    title: "Patient",
    description: "Consultez des praticiens et gérez votre suivi.",
    icon: User,
    features: [
      "Prise de rendez-vous",
      "Historique des consultations",
      "Consultations vidéo",
    ],
    link: "/role_selection",
  },
  {
    id: "doctor",
    title: "Professionnel de santé",
    description: "Gérez votre activité et vos consultations.",
    icon: Stethoscope,
    features: [
      "Tableau de bord",
      "Gestion des créneaux",
      "Consultations en ligne",
    ],
    link: "/role_selection",
  },
];

const testimonials = [
  {
    quote:
      "La plateforme m'a permis de trouver rapidement un spécialiste adapté à mes besoins, tout en assurant la sécurité de mes données médicales.",
    name: "Sarah Amina",
    role: "Patiente",
    image: "/images/female_patient.png",
  },
  {
    quote:
      "En tant que cardiologue, cette plateforme m'aide à gérer mes rendez-vous et à offrir des consultations à distance en toute sécurité.",
    name: "Dr. Ahmed Riadh",
    role: "Cardiologue",
    image: "/images/old_doctor.png",
  },
  {
    quote:
      "Trouver un spécialiste pour ma famille n'a jamais été aussi simple. Tout est centralisé et prêt à être consulté.",
    name: "Ibrahim Esmail",
    role: "Patient",
    image: "/images/male_patient.png",
  },
];

function Hero() {
  return (
    <section>
      {/* No contained image panel here any more — the photograph is the page
       * ground (see PageGround). The hero is copy laid straight on it. */}
      <div className="flex min-h-[24rem] flex-col justify-end py-10 lg:min-h-[30rem] lg:py-14">
        <div className="max-w-[44rem]">
            <p className="label-meta text-stage-fg/70">
              Plateforme de rendez-vous médicaux
            </p>
            <h1 className="mt-3 font-display text-[length:var(--text-display)] font-medium leading-[1.05] tracking-display text-stage-fg">
              Le soin commence par un rendez-vous simple à prendre.
            </h1>
            <p className="mt-4 max-w-[38rem] text-base leading-relaxed text-stage-fg/80">
              Trouvez un praticien vérifié, réservez un créneau réel et rejoignez
              votre consultation vidéo — sans appel téléphonique ni salle
              d&apos;attente.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="onDark" asChild>
                <Link href="/auth/sign-up">Créer un compte</Link>
              </Button>
              <Button size="lg" variant="onDarkOutline" asChild>
                <Link href="/list_doctors">Parcourir les spécialités</Link>
              </Button>
          </div>
        </div>
      </div>

      {/* Real capability summary — no invented figures. */}
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border sm:grid-cols-4">
        <div className="bg-card p-4">
          <dt className="label-meta">Spécialités</dt>
          <dd className="tabular mt-1.5 text-2xl font-medium">
            {SPECIALTIES.length}
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-meta">Consultation</dt>
          <dd className="mt-1.5 text-sm font-medium">Vidéo chiffrée</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-meta">Praticiens</dt>
          <dd className="mt-1.5 text-sm font-medium">Vérifiés un par un</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-meta">Créneaux</dt>
          <dd className="mt-1.5 text-sm font-medium">Disponibilité réelle</dd>
        </div>
      </dl>
    </section>
  );
}

function HowItWorks() {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium tracking-display text-stage-fg">
        Comment ça marche
      </h2>
      <ol className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ id, title, description, icon: Icon }) => (
          <li key={id} className="bg-card p-5">
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="tabular text-xs text-muted-foreground">
                {id}
              </span>
            </div>
            <h3 className="mt-3 font-display text-base font-medium tracking-display">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function UserProfiles() {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium tracking-display text-stage-fg">
        Choisissez votre profil
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {userProfiles.map(({ id, title, description, icon: Icon, features, link }) => (
          <div key={id} className="surface flex flex-col p-5">
            <span className="icon-container icon-container-md">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className="mt-4 font-display text-lg font-medium tracking-display">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {description}
            </p>
            <ul className="mt-4 flex flex-1 flex-col gap-2 border-t border-border-soft pt-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-5 w-fit" asChild>
              <Link href={link}>
                Continuer comme {title.toLowerCase()}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Guarantees() {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium tracking-display text-stage-fg">
        Nos engagements
      </h2>
      <div className="surface mt-6 p-5 sm:p-6">
        <ul className="index-list">
          {guarantees.map(({ title, description, icon: Icon }) => (
            <li key={title} className="index-row">
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium tracking-display text-stage-fg">
        Témoignages
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {testimonials.map(({ quote, name, role, image }) => (
          <figure key={name} className="surface flex flex-col p-5">
            <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
              {quote}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border-soft pt-4">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[var(--radius-control)] border border-border-soft bg-muted">
                <Image src={image} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="surface flex flex-col items-start gap-5 border-primary/25 bg-primary-soft p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
      <div className="min-w-0">
        <Badge variant="default" dot={false}>
          Prêt à commencer
        </Badge>
        <h2 className="mt-3 font-display text-xl font-medium leading-tight tracking-display sm:text-2xl">
          Prenez votre premier rendez-vous
        </h2>
        <p className="measure mt-1.5 text-sm text-muted-foreground">
          Sans engagement — vos rendez-vous restent annulables à tout moment.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href="/role_selection">Choisir mon profil</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/list_doctors">Voir les praticiens</Link>
        </Button>
      </div>
    </section>
  );
}

/* The photograph is the page's ground, not a panel inside it: opaque, full
 * bleed, and fixed, so the content scrolls over a still image. Per design.md,
 * copy overlapping photography sits under --ch-scrim — that covers the hero
 * and the section headings. Everything else rides on opaque surfaces, so no
 * body text is ever read directly off the image. */
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
            "oklch(var(--ch-scrim) / 0.42) 0%,",
            "oklch(var(--ch-scrim) / 0.50) 18%,",
            "oklch(var(--ch-scrim) / 0.62) 38%,",
            "oklch(var(--ch-scrim) / 0.72) 58%,",
            "oklch(var(--ch-scrim) / 0.78) 78%,",
            "oklch(var(--ch-scrim) / 0.82) 100%)",
          ].join(" "),
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative">
      <PageGround />
      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-col gap-14 px-4 py-10 lg:gap-20 lg:px-6 lg:py-14">
        <Hero />
        <HowItWorks />
        <UserProfiles />
        <Guarantees />
        <Testimonials />
        <CTA />
      </div>
    </div>
  );
}
