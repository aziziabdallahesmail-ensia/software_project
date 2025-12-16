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
  
  // Filter doctors based on search query
  const filteredDoctors = initialDoctors.filter((doctor) =>
    searchQuery === "" ||
    doctor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
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
      <div className="bg-card rounded-xl border shadow-sm min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">Vérifications en attente</h2>
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold rounded-full">
                {initialDoctors.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Examinez et approuvez les demandes de vérification des médecins.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un médecin..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 bg-background focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
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
                  ? "Essayez de modifier votre recherche ou vérifiez l'orthographe."
                  : "Il n'y a actuellement aucune demande de vérification en attente."
              }
            />
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        {/* Footer */}
        <div className="p-4 border-t bg-card rounded-b-xl flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Affichage de {startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)} sur {filteredDoctors.length} résultats
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
              Page {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
