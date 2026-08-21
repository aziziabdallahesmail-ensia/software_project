"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* Hallmark · Split Studio · design-system: design.md
 * Success is silent and inline — it replaces the form, no toast. */

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // This URL must be listed in the Supabase dashboard redirect URLs.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? "L'envoi a échoué. Vérifiez l'adresse saisie et réessayez."
          : "Une erreur inattendue est survenue.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col", className)} {...props}>
        <header className="border-b border-border pb-5">
          <span className="icon-container icon-container-md mb-4 border-success/25 bg-success-soft text-success">
            <MailCheck className="h-5 w-5" />
          </span>
          <h1 className="font-display text-2xl font-medium tracking-display">
            Vérifiez votre boîte de réception
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Si un compte est associé à cette adresse, vous recevrez un lien de
            réinitialisation dans quelques instants.
          </p>
        </header>

        <p className="mt-6 text-sm text-muted-foreground">
          Pensez à regarder vos courriers indésirables.
        </p>

        <Link
          href="/auth/login"
          className="mt-6 rounded text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <header className="border-b border-border pb-5">
        <h1 className="font-display text-2xl font-medium tracking-display">
          Mot de passe oublié
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Indiquez votre adresse e-mail et nous vous enverrons un lien de
          réinitialisation.
        </p>
      </header>

      <form onSubmit={handleForgotPassword} className="mt-6 flex flex-col gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-[var(--radius-control)] border border-destructive/25 bg-destructive-soft px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Envoi…" : "Envoyer le lien"}
        </Button>
      </form>

      <p className="mt-6 border-t border-border-soft pt-5 text-sm text-muted-foreground">
        Vous vous souvenez de votre mot de passe&nbsp;?{" "}
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
