"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Stethoscope, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { setUserRole } from "@/actions/set_user_role";
import { docformschema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import type { z } from "zod";

/* Hallmark · entry surface · design-system: design.md
 * The role choices are real <button> elements, so they are keyboard-reachable.
 * The previous version used div[onClick] wrapping a nested <Button>, which was
 * unreachable by keyboard and double-fired on click. */

type DoctorFormValues = z.infer<typeof docformschema>;

export default function RoleSelectionPage() {
  const [step, setStep] = useState<"choose-role" | "doctor-form">(
    "choose-role",
  );
  const router = useRouter();

  const { loading, data, execute: submitUserRole } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(docformschema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  const specialtyValue = watch("specialty");

  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "patient");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      router.push(data.redirect);
    }
  }, [data, router]);

  const ondocsubmit = async (values: DoctorFormValues) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "doctor");
    formData.append("specialty", values.specialty);
    formData.append("experience", values.experience.toString());
    formData.append("credentialUrl", values.credentialUrl);
    formData.append("description", values.description);

    await submitUserRole(formData);
  };

  if (step === "choose-role") {
    const choices = [
      {
        id: "patient",
        icon: User,
        title: "Patient",
        description:
          "Prenez rendez-vous, rejoignez vos consultations vidéo et suivez votre parcours de soin.",
        cta: "Continuer comme patient",
        onSelect: handlePatientSelection,
        note: "Accès immédiat",
      },
      {
        id: "doctor",
        icon: Stethoscope,
        title: "Professionnel de santé",
        description:
          "Publiez vos disponibilités, gérez vos rendez-vous et consultez à distance.",
        cta: "Continuer comme praticien",
        onSelect: () => setStep("doctor-form"),
        note: "Dossier à compléter",
      },
    ];

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {choices.map(({ id, icon: Icon, title, description, cta, onSelect, note }) => (
          <button
            key={id}
            type="button"
            onClick={() => !loading && onSelect()}
            disabled={loading}
            className="surface-interactive group flex flex-col items-start p-5 text-left disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="icon-container icon-container-md transition-colors duration-base ease-out group-hover:border-primary/30 group-hover:bg-primary-soft group-hover:text-primary">
              <Icon className="h-4 w-4" />
            </span>

            <span className="mt-4 font-display text-lg font-medium tracking-display">
              {title}
            </span>
            <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </span>

            <span className="mt-5 flex w-full items-center justify-between gap-3 border-t border-border-soft pt-4">
              <span className="label-meta">{note}</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary">
                {loading && id === "patient" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Traitement…
                  </>
                ) : (
                  <>
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="surface p-5 lg:p-6">
      <div className="border-b border-border pb-4">
        <h2 className="font-display text-lg font-medium tracking-display">
          Votre dossier professionnel
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations sont examinées par notre équipe avant la publication
          de votre profil.
        </p>
      </div>

      <form onSubmit={handleSubmit(ondocsubmit)} className="flex flex-col gap-5 pt-5">
        <div className="grid gap-2">
          <Label htmlFor="specialty">Spécialité</Label>
          <Select
            value={specialtyValue}
            onValueChange={(value) => setValue("specialty", value)}
          >
            <SelectTrigger id="specialty" aria-invalid={errors.specialty ? true : undefined}>
              <SelectValue placeholder="Sélectionnez une spécialité" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((spec) => {
                const IconComponent = spec.icon;
                return (
                  <SelectItem key={spec.name} value={spec.name}>
                    <span className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      {spec.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.specialty && (
            <p role="alert" className="text-xs text-destructive">
              {errors.specialty.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="experience">Années d&apos;expérience</Label>
          <Input
            id="experience"
            type="number"
            min={0}
            className="tabular"
            placeholder="5"
            aria-invalid={errors.experience ? true : undefined}
            {...register("experience", { valueAsNumber: true })}
          />
          {errors.experience && (
            <p role="alert" className="text-xs text-destructive">
              {errors.experience.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="credentialUrl">Lien vers votre justificatif</Label>
          <Input
            id="credentialUrl"
            type="url"
            placeholder="https://universite.edu/diplome.pdf"
            aria-invalid={errors.credentialUrl ? true : undefined}
            {...register("credentialUrl")}
          />
          <p className="text-xs text-muted-foreground">
            Diplôme ou certification, accessible en lecture par notre équipe.
          </p>
          {errors.credentialUrl && (
            <p role="alert" className="text-xs text-destructive">
              {errors.credentialUrl.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Présentation de votre pratique</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Décrivez votre expertise, vos services et votre approche des soins."
            aria-invalid={errors.description ? true : undefined}
            {...register("description")}
          />
          {errors.description && (
            <p role="alert" className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border-soft pt-5 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("choose-role")}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Envoi…" : "Soumettre pour vérification"}
          </Button>
        </div>
      </form>
    </section>
  );
}
