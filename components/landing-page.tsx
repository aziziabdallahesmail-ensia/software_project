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

const userProfiles = [
  {
    id: "patient",
    title: "Patient",
    description: "Consultez des médecins et gérez votre santé",
    icon: User,
    features: ["Prise de rendez-vous", "Suivi médical", "Consultations vidéo"],
    link: "/role_selection",
    color: "from-primary to-accent",
    badgeColor: "bg-primary/10 text-primary border-primary/20"
  },
  {
    id: "doctor",
    title: "Professionnel de santé",
    description: "Gérez votre cabinet et vos consultations",
    icon: Stethoscope,
    features: ["Tableau de bord", "Gestion des patients", "Consultations en ligne"],
    link: "/role_selection",
    color: "from-success to-primary",
    badgeColor: "bg-success/10 text-success border-success/20"
  },
];

function Hero() {
  return (
    <section className="relative grid gap-10 lg:grid-cols-[0.9fr,1fr] lg:items-center py-10 lg:py-20">
      <div className="space-y-8 text-center lg:text-left z-10">
        <Badge className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
          La santé connectée et humaine
        </Badge>
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Consultez un médecin certifié
            <span className="text-primary"> en moins de 2 minutes</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0">
            Une plateforme pensée pour les patients exigeants et les praticiens modernes :
            accès instantané et expérience vidéo hautement sécurisée.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <Button size="lg" className="h-14 px-8 text-base shadow-lg" asChild>
            <Link href="/role_selection">
              Commencer gratuitement
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-base"
            asChild
          >
            <Link href="/list_doctors">
              Trouver un médecin
            </Link>
          </Button>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3 pt-6">
          {heroMetrics.map((metric) => (
            <Card key={metric.label} className="border-border/60 bg-card/60 backdrop-blur overflow-hidden group">
              <CardContent className="p-5 text-left relative z-10">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{metric.label}</dt>
                <dd className="text-3xl font-bold text-foreground">{metric.value}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>
      </div>

      {/* Hero Interactive Image/Card */}
      <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
        <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl z-0" />
        <Card className="relative z-10 border-border/60 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-3 pb-4">
            <Badge className="w-fit bg-primary/10 text-primary border border-primary/20 rounded-lg px-3 py-1">Session en direct</Badge>
            <CardDescription className="text-base text-muted-foreground font-medium">
              Découvrez comment la téléconsultation révolutionne l&apos;accès aux soins,
              offrant flexibilité et sécurité tant pour les patients que pour les professionnels de santé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 rounded-xl border border-border/60 bg-secondary/50 p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg border-2 border-primary/30 shadow-sm flex-shrink-0">
                  <img
                    src="/images/young_doctor.png"
                    alt="Médecin"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-white dark:border-slate-950" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-0.5">Consultation avec</p>
                  <p className="text-lg font-bold text-foreground">Dr. Mohammed Amine</p>
                </div>
              </div>
              <div className="rounded-lg bg-card p-4 text-sm text-muted-foreground italic shadow-sm border border-border/60">
                « La téléconsultation m&apos;a permis d&apos;élargir l&apos;accès aux soins pour mes patients, tout en assurant la confidentialité et la sécurité de leurs données médicales. »
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border/60 bg-card/60 backdrop-blur rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                <CardContent className="flex flex-col gap-2 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verrouillage</p>
                  <p className="text-xl font-bold text-foreground">Chiffrement E2E</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Accès restreint aux professionnels vérifiés.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-primary/5 backdrop-blur rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                <CardContent className="flex flex-col gap-2 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Qualité service</p>
                  <p className="text-xl font-bold text-primary">Vidéo HD</p>
                  <p className="text-sm text-primary/80 leading-relaxed">
                    On vous garantit une qualité vidéo HD pour des consultations fluides.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="relative space-y-16 py-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="mx-auto w-fit bg-secondary text-muted-foreground border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Parcours guidé
        </Badge>
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Un accompagnement complet, de la prise de rendez-vous à la consultation.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className="group relative overflow-hidden border-border/60 bg-card/60 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl"
          >
            <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />

            <CardHeader className="relative flex flex-row items-start gap-5 pb-4 z-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="space-y-1 mt-1">
                <Badge className="bg-secondary text-muted-foreground font-mono text-xs">
                  Étape {step.id}
                </Badge>
                <CardTitle className="text-xl font-bold text-foreground leading-tight">
                  {step.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0 pl-[5.25rem] text-base text-muted-foreground font-medium leading-relaxed z-10">
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
    <section className="relative space-y-16 py-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="mx-auto w-fit bg-secondary text-muted-foreground border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Profils utilisateurs
        </Badge>
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Pour qui est fait MédiConnect ?
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Découvrez l&apos;expérience adaptée à votre profil
          </p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {userProfiles.map((profile) => (
          <Card key={profile.id} className="group relative overflow-hidden border-border/60 bg-card/60 backdrop-blur hover:shadow-xl transition-all duration-500 hover:-translate-y-2 rounded-xl">
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${profile.color}`} />
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${profile.color} opacity-5 group-hover:opacity-10 transition-opacity blur-3xl rounded-full pointer-events-none`} />

            <CardHeader className="text-center pb-6 pt-10">
              <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${profile.color} text-primary-foreground shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <profile.icon className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">{profile.title}</CardTitle>
              <CardDescription className="text-base font-medium text-muted-foreground">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-10">
              <ul className="space-y-4 bg-secondary/50 rounded-xl p-6 border border-border/60">
                {profile.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`w-full h-14 rounded-xl bg-gradient-to-r ${profile.color} hover:opacity-90 text-primary-foreground shadow-lg text-base font-semibold group-hover:shadow-lg transition-all uppercase tracking-wide`} asChild>
                <Link href={profile.link}>
                  Accéder {profile.id === "doctor" ? "au dashboard" : "au profil"}
                  <ArrowRight className="size-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
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
    <section className="relative space-y-16 py-10">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mx-auto w-fit bg-secondary text-muted-foreground border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Confiance & conformité
        </Badge>
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">Ce que nous garantissons</h2>
        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
          Une expérience pensée pour la sécurité des données et la qualité des soins.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {guarantees.map((guarantee) => (
          <Card key={guarantee.title} className="group border-border/60 bg-card/40 backdrop-blur shadow-sm hover:shadow-lg hover:bg-card/60 transition-all duration-300 rounded-xl text-center p-2">
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card border border-border text-primary shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/30 group-hover:bg-primary/5">
                <guarantee.icon className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground leading-tight mb-2">{guarantee.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{guarantee.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative space-y-16 py-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="mx-auto w-fit bg-secondary text-muted-foreground border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Témoignages
        </Badge>
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">Ils utilisent déjà la plateforme</h2>
        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
          Des patients et des professionnels de santé partagent leur expérience.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardContent className="flex flex-col h-full space-y-6 p-8">
              <div className="text-4xl font-serif text-primary/20 absolute top-6 left-6">"</div>
              <p className="relative z-10 text-lg font-medium text-muted-foreground italic leading-relaxed flex-1 pt-6 text-center">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-border/60">
                <div className="h-14 w-14 overflow-hidden rounded-lg border-2 border-primary/20">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground text-base">{testimonial.name}</p>
                  <p className="text-sm font-semibold text-primary">{testimonial.role}</p>
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
    <section className="relative py-10">
      <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-50 pointer-events-none" />
      <Card className="relative overflow-hidden border-0 bg-primary p-8 md:p-14 shadow-2xl rounded-xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-foreground/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <CardHeader className="space-y-6 text-center relative z-10 flex flex-col items-center">
          <Badge className="bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            Prêt à commencer ?
          </Badge>
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-primary-foreground max-w-2xl mx-auto leading-tight">
            Prenez le contrôle de votre santé dès aujourd&apos;hui
          </CardTitle>
          <CardDescription className="text-lg text-primary-foreground/80 font-medium max-w-xl mx-auto">
            Rejoignez les patients et praticiens qui simplifient leurs démarches médicales.
            Aucun engagement, annulation possible à tout moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:justify-center relative z-10 pt-8">
          <Button size="lg" className="h-14 px-8 text-base bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl rounded-lg transition-all uppercase tracking-wide font-bold" asChild>
            <Link href="/role_selection">
              Choisir mon profil
              <ArrowRight className="size-5 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-base border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur rounded-lg transition-all uppercase tracking-wide font-bold" asChild>
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
    <div className="relative flex-1 flex flex-col font-sans">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 md:gap-24">
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
