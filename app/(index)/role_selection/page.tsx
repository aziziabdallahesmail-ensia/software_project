"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription,CardTitle,} from "@/components/ui/card";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { User, Stethoscope, Loader2, ArrowRight } from "lucide-react";
import { setUserRole } from "@/actions/set_user_role";
import { docformschema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";

export default function roleselectionpage() {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();

  // hook to handle form submission
  const { loading, data, execute: submitUserRole } = useFetch(setUserRole);

  // react hook form setup and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(docformschema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  // listen to specialty field changes
  const specialtyValue = watch("specialty");

  // Handle patient role selection
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
  }, [data]);

  const ondocsubmit = async (data: any) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "doctor");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  // Role selection screen
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card
          className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 rounded-xl"
          onClick={() => !loading && handlePatientSelection()}
        >
          <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-800/40 rounded-full mb-5">
              <User className="h-7 w-7 text-blue-600 dark:text-blue-300" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Rejoindre en tant que Patient
            </CardTitle>
            <CardDescription className="mb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Prenez rendez-vous, consultez des médecins et gérez votre parcours de santé en toute simplicité.
            </CardDescription>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-11 font-medium shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  Continuer en tant que Patient
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 rounded-xl"
          onClick={() => !loading && setStep("doctor-form")}
        >
          <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-800/40 rounded-xl mb-5">
              <Stethoscope className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Rejoindre en tant que Médecin
            </CardTitle>
            <CardDescription className="mb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Créez votre profil professionnel, définissez vos disponibilités et proposez des consultations.
            </CardDescription>
            <Button
              variant="outline"
              className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/30 rounded-full h-11 font-medium"
              disabled={loading}
            >
              Continuer en tant que Médecin
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Doctor form
  if (step === "doctor-form") {
    return (
      <Card className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md rounded-xl">
        <CardContent className="pt-8 pb-8 px-6">
          <div className="mb-8">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Complétez votre profil médecin
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Veuillez fournir vos informations professionnelles pour vérification
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit(ondocsubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialty">Spécialité médicale</Label>
              <Select
                value={specialtyValue}
                onValueChange={(value) => setValue("specialty", value)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Sélectionnez votre spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => {
                    const IconComponent = spec.icon;
                    return (
                      <SelectItem
                        key={spec.name}
                        value={spec.name}
                        className="flex items-center gap-2"
                      >
                        <span className="text-emerald-400">
                          <IconComponent className="h-4 w-4" />
                        </span>
                        {spec.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.specialty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Années d'expérience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="ex. 5"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Lien vers le document de certification</Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://universite.edu/mon-diplome-medical.pdf"
                {...register("credentialUrl")}
              />
              {errors.credentialUrl && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.credentialUrl.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Veuillez fournir un lien vers votre diplôme de médecine ou certification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description de vos services</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre expertise, vos services et votre approche des soins aux patients..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-6"
                disabled={loading}
              >
                Retour
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Soumettre pour vérification"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}