"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { DoctorCard } from "@/components/admin/doctor-card";
import toast from "react-hot-toast";
import {
  activateDoctor,
  suspendDoctor,
  promoteDoctor,
  unpromoteDoctor,
} from "@/actions/admin";

type Doctor = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  description: string | null;
  experience: number | null;
  isActive: boolean | null;
  isFeatured: boolean | null;
};

interface DoctorsListProps {
  initialDoctors: Doctor[];
}

const ITEMS_PER_PAGE = 6;

export function DoctorsList({ initialDoctors }: DoctorsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const filteredDoctors = initialDoctors.filter((doctor) =>
    searchQuery === "" ||
    doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleActivate = async (doctorId: string) => {
    startTransition(async () => {
      const result = await activateDoctor(doctorId);
      if (result.success) {
        toast.success("Médecin activé avec succès");
      } else {
        toast.error(result.error || "Échec de l'activation");
      }
    });
  };

  const handleSuspend = async (doctorId: string) => {
    startTransition(async () => {
      const result = await suspendDoctor(doctorId);
      if (result.success) {
        toast.success("Médecin suspendu avec succès");
      } else {
        toast.error(result.error || "Échec de la suspension");
      }
    });
  };

  const handlePromote = async (doctorId: string) => {
    startTransition(async () => {
      const result = await promoteDoctor(doctorId);
      if (result.success) {
        toast.success("Médecin promu avec succès");
      } else {
        toast.error(result.error || "Échec de la promotion");
      }
    });
  };

  const handleUnpromote = async (doctorId: string) => {
    startTransition(async () => {
      const result = await unpromoteDoctor(doctorId);
      if (result.success) {
        toast.success("Promotion retirée avec succès");
      } else {
        toast.error(result.error || "Échec du retrait de promotion");
      }
    });
  };

  return (
    <section className="flex-1">
      <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/90 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="border-b border-emerald-100/80 p-6 dark:border-emerald-900/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Médecins vérifiés
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Consultez et administrez les praticiens déjà approuvés.
              </p>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher un médecin..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-11 rounded-full border-emerald-100 bg-slate-50 pl-9 dark:border-emerald-900/40 dark:bg-slate-900/80"
              />
            </div>
          </div>
        </div>

        <div className="min-h-[500px]">
          {filteredDoctors.length === 0 ? (
            <EmptyState
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="17" x2="22" y1="8" y2="8" />
                  <line x1="19.5" x2="19.5" y1="5.5" y2="10.5" />
                </svg>
              }
              title={searchQuery ? "Aucun résultat trouvé" : "Aucun médecin vérifié disponible"}
              description={
                searchQuery
                  ? "Essayez un autre nom ou une autre spécialité."
                  : "Les médecins vérifiés apparaîtront ici dès qu'ils seront approuvés."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-2">
              {paginatedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={{
                    id: doctor.id,
                    full_name: doctor.full_name || "",
                    specialty: doctor.specialty || "",
                    description: doctor.description || "",
                    experience: doctor.experience || undefined,
                    isActive: doctor.isActive ?? true,
                    isPromoted: doctor.isFeatured ?? false,
                  }}
                  onActivate={handleActivate}
                  onSuspend={handleSuspend}
                  onPromote={handlePromote}
                  onUnpromote={handleUnpromote}
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-emerald-100/80 p-4 text-sm text-slate-500 dark:border-emerald-900/40 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Affichage de {filteredDoctors.length === 0 ? 0 : startIndex + 1}-
            {Math.min(endIndex, filteredDoctors.length)} sur {filteredDoctors.length} résultats
          </span>
          <div className="flex items-center gap-2">
            <span>
              Page {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <span className="sr-only">Page précédente</span>
              &#8592;
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <span className="sr-only">Page suivante</span>
              &#8594;
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
