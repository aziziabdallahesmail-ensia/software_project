import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/* Hallmark · Split Studio · design-system: design.md */

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-col">
      <header className="border-b border-border pb-5">
        <span className="icon-container icon-container-md mb-4 border-destructive/25 bg-destructive-soft text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-medium tracking-display">
          Une erreur est survenue
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Le lien est peut-être expiré ou déjà utilisé.
        </p>
      </header>

      {params?.error && (
        <div className="mt-6 rounded-[var(--radius-control)] border border-border-soft bg-muted/40 px-3 py-2.5">
          <p className="label-meta">Code d&apos;erreur</p>
          <p className="tabular mt-1 break-words text-sm text-foreground">
            {params.error}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border-soft pt-5">
        <Link
          href="/auth/login"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-base ease-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Retour à la connexion
        </Link>
        <Link
          href="/auth/forgot-password"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] border border-border px-4 text-sm font-medium transition-colors duration-base ease-out hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Renvoyer un lien
        </Link>
      </div>
    </div>
  );
}
