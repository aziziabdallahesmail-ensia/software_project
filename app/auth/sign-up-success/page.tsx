import Link from "next/link";
import { MailCheck } from "lucide-react";

/* Hallmark · Split Studio · design-system: design.md */

export default function Page() {
  return (
    <div className="flex flex-col">
      <header className="border-b border-border pb-5">
        <span className="icon-container icon-container-md mb-4 border-success/25 bg-success-soft text-success">
          <MailCheck className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-medium tracking-display">
          Votre compte est créé
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Un e-mail de confirmation vient de vous être envoyé.
        </p>
      </header>

      <ol className="mt-6 space-y-4 text-sm text-muted-foreground">
        <li className="flex gap-3">
          <span className="tabular mt-px shrink-0 text-xs text-primary">01</span>
          Ouvrez le message et cliquez sur le lien de confirmation.
        </li>
        <li className="flex gap-3">
          <span className="tabular mt-px shrink-0 text-xs text-primary">02</span>
          Choisissez votre profil&nbsp;: patient ou praticien.
        </li>
        <li className="flex gap-3">
          <span className="tabular mt-px shrink-0 text-xs text-primary">03</span>
          Réservez votre première consultation.
        </li>
      </ol>

      <p className="mt-6 border-t border-border-soft pt-5 text-sm text-muted-foreground">
        Vous avez confirmé votre adresse&nbsp;?{" "}
        <Link
          href="/auth/login"
          className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
