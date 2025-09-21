"use client";

import { useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { Badge } from "@/presentation/components/ui/badge";
import { useCards } from "@/presentation/hooks/useCards";
import { useAuth } from "@/presentation/hooks/useAuth";
import { CardReadAloud } from "@/domain/entities/card-read-aloud.type";

export default function CardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  
  const { user } = useAuth();
  const {
    cards,
    isLoading,
    error,
    createCard,
    updateCard,
    deleteCard,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
  } = useCards(selectedCategory || undefined, selectedDifficulty || undefined);

  const handleCreateCard = async () => {
    if (!user) return;
    
    try {
      await createCard({
        userId: user.id,
        category: "daily",
        englishText: "Hello, how are you?",
        translation: "Olá, como você está?",
        difficulty: "beginner",
      });
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleUpdateCard = async (cardId: string) => {
    try {
      await updateCard(cardId, {
        englishText: "Updated text",
        translation: "Texto atualizado",
      });
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "daily":
        return "bg-blue-500";
      case "business":
        return "bg-purple-500";
      case "travel":
        return "bg-orange-500";
      case "academic":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando cards...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Erro ao carregar cards: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Cards de Leitura</h1>
        
        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="business">Negócios</SelectItem>
              <SelectItem value="travel">Viagem</SelectItem>
              <SelectItem value="academic">Acadêmico</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as dificuldades</SelectItem>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleCreateCard} disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar Card"}
          </Button>
        </div>

        {/* Mensagens de erro */}
        {createError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Erro ao criar card: {createError.message}
          </div>
        )}
        {updateError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Erro ao atualizar card: {updateError.message}
          </div>
        )}
        {deleteError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Erro ao deletar card: {deleteError.message}
          </div>
        )}
      </div>

      {/* Lista de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.uuid} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{card.englishText}</CardTitle>
                  <CardDescription className="mt-2">{card.translation}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getCategoryColor(card.category)} text-white`}>
                    {card.category}
                  </Badge>
                  <Badge className={`${getDifficultyColor(card.difficulty)} text-white`}>
                    {card.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateCard(card.uuid)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Atualizando..." : "Editar"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteCard(card.uuid)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deletando..." : "Deletar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum card encontrado</p>
          <p className="text-gray-400">Tente ajustar os filtros ou criar um novo card</p>
        </div>
      )}
    </div>
  );
}
