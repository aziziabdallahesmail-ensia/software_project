"use client";

import { useState, useTransition } from "react";
import { Search, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { PendingDoctorCard } from "@/components/admin/pending-doctor-card";
import toast from "react-hot-toast";
import {
  approveDoctorVerification,
  rejectDoctorVerification,
} from "@/actions/admin";

/* Hallmark · macrostructure: Index-First · design-system: design.md */

type PendingDoctor = {
  id: string;
  full_name: string | null;
  specialty: string | null;
  description: string | null;
  experience: number | null;
  credentialUrl: string | null;
};

interface PendingDoctorsListProps {
  initialDoctors: PendingDoctor[];
}

const ITEMS_PER_PAGE = 8;

export function PendingDoctorsList({
  initialDoctors,
}: PendingDoctorsListProps) {
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

  const handleApprove = async (doctorId: string) => {
    startTransition(async () => {
      const result = await approveDoctorVerification(doctorId);
      if (result.success) {
        toast.success("Praticien approuvé.");
      } else {
        toast.error(result.error || "Échec de l'approbation.");
      }
    });
  };

  const handleReject = async (doctorId: string) => {
    startTransition(async () => {
      const result = await rejectDoctorVerification(doctorId);
      if (result.success) {
        toast.success("Dossier refusé.");
      } else {
        toast.error(result.error || "Échec du refus.");
      }
    });
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="tabular text-foreground">
            {filteredDoctors.length}
          </span>{" "}
          {filteredDoctors.length > 1 ? "dossiers" : "dossier"}
          {searchQuery && " correspondants"}
        </p>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Nom ou spécialité"
            aria-label="Rechercher un dossier"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="h-5 w-5" />}
          title={searchQuery ? "Aucun résultat" : "Aucun dossier en attente"}
          description={
            searchQuery
              ? "Essayez un autre nom ou une autre spécialité."
              : "Les nouvelles demandes de vérification apparaîtront ici."
          }
        />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {paginatedDoctors.map((doctor) => (
              <li key={doctor.id}>
                <PendingDoctorCard
                  doctor={{
                    id: doctor.id,
                    full_name: doctor.full_name || "",
                    specialty: doctor.specialty || "",
                    description: doctor.description || "",
                    experience: doctor.experience || undefined,
                    credentialUrl: doctor.credentialUrl || undefined,
                  }}
                  onApprove={handleApprove}
                  onReject={handleReject}
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
