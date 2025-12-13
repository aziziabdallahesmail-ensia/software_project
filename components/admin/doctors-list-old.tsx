"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { DoctorCard } from "@/components/admin/doctor-card";

// Mock data - TODO: Replace with actual data fetching from getActiveDoctors()
const MOCK_DOCTORS = [
  {
    id: "1",
    full_name: "Sarah Martin",
    specialty: "Cardiologue",
    description: "Spécialiste en cardiologie avec plus de 15 ans d'expérience dans le traitement des maladies cardiovasculaires. Passionnée par les nouvelles technologies médicales.",
    experience: 15,
    isActive: true,
    isPromoted: false,
  },
  {
    id: "2",
    full_name: "Jean Dupont",
    specialty: "Dermatologue",
    description: "Expert en dermatologie esthétique et médicale. Traitement des affections cutanées et consultation en médecine anti-âge.",
    experience: 10,
    isActive: true,
    isPromoted: true,
  },
  {
    id: "3",
    full_name: "Marie Lefebvre",
    specialty: "Pédiatre",
    description: "Médecin pédiatre dévoué au bien-être des enfants. Suivi médical complet de la naissance à l'adolescence.",
    experience: 12,
    isActive: false,
    isPromoted: false,
  },
  {
    id: "4",
    full_name: "Ahmed Benali",
    specialty: "Neurologue",
    description: "Spécialiste des troubles neurologiques et des maladies du système nerveux. Approche holistique du patient.",
    experience: 18,
    isActive: true,
    isPromoted: false,
  },
  {
    id: "5",
    full_name: "Claire Dubois",
    specialty: "Ophtalmologue",
    description: "Experte en chirurgie réfractive et traitement des maladies oculaires. Consultation pour tous types de problèmes de vision.",
    experience: 14,
    isActive: true,
    isPromoted: true,
  },
  {
    id: "6",
    full_name: "Marc Rousseau",
    specialty: "Psychiatre",
    description: "Accompagnement psychologique et traitement des troubles mentaux. Approche bienveillante et personnalisée.",
    experience: 20,
    isActive: true,
    isPromoted: false,
  },
  {
    id: "7",
    full_name: "Fatima El Amrani",
    specialty: "Gynécologue",
    description: "Suivi gynécologique complet, grossesse et santé reproductive. Consultations et dépistages préventifs.",
    experience: 16,
    isActive: true,
    isPromoted: false,
  },
  {
    id: "8",
    full_name: "Thomas Bernard",
    specialty: "Orthopédiste",
    description: "Traitement des troubles musculo-squelettiques et traumatismes sportifs. Chirurgie et rééducation.",
    experience: 11,
    isActive: false,
    isPromoted: false,
  },
  {
    id: "9",
    full_name: "Sophie Lambert",
    specialty: "Endocrinologue",
    description: "Spécialiste des troubles hormonaux et métaboliques. Diabète, thyroïde et problèmes de croissance.",
    experience: 13,
    isActive: true,
    isPromoted: false,
  },
  {
    id: "10",
    full_name: "Pierre Moreau",
    specialty: "Radiologue",
    description: "Expert en imagerie médicale et diagnostic radiologique. IRM, scanner et échographie de pointe.",
    experience: 19,
    isActive: true,
    isPromoted: true,
  },
];

const ITEMS_PER_PAGE = 6;

export function DoctorsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter doctors based on search query
  const filteredDoctors = MOCK_DOCTORS.filter((doctor) =>
    searchQuery === "" ||
    doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
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
                <DoctorCard key={doctor.id} doctor={doctor} />
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
              Page {currentPage} / {totalPages}
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
              disabled={currentPage === totalPages}
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
