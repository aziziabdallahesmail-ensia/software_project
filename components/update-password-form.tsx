"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* Hallmark · Split Studio · design-system: design.md */

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/role_selection");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? "La mise à jour a échoué. Le lien a peut-être expiré."
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
          Nouveau mot de passe
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choisissez un mot de passe d&apos;au moins 6 caractères.
        </p>
      </header>

      <form onSubmit={handleForgotPassword} className="mt-6 flex flex-col gap-5">
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? "Enregistrement…" : "Enregistrer le mot de passe"}
        </Button>
      </form>
    </div>
  );
}
