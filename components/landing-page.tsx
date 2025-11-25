import React from "react";

type StepData = {
  id: string;
  title: string;
  description: string;
  icon: "profile" | "calendar" | "video" | "verified" | "docs";
  reversed?: boolean;
};

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
};

function Hero() {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="text-center lg:text-left">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
          La santé simplifiée
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight">
          Consultez des médecins
          <span className="text-primary"> n&apos;importe où, n&apos;importe quand</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0">
          Prenez des rendez-vous, consultez par vidéo et gérez votre parcours de santé sur une seule plateforme sécurisée.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <a
            className="bg-primary text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            href="#"
          >
            Commencer
            <span className="material-icons-outlined">arrow_forward</span>
          </a>
          <a
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold py-3 px-6 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            href="#"
          >
            Trouver un médecin
          </a>
        </div>
      </div>
      <div>
        <img
          alt="Deux médecins souriants, un homme et une femme, tenant des presse-papiers."
          className="rounded-lg shadow-xl w-full h-auto object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhKEhycUImmsDl8E9ky0rXfR9ST7zZU1GeuURMrVjKkbBBisYUdThOTkUntyQrKVVgNvK1Jg0pT85U0ysRm0qCfwghC40A3D7VHSsWQKE-SFdQ7ynAyDh_QXy31nUeGElvXQgFpmSAKebfnlKnga1VGCu2VTIE8smcQL9MQGIX6MQP4XLH6xiJywMjBObcTyOmmjXHmUl5PRdWoP56VxjTGShLdLbmFqIsZl0spuoH2VNUENq_t8ws4OMak2FFatQD6Wh_aijDr3g"
        />
      </div>
    </header>
  );
}

function Icon({ type }: { type: StepData["icon"] }) {
  switch (type) {
    case "profile":
      return (
        <svg
          className="w-24 h-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "calendar":
      return (
        <svg
          className="w-24 h-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "video":
      return (
        <svg
          className="w-24 h-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "verified":
      return (
        <svg
          className="w-24 h-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "docs":
      return (
        <svg
          className="w-24 h-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}

function Step({ data }: { data: StepData }) {
  return (
    <div className={`flex flex-col md:${data.reversed ? "flex-row-reverse" : "flex-row"} items-center gap-8 md:gap-12`}>
      <div className="w-full md:w-1/2">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 flex justify-center items-center h-64">
          <Icon type={data.icon} />
        </div>
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left">
        <span className="text-6xl font-bold text-primary/20 dark:text-primary/30">{data.id}</span>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2 mb-4">{data.title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{data.description}</p>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps: StepData[] = [
    {
      id: "01",
      title: "Créez votre profil",
      description: "Inscrivez-vous et complétez votre profil pour obtenir des recommandations et des services de santé personnalisés.",
      icon: "profile",
    },
    {
      id: "02",
      title: "Prise de rendez-vous",
      description: "Parcourez les profils des médecins, vérifiez leur disponibilité et prenez des rendez-vous adaptés à votre emploi du temps.",
      icon: "calendar",
      reversed: true,
    },
    {
      id: "03",
      title: "Consultation vidéo",
      description: "Échangez avec des médecins grâce à des consultations vidéo sécurisées et de haute qualité, depuis le confort de votre domicile.",
      icon: "video",
    },
    {
      id: "04",
      title: "Médecins vérifiés",
      description: "Tous les professionnels de santé sont soigneusement examinés et vérifiés pour garantir des soins de qualité.",
      icon: "verified",
      reversed: true,
    },
    {
      id: "05",
      title: "Documentation médicale",
      description: "Accédez et gérez votre historique de rendez-vous, les notes du médecin et les recommandations médicales.",
      icon: "docs",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Comment ça marche</h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Notre plateforme rend les soins de santé accessibles en quelques clics.</p>
      </div>
      <div className="mt-16 space-y-16">
        {steps.map((s) => (
          <Step key={s.id} data={s} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-lg flex flex-col items-center text-center">
      <img alt={`Photo de profil de ${t.name}`} className="w-20 h-20 rounded-full mb-4 object-cover" src={t.image} />
      <p className="text-2xl font-medium text-zinc-900 dark:text-white italic mb-6">{t.quote}</p>
      <div>
        <p className="font-bold text-zinc-900 dark:text-white">{t.name}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.role}</p>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      quote:
        '"La fonction de consultation vidéo m\'a fait gagner tellement de temps. J\'ai pu obtenir des conseils médicaux sans avoir à prendre de congé ou à me déplacer."',
      name: "Sarah P.",
      role: "Patiente",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBuaz8D3rtFUWnWk0t5zZBT5BykYhMEtlK2ejwuX0RoeJ0sMaUVynW4mvJdNHR4MUbb_7hve4LggmaT4LQexPF01xttPf62OkfGfHJmEcEwCxQ8bx4d6rkoOadeB_M70Wx0VeiHPnUPrYZuDUmwTzdKFkhr2yU24syIW4SBurDbzXAkH_GZ7Cb1mhZUFj1-rzX4TUhCJ7apnZY0EB3PIBgSG8MNy8PajsAPV5s4JkQ3Ak_KLBZY-I7liWBCkLrx3_hjrLBtPH2bMEM",
    },
    {
      id: "2",
      quote:
        '"Cette plateforme a révolutionné ma pratique. Je peux maintenant atteindre plus de patients et fournir des soins rapides sans les contraintes d\'un cabinet physique."',
      name: "Dr. Robert M.",
      role: "Cardiologue",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB8q6cyev4UPoSarm0R-5P5mS0ponIYpXxup0ctDfV9zWee5R4uGNCU6hh6BJtDPk2P9xTlQrQNRcy-2k8D3j_-h6JNy5rJV1OTIs_wjpYmMqt05zQGjKcbKnvccxiwzid7zLcAeEJfXIVWXF9reZqKJo53upsiOtMPwUw3LxXo9U2w3qhtHaf0dzE4AnLHZdxyCX7h3CUS5uJDzBaIoR1ggedugjc4eIyjjM2v-4VRhFxIsJXVMGBX-Dd5ValV7sYqfAhK5Y3DW0o",
    },
    {
      id: "3",
      quote:
        '"Le système est si pratique. J\'ai pu trouver facilement un spécialiste pour ma famille, et nous avons pu consulter quand nous en avions besoin."',
      name: "James T.",
      role: "Patient",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAbH8DeEsRc6BABuLmX0WG0y7Q6x9st7sC_iNCBZK3jvvjZk-T43oRKycQI98AfoCVMpzcw-ULvFUOX8TP8pWlayvJjjDOWJ0cWQihsx3qIvzgcYN-bOtHT8phuLMAN5qGSL-a4ZW3O3_p_dCU9rYqkDe3IwNjnVrqkdcY2bVAyM77VqiSapl0RZyzUsFzFfsuUrZjYcEYkAoEsECDKFhvufD19wQIq98QhbQHaLxX2hM6EBnxRmdyLdSEaNQv6pQkw543_BOgCDkw",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">Témoignages</span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Ce que disent nos utilisateurs</h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Écoutez les patients et les médecins qui utilisent notre plateforme.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-primary/5 dark:bg-zinc-800/50 rounded-lg py-20 px-6 my-20">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Prêt à prendre le contrôle de votre santé ?</h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Rejoignez des milliers d&apos;utilisateurs qui ont simplifié leur parcours de santé avec notre plateforme. Commencez dès aujourd&apos;hui et découvrez les soins de santé tels qu&apos;ils devraient être.</p>
        <div className="mt-8">
          <a className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity" href="#">
            S&apos;inscrire maintenant
          </a>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <Hero />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  );
}

