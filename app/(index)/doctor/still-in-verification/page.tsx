import { ClipboardCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";

/* Hallmark · design-system: design.md
 * A status page, not a marketing card. State is carried by the chip vocabulary.
 * Note: the previous version linked to /doctor/update-profile and
 * /contact-support; neither route exists, so both were 404s. */

export default async function VerificationPage() {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "verified") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "rejected";

  return (
    <div className="mx-auto w-full max-w-[42rem]">
      <header className="page-header">
        <span
          className={`icon-container icon-container-lg mb-4 ${
            isRejected
              ? "border-destructive/25 bg-destructive-soft text-destructive"
              : "border-warning/30 bg-warning-soft text-warning"
          }`}
        >
          {isRejected ? (
            <XCircle className="h-5 w-5" />
          ) : (
            <ClipboardCheck className="h-5 w-5" />
          )}
        </span>
        <h1 className="font-display text-2xl font-medium leading-tight tracking-display">
          {isRejected ? "Vérification refusée" : "Vérification en cours"}
        </h1>
        <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">
          {isRejected
            ? "Votre dossier a été examiné et n'a pas été approuvé en l'état."
            : "Votre dossier a bien été transmis à notre équipe administrative."}
        </p>
      </header>

      {isRejected ? (
        <section>
          <h2 className="label-meta">Motifs les plus fréquents</h2>
          <ul className="mt-3 flex flex-col divide-y divide-border-soft border-y border-border-soft">
            {[
              "Justificatif de diplôme insuffisant ou illisible",
              "Expérience professionnelle ne répondant pas aux critères",
              "Description de la pratique incomplète",
            ].map((reason) => (
              <li
                key={reason}
                className="py-3 text-sm leading-relaxed text-muted-foreground"
              >
                {reason}
              </li>
            ))}
          </ul>
          <p className="measure mt-5 text-sm leading-relaxed text-muted-foreground">
            Vous pouvez compléter vos informations et soumettre à nouveau votre
            dossier.
          </p>
        </section>
      ) : (
        <section className="surface p-5">
          <h2 className="label-meta">Ce qui se passe maintenant</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {[
              "Notre équipe examine vos justificatifs.",
              "Vous recevez un e-mail dès que la décision est prise.",
              "Votre espace praticien s'ouvre automatiquement une fois vérifié.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="tabular mt-px shrink-0 text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed text-muted-foreground">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-border-soft pt-4 text-sm text-muted-foreground">
            Délai habituel&nbsp;:{" "}
            <span className="tabular text-foreground">1 à 2</span> jours
            ouvrables.
          </p>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border-soft pt-5">
        {isRejected ? (
          <Button asChild>
            <Link href="/role_selection">Compléter mon dossier</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/list_doctors">Parcourir la plateforme</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
