import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  FileText,
  LucideIcon,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  Video,
  User,
  Building2,
} from "lucide-react";
import React from "react";
import Link from "next/link";

type Metric = {
  label: string;
  value: string;
};

type Step = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const heroMetrics: Metric[] = [
  { label: "Patients accompagnés", value: "500+" },
  { label: "Professionnels certifiés", value: "30" },
  { label: "Satisfaction moyenne", value: "4.9/5" },
];

const steps: Step[] = [
  {
    id: "01",
    title: "Créez votre profil",
    description:
      "Inscrivez-vous en quelques secondes, choisissez votre rôle patient ou médecins.",
    icon: UsersRound,
  },
  {
    id: "02",
    title: "Réservez en quelques clics",
    description:
      "Consultez la disponibilité des spécialistes et prenez rendez-vous instantanément.",
    icon: CalendarCheck,
  },
  {
    id: "03",
    title: "Consultez en vidéo HD",
    description:
      "Profitez d'une consultation sécurisée par vidéo synchronisée entre patients et médecins.",
    icon: Video,
  },
  {
    id: "04",
    title: "Pour Medcins et Cliniques",
    description:
      "Gérez facilement vos rendez-vous, patients et consultations en ligne via notre tableau de bord dédié.",
    icon: FileText,
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "La plateforme m'a permis de trouver rapidement un spécialiste adapté à mes besoins, tout en assurant la securité de mes données médicales.",
    name: "Sarah Amina.",
    role: "Patiente",
    image:
      "/images/female_patient.png",
  },
  {
    quote:
      "En tant que cardiologue, cette plateforme m'a aidé à gérer mes rendez-vous et à offrir des consultations à distance en toute sécurité.",
    name: "Dr. Ahmed Riadh.",
    role: "Cardiologue",
    image:
      "/images/old_doctor.png",
  },
  {
    quote:
      "Trouver un spécialiste pour ma famille n'a jamais été aussi simple. Tout est centralisé et prêt à être consulté.",
    name: "Ibrahim Esmail.",
    role: "Patient",
    image:
      "/images/male_patient.png",
  },
];

const guarantees = [
  {
    title: "Securité des données",
    description: "Votre données médicales sont protégées selon les normes les plus strictes.",
    icon: ShieldCheck,
  },
  {
    title: "Experience utilisateur optimale",
    description: " Interface intuitive et support réactif pour une utilisation sans friction.",
    icon: CheckCircle2,
  },
  {
    title: "Medecins certifiés et vérifiés",
    description: "Tous les professionnels sont rigoureusement sélectionnés et certifiés.",
    icon: Stethoscope,
  },
];

// Nouvelle section pour les profils d'utilisateurs
const userProfiles = [
  {
    id: "patient",
    title: "Patient",
    description: "Consultez des médecins et gérez votre santé",
    icon: User,
    features: ["Prise de rendez-vous", "Suivi médical", "Consultations vidéo"],
    link: "/role_selection",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "doctor",
    title: "Professionnel de santé",
    description: "Gérez votre cabinet et vos consultations",
    icon: Stethoscope,
    features: ["Tableau de bord", "Gestion des patients", "Consultations en ligne"],
    link: "/role_selection",
    color: "from-green-500 to-emerald-500"
  },
  
];

function Hero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[0.9fr,1fr] lg:items-center">
      <div className="space-y-8 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-4 py-1 text-xs font-medium text-muted-foreground">
          La santé connectée et humaine
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Consultez un médecin certifié
            <span className="text-primary"> en moins de 2 minutes</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Une plateforme pensée pour les patients exigeants et les praticiens modernes :
            accès instantanéet et expérience vidéo hautement sécurisée.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/role_selection">
              Commencer gratuitement
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="/list_doctors">
              Trouver un médecin
            </Link>
          </Button>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          {heroMetrics.map((metric) => (
            <Card key={metric.label} className="border-border/70 bg-background/60 backdrop-blur">
              <CardContent className="p-4 text-left">
                <dt className="text-sm text-muted-foreground">{metric.label}</dt>
                <dd className="text-2xl font-semibold text-foreground">{metric.value}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>
      </div>
      <Card className="border-border/70 bg-gradient-to-br from-background via-background to-primary/5 shadow-2xl">
        <CardHeader className="space-y-2">
          <Badge className="w-fit bg-primary/15 text-primary">Session en direct</Badge>
          <CardTitle className="text-2xl"> </CardTitle>
          <CardDescription>
            Découvrez comment la téléconsultation révolutionne l'accès aux soins,
            offrant flexibilité et sécurité tant pour les patients que pour les professionnels de santé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 rounded-xl border border-border/70 bg-background/80 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-border/70">
                <img
                  src="/images/young_doctor.png"
                  alt="Médecin"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consultation avec</p>
                <p className="text-base font-semibold text-foreground">Dr. Mohammed Amine</p>
              </div>
            </div>
            <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
              « La téléconsultation m'a permis d'élargir l'accès aux soins pour mes patients, tout en assurant la confidentialité et la sécurité de leurs données médicales. »

            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/60 bg-background">
              <CardContent className="flex flex-col gap-1 p-4">
                <p className="text-xs uppercase text-muted-foreground">Verrouillage</p>
                <p className="text-lg font-semibold">Chiffrement E2E</p>
                <p className="text-sm text-muted-foreground">
                  Accès restreint aux professionnels vérifiés.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-primary/5">
              <CardContent className="flex flex-col gap-1 p-4">
                <p className="text-xs uppercase text-primary">Qualité service</p>
                <p className="text-lg font-semibold text-primary">Vidéo HD</p>
                <p className="text-sm text-muted-foreground">
                  On vous garantit une qualité vidéo HD pour des consultations fluides et efficaces.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mx-auto w-fit">
          Parcours guidé
        </Badge>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Comment ça marche&nbsp;?
          </h2>
          <p className="text-lg text-muted-foreground">
            Un accompagnement complet, de la prise de rendez-vous à la consultation.
          </p>
        </div>
      </div>
      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className={cn(
              "border-border/70 bg-background/70 backdrop-blur",
              index % 2 === 0 ? "lg:ml-0" : "lg:mr-0",
            )}
          >
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>Étape {step.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-base text-muted-foreground">
              {step.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function UserProfiles() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mx-auto w-fit">
          Profils utilisateurs
        </Badge>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Pour qui est fait MédiConnect&nbsp;?
          </h2>
          <p className="text-lg text-muted-foreground">
            Découvrez l&apos;expérience adaptée à votre profil
          </p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
        {userProfiles.map((profile) => (
          <Card key={profile.id} className="border-border/70 bg-background/80 backdrop-blur hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className={cn(
                "mx-auto mb-4 rounded-2xl p-4 bg-gradient-to-r text-white",
                profile.color
              )}>
                <profile.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">{profile.title}</CardTitle>
              <CardDescription className="text-base">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {profile.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4" asChild>
                <Link href={profile.link}>
                  Accéder {profile.id === "doctor" ? "au dashboard" : "au profil"}
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Guarantees() {
  return (
    <section className="space-y-10">
      <div className="space-y-3 text-center">
        <Badge variant="secondary" className="mx-auto w-fit">
          Confiance & conformité
        </Badge>
        <h2 className="text-3xl font-semibold text-foreground">Ce que nous garantissons</h2>
        <p className="text-muted-foreground">
          Une expérience pensée pour la sécurité des données et la qualité des soins.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {guarantees.map((guarantee) => (
          <Card key={guarantee.title} className="border-border/70 bg-background/80">
            <CardHeader>
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <guarantee.icon className="size-6" />
              </div>
              <CardTitle>{guarantee.title}</CardTitle>
              <CardDescription>{guarantee.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="secondary" className="mx-auto w-fit">
          Témoignages
        </Badge>
        <h2 className="text-3xl font-semibold text-foreground">Ils utilisent déjà la plateforme</h2>
        <p className="text-muted-foreground">
          Des patients et des professionnels de santé partagent leur expérience.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="border-border/70 bg-background/70">
            <CardContent className="space-y-6 p-6">
              <p className="text-lg font-medium text-foreground">&ldquo; {testimonial.quote} &rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-border/60">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section>
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardHeader className="space-y-4 text-center">
          <Badge className="mx-auto w-fit bg-primary/20 text-primary">
            Prêt à commencer ?
          </Badge>
          <CardTitle className="text-3xl font-semibold">
            Prenez le contrôle de votre santé dès aujourd&apos;hui
          </CardTitle>
          <CardDescription className="text-base">
            Rejoignez les patients et praticiens qui simplifient leurs démarches médicales.
            Aucun engagement, annulation possible à tout moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/role_selection">
              Choisir mon profil
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
            <Link href="/list_doctors">
              Parcourir les médecins
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-12">
      <Hero />
      <HowItWorks />
      <UserProfiles />
      <Guarantees />
      <Testimonials />
      <CTA />
    </div>
  );
}
