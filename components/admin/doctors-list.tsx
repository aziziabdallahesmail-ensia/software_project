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
  unpromoteDoctor 
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
      <div className="bg-card rounded-xl border shadow-sm min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Gérer les Médecins</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Consultez et gérez tous les médecins vérifiés.
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="17" x2="22" y1="8" y2="8" />
                  <line x1="19.5" x2="19.5" y1="5.5" y2="10.5" />
                </svg>
              }
              title={searchQuery ? "Aucun résultat trouvé" : "Aucun médecin vérifié disponible"}
              description={
                searchQuery
                  ? "Essayez de modifier votre recherche ou vérifiez l'orthographe."
                  : "Il n'y a actuellement aucun médecin dans la liste vérifiée. Vérifiez les demandes en attente."
              }
            />
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
