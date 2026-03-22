"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { PendingDoctorCard } from "@/components/admin/pending-doctor-card";
import toast from "react-hot-toast";
import { approveDoctorVerification, rejectDoctorVerification } from "@/actions/admin";

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

const ITEMS_PER_PAGE = 6;

export function PendingDoctorsList({ initialDoctors }: PendingDoctorsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const filteredDoctors = initialDoctors.filter(
    (doctor) =>
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

  const handleApprove = async (doctorId: string) => {
    startTransition(async () => {
      const result = await approveDoctorVerification(doctorId);
      if (result.success) {
        toast.success("Médecin approuvé avec succès");
      } else {
        toast.error(result.error || "Échec de l'approbation");
      }
    });
  };

  const handleReject = async (doctorId: string) => {
    startTransition(async () => {
      const result = await rejectDoctorVerification(doctorId);
      if (result.success) {
        toast.success("Médecin rejeté");
      } else {
        toast.error(result.error || "Échec du rejet");
      }
    });
  };

  return (
    <section className="flex-1">
      <div className="card-clinical overflow-hidden">
        <div className="border-b border-border/60 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Vérifications en attente
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Examinez les demandes en cours avant validation.
                </p>
              </div>
              {initialDoctors.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
                  {initialDoctors.length}
                </span>
              )}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un médecin..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="min-h-[400px] p-6">
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              }
              title={searchQuery ? "Aucun résultat trouvé" : "Aucune demande en attente"}
              description={
                searchQuery
                  ? "Essayez une autre recherche."
                  : "Les nouvelles demandes de vérification apparaîtront ici."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {paginatedDoctors.map((doctor) => (
                <PendingDoctorCard
                  key={doctor.id}
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
              ))}
            </div>
          )}
        </div>

        {filteredDoctors.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border/60 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Affichage de {filteredDoctors.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredDoctors.length)} sur {filteredDoctors.length} résultats
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="iconSm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <span className="sr-only">Page précédente</span>
                &#8592;
              </Button>
              <span className="text-xs">
                Page {currentPage} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="iconSm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <span className="sr-only">Page suivante</span>
                &#8594;
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
