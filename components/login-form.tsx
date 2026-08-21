"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* Hallmark · Split Studio · design-system: design.md
 * The reassurance panel is the frame, so the form needs no card of its own. */

// Supabase returns English strings; the platform is French.
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Adresse e-mail ou mot de passe incorrect.";
  if (m.includes("email not confirmed"))
    return "Votre adresse e-mail n'a pas encore été confirmée. Vérifiez votre boîte de réception.";
  if (m.includes("too many requests"))
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  return "La connexion a échoué. Vérifiez vos identifiants et réessayez.";
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/role_selection");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? translateAuthError(error.message)
          : "Une erreur inattendue est survenue.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <header className="border-b border-border pb-5">
        <h1 className="font-display text-2xl font-medium tracking-display">
          Connexion
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Accédez à vos rendez-vous et à vos consultations.
        </p>
      </header>

      <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-5">
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
            aria-invalid={error ? true : undefined}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              href="/auth/forgot-password"
              className="rounded text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Oublié&nbsp;?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
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
          {isLoading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 border-t border-border-soft pt-5 text-sm text-muted-foreground">
        Pas encore de compte&nbsp;?{" "}
        <Link
          href="/auth/sign-up"
          className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
