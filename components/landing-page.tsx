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
  Sparkles,
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
    color: "from-blue-500 to-indigo-500",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    id: "doctor",
    title: "Professionnel de santé",
    description: "Gérez votre cabinet et vos consultations",
    icon: Stethoscope,
    features: ["Tableau de bord", "Gestion des patients", "Consultations en ligne"],
    link: "/role_selection",
    color: "from-emerald-500 to-teal-500",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
];

function Hero() {
  return (
    <section className="relative grid gap-10 lg:grid-cols-[0.9fr,1fr] lg:items-center py-10 lg:py-20">
      <div className="space-y-8 text-center lg:text-left z-10">
        <Badge className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-800">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          La santé connectée et humaine
        </Badge>
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-7xl">
            Consultez un médecin certifié
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400"> en moins de 2 minutes</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0">
            Une plateforme pensée pour les patients exigeants et les praticiens modernes :
            accès instantané et expérience vidéo hautement sécurisée.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <Button size="lg" className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-2xl transition-all hover:scale-105" asChild>
            <Link href="/role_selection">
              Commencer gratuitement
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-base border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-sm rounded-2xl transition-all"
            asChild
          >
            <Link href="/list_doctors">
              Trouver un médecin
            </Link>
          </Button>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3 pt-6">
          {heroMetrics.map((metric) => (
            <Card key={metric.label} className="border-0 shadow-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-colors duration-500" />
              <CardContent className="p-5 text-left relative z-10">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{metric.label}</dt>
                <dd className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>
      </div>
      
      {/* Hero Interactive Image/Card */}
      <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-[3rem] blur-2xl z-0" />
        <Card className="relative z-10 border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-3 pb-4">
            <Badge className="w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1">Session en direct</Badge>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400 font-medium">
              Découvrez comment la téléconsultation révolutionne l'accès aux soins,
              offrant flexibilité et sécurité tant pour les patients que pour les professionnels de santé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/50 p-5 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-500/30 shadow-sm flex-shrink-0">
                  <img
                    src="/images/young_doctor.png"
                    alt="Médecin"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-0.5">Consultation avec</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">Dr. Mohammed Amine</p>
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-900 p-4 text-sm text-slate-600 dark:text-slate-300 italic shadow-sm border border-slate-100 dark:border-slate-800">
                « La téléconsultation m'a permis d'élargir l'accès aux soins pour mes patients, tout en assurant la confidentialité et la sécurité de leurs données médicales. »
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                <CardContent className="flex flex-col gap-2 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verrouillage</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">Chiffrement E2E</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Accès restreint aux professionnels vérifiés.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 backdrop-blur-sm rounded-2xl shadow-sm hover:-translate-y-1 transition-transform">
                <CardContent className="flex flex-col gap-2 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Qualité service</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Vidéo HD</p>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed">
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
        <Badge variant="outline" className="mx-auto w-fit bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full">
          Parcours guidé
        </Badge>
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Un accompagnement complet, de la prise de rendez-vous à la consultation.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className="group relative overflow-hidden border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-[2rem]"
          >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-opacity" />
            <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl" />
            
            <CardHeader className="relative flex flex-row items-start gap-5 pb-4 z-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="space-y-1 mt-1">
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 font-mono text-xs">
                  Étape {step.id}
                </Badge>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {step.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0 pl-[5.25rem] text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed z-10">
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
        <Badge variant="outline" className="mx-auto w-fit bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full">
          Profils utilisateurs
        </Badge>
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Pour qui est fait MédiConnect ?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Découvrez l'expérience adaptée à votre profil
          </p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {userProfiles.map((profile) => (
          <Card key={profile.id} className="group relative overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-[2rem]">
            {/* Animated Gradient Background */}
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${profile.color}`} />
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${profile.color} opacity-5 group-hover:opacity-10 transition-opacity blur-3xl rounded-full pointer-events-none`} />
            
            <CardHeader className="text-center pb-6 pt-10">
              <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${profile.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <profile.icon className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{profile.title}</CardTitle>
              <CardDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-10">
              <ul className="space-y-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/50">
                {profile.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`w-full h-14 rounded-2xl bg-gradient-to-r ${profile.color} hover:opacity-90 text-white shadow-lg text-base font-semibold group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all uppercase tracking-wide`} asChild>
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
        <Badge variant="outline" className="mx-auto w-fit bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full">
          Confiance & conformité
        </Badge>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">Ce que nous garantissons</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Une expérience pensée pour la sécurité des données et la qualité des soins.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {guarantees.map((guarantee) => (
          <Card key={guarantee.title} className="group border-0 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 rounded-[2rem] text-center p-2">
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-500 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:border-emerald-500/30 group-hover:bg-emerald-50 max-lg:group-hover:dark:bg-emerald-900/20">
                <guarantee.icon className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">{guarantee.title}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">{guarantee.description}</CardDescription>
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
        <Badge variant="outline" className="mx-auto w-fit bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full">
          Témoignages
        </Badge>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">Ils utilisent déjà la plateforme</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Des patients et des professionnels de santé partagent leur expérience.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="relative overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 rounded-[2rem]">
            <CardContent className="flex flex-col h-full space-y-6 p-8">
              <div className="text-4xl font-serif text-emerald-500/20 absolute top-6 left-6">"</div>
              <p className="relative z-10 text-lg font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed flex-1 pt-6 text-center">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-500/20">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-base">{testimonial.name}</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{testimonial.role}</p>
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
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[3rem] blur-2xl opacity-20 pointer-events-none" />
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-14 shadow-2xl rounded-[3rem]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <CardHeader className="space-y-6 text-center relative z-10 flex flex-col items-center">
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
            Prêt à commencer ?
          </Badge>
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
            Prenez le contrôle de votre santé dès aujourd'hui
          </CardTitle>
          <CardDescription className="text-lg text-slate-300 font-medium max-w-xl mx-auto">
            Rejoignez les patients et praticiens qui simplifient leurs démarches médicales.
            Aucun engagement, annulation possible à tout moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:justify-center relative z-10 pt-8">
          <Button size="lg" className="h-14 px-8 text-base bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 rounded-2xl transition-all hover:scale-105 uppercase tracking-wide font-bold" asChild>
            <Link href="/role_selection">
              Choisir mon profil
              <ArrowRight className="size-5 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-600 bg-slate-800/50 hover:bg-slate-700 hover:text-white text-white backdrop-blur-sm rounded-2xl transition-all uppercase tracking-wide font-bold" asChild>
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
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Background ambient blobs */}
      <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/10 dark:bg-emerald-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-400/10 dark:bg-teal-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-400/5 dark:bg-blue-900/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 md:gap-24 px-4 sm:px-6 py-12">
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
