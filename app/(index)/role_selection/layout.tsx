import { getCurrentUser } from "@/actions/set_user_role";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata = {
  title: "",
  description: "",
};

export default async function roleselectionlayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Redirect users who have already completed this step
  if (user) {
    if (user.role === "patient") {
      redirect("/doctors");
    } else if (user.role === "doctor") {
      // check verification status
      if (user.verificationStatus === "verified") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "admin") {
      redirect("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Êtes-vous médecin ou patient ?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Sélectionnez votre rôle pour accéder à votre espace personnalisé
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}