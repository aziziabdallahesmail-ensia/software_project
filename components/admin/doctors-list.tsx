"use client";

import { useState, useTransition } from "react";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
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

/* Hallmark · macrostructure: Index-First · design-system: design.md */

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

const ITEMS_PER_PAGE = 8;

export function DoctorsList({ initialDoctors }: DoctorsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const filteredDoctors = initialDoctors.filter(
    (doctor) =>
      searchQuery === "" ||
      doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const run = (
    action: (id: string) => Promise<{ success?: boolean; error?: string }>,
    okMessage: string,
    failMessage: string,
  ) => {
    return async (doctorId: string) => {
      startTransition(async () => {
        const result = await action(doctorId);
        if (result.success) {
          toast.success(okMessage);
        } else {
          toast.error(result.error || failMessage);
        }
      });
    };
  };

  const handleActivate = run(
    activateDoctor,
    "Praticien réactivé.",
    "Échec de l'activation.",
  );
  const handleSuspend = run(
    suspendDoctor,
    "Praticien suspendu.",
    "Échec de la suspension.",
  );
  const handlePromote = run(
    promoteDoctor,
    "Praticien mis en avant.",
    "Échec de la mise en avant.",
  );
  const handleUnpromote = run(
    unpromoteDoctor,
    "Mise en avant retirée.",
    "Échec du retrait.",
  );

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="tabular text-foreground">
            {filteredDoctors.length}
          </span>{" "}
          {filteredDoctors.length > 1 ? "praticiens" : "praticien"}
          {searchQuery && " correspondants"}
        </p>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Nom ou spécialité"
            aria-label="Rechercher un praticien"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title={
            searchQuery ? "Aucun résultat" : "Aucun praticien vérifié"
          }
          description={
            searchQuery
              ? "Essayez un autre nom ou une autre spécialité."
              : "Les praticiens apparaîtront ici une fois leur dossier approuvé."
          }
        />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {paginatedDoctors.map((doctor) => (
              <li key={doctor.id}>
                <DoctorCard
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
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4"
            >
              <p className="tabular text-xs text-muted-foreground">
                {startIndex + 1}–{Math.min(endIndex, filteredDoctors.length)} /{" "}
                {filteredDoctors.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="iconSm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Page précédente</span>
                </Button>
                <span className="tabular text-xs text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="iconSm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Page suivante</span>
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
