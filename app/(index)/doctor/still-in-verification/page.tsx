import { ClipboardCheck, Info, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "verified") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "rejected";
  
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background to-background">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-8 px-6">
          <div className="flex justify-center mb-6">
            <div
              className={`icon-container icon-container-lg ${
                isRejected
                  ? "bg-destructive/10 text-destructive"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {isRejected ? (
                <XCircle className="h-6 w-6" />
              ) : (
                <ClipboardCheck className="h-6 w-6" />
              )}
            </div>
          </div>

          <h1 className="text-xl font-bold text-center text-foreground mb-2">
            {isRejected ? "Vérification refusée" : "Vérification en cours"}
          </h1>

          <p className="text-muted-foreground text-center mb-6 text-sm">
            {isRejected
              ? "Malheureusement, votre candidature nécessite une révision"
              : "Merci d'avoir soumis vos informations"}
          </p>

          {isRejected ? (
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 mb-6">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground space-y-3">
                  <p className="font-medium">
                    Votre candidature n'a pas été approuvée
                  </p>
                  <p className="text-muted-foreground">
                    Notre équipe administrative a examiné votre candidature et
                    a constaté qu'elle ne répond pas à nos exigences actuelles.
                    Les raisons courantes incluent :
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>Documentation des diplômes insuffisante ou peu claire</li>
                    <li>Exigences d'expérience professionnelle non satisfaites</li>
                    <li>Description des services incomplète ou vague</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-warning/5 border border-warning/20 p-4 mb-6">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    Votre profil est actuellement en cours d'examen
                  </p>
                  <p className="text-muted-foreground mt-1">
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

          <p className="text-sm text-muted-foreground text-center mb-6">
            {isRejected
              ? "Vous pouvez mettre à jour votre profil médecin et soumettre à nouveau pour vérification."
              : "En attendant, vous pouvez vous familiariser avec notre plateforme ou contacter notre équipe d'assistance si vous avez des questions urgentes."}
          </p>

          <div className="flex flex-col gap-3">
            {isRejected ? (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/doctor/update-profile">Mettre à jour le profil</Link>
                </Button>
                <Link
                  href="/doctor/still-in-verification"
                  className="text-sm text-primary font-medium text-center hover:underline"
                >
                  Actualiser la page
                </Link>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/list_doctors">Explorer les médecins</Link>
                </Button>
                <Link
                  href="/contact-support"
                  className="text-sm text-primary font-medium text-center hover:underline"
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
