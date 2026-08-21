import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Choisir votre profil",
  description:
    "Indiquez si vous utilisez MédiConnect en tant que patient ou en tant que professionnel de santé.",
};

/* Hallmark · entry surface · design-system: design.md
 * Left-aligned masthead over a hairline, matching the auth pages. The page
 * below owns the choice; this shell owns the framing and the redirects. */

export default async function RoleSelectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect users who have already completed this step
  if (user) {
    if (user.role === "patient") {
      redirect("/list_doctors");
    } else if (user.role === "doctor") {
      // check verification status
      if (user.verificationStatus === "verified") {
        redirect("/doctor");
      } else {
        redirect("/doctor/still-in-verification");
      }
    } else if (user.role === "admin") {
      redirect("/admin");
    }
  }

  return (
    <div data-density="comfortable" className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[52rem] px-4 py-10 lg:px-6 lg:py-14">
        <header className="page-header">
          <p className="label-meta">Première étape</p>
          <h1 className="mt-2 font-display text-[length:var(--text-display)] font-medium leading-[1.1] tracking-display">
            Êtes-vous patient ou praticien&nbsp;?
          </h1>
          <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
            Votre choix détermine l&apos;espace auquel vous accédez. Les
            praticiens complètent un court dossier avant vérification.
          </p>
        </header>

        {children}
      </div>
    </div>
  );
}
