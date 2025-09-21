"use client"

import { useReadAloudViewModel } from "@/presentation/view-models/useReadAloudViewModel";
import { useAuthGuard } from "@/presentation/hooks/useAuthGuard";
import { useAuth } from "@/presentation/hooks/useAuth";
import PracticeAllReadAloudCardContainer from "./practice-all-read-aloud-container";

export default function PracticeAllReadAloudPage() {
  // Proteger a página
  const { canAccess } = useAuthGuard();
  
  // Obter dados do usuário
  const { user } = useAuth();
  
  // Usar o ViewModel de read-aloud
  const {
    state,
    actions,
    currentCard,
    isLoading,
    error,
  } = useReadAloudViewModel();

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verificando autenticação...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando exercícios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          Erro ao carregar exercícios: {error.message}
        </div>
      </div>
    );
  }

  // Converter dados para o formato esperado pelo container
  const readAloudPhraseCard = currentCard ? [currentCard] : [];
  
  return <PracticeAllReadAloudCardContainer readAloudPhraseCard={readAloudPhraseCard} />;
}
