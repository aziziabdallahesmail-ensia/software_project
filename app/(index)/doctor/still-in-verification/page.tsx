import { ClipboardCheck, Info, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
  const user = await getCurrentUser();

  // Redirect if already verified
  if (user?.verificationStatus === "verified") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "rejected";
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-10 pb-8 px-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`p-5 rounded-2xl ${
                isRejected
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              }`}
            >
              {isRejected ? (
                <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
              ) : (
                <ClipboardCheck className="h-10 w-10 text-amber-500 dark:text-amber-400" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">
            {isRejected ? "Vérification refusée" : "Vérification en cours"}
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-center mb-8">
            {isRejected
              ? "Malheureusement, votre candidature nécessite une révision"
              : "Merci d'avoir soumis vos informations"}
          </p>

          {/* Info Box */}
          {isRejected ? (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400 p-5 mb-8">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-3">
                  <p className="font-medium text-foreground">
                    Votre candidature n&apos;a pas été approuvée
                  </p>
                  <p>
                    Notre équipe administrative a examiné votre candidature et
                    a constaté qu&apos;elle ne répond pas à nos exigences actuelles.
                    Les raisons courantes incluent :
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Documentation des diplômes insuffisante ou peu claire</li>
                    <li>Exigences d&apos;expérience professionnelle non satisfaites</li>
                    <li>Description des services incomplète ou vague</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-5 mb-8">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">
                    Votre profil est actuellement en cours d&apos;examen
                  </p>
                  <p>
                    Notre équipe administrative examine vos documents. Ce
                    processus prend généralement{" "}
                    <span className="font-semibold text-foreground">
                      1 à 2 jours ouvrables
                    </span>
                    . Vous recevrez une notification par e-mail une fois votre
                    compte vérifié.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Text */}
          <p className="text-sm text-muted-foreground text-center mb-8 px-4">
            {isRejected
              ? "Vous pouvez mettre à jour votre profil médecin et soumettre à nouveau pour vérification."
              : "En attendant, vous pouvez vous familiariser avec notre plateforme ou contacter notre équipe d'assistance si vous avez des questions urgentes."}
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3">
            {isRejected ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl h-12"
                >
                  <Link href="/doctor/update-profile">Mettre à jour le profil</Link>
                </Button>
                <Link
                  href="/"
                  className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                >
                  Retour à l&apos;accueil
                </Link>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl h-12"
                >
                  <Link href="/">Retour à l&apos;accueil</Link>
                </Button>
                <Link
                  href="/contact-support"
                  className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                >
                  Contacter le support
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}