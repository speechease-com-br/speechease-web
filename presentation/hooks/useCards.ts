import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';
import { CardReadAloud } from '../../domain/entities/card-read-aloud.type';
import { GetCardsRequest, CreateCardRequest } from '../../domain/use-cases/CardUseCases';

export const useCards = (category?: string, difficulty?: string) => {
  const queryClient = useQueryClient();
  const container = DIContainer.getInstance();
  const cardUseCases = container.getCardUseCases();

  // Query para obter lista de cards
  const {
    data: cards = [],
    isLoading: isLoadingCards,
    error: cardsError,
    refetch: refetchCards,
  } = useQuery({
    queryKey: ['cards', category, difficulty],
    queryFn: async () => {
      return await cardUseCases.getCards({ category, difficulty });
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Mutation para criar card
  const createCardMutation = useMutation({
    mutationFn: async (cardData: CreateCardRequest) => {
      return await cardUseCases.createCard(cardData);
    },
    onSuccess: (newCard) => {
      // Adicionar o novo card à lista existente
      queryClient.setQueryData(['cards', category, difficulty], (oldCards: CardReadAloud[] = []) => [
        ...oldCards,
        newCard,
      ]);
      
      // Invalidar todas as queries de cards para garantir consistência
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
    onError: (error) => {
      console.error('Create card error:', error);
    },
  });

  // Mutation para atualizar card
  const updateCardMutation = useMutation({
    mutationFn: async ({ id, cardData }: { id: string; cardData: Partial<CardReadAloud> }) => {
      return await cardUseCases.updateCard(id, cardData);
    },
    onSuccess: (updatedCard) => {
      // Atualizar o card na lista
      queryClient.setQueryData(['cards', category, difficulty], (oldCards: CardReadAloud[] = []) =>
        oldCards.map(card => card.uuid === updatedCard.uuid ? updatedCard : card)
      );
      
      // Invalidar todas as queries de cards
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
    onError: (error) => {
      console.error('Update card error:', error);
    },
  });

  // Mutation para deletar card
  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      await cardUseCases.deleteCard(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remover o card da lista
      queryClient.setQueryData(['cards', category, difficulty], (oldCards: CardReadAloud[] = []) =>
        oldCards.filter(card => card.uuid !== deletedId)
      );
      
      // Invalidar todas as queries de cards
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
    onError: (error) => {
      console.error('Delete card error:', error);
    },
  });

  // Funções de conveniência
  const createCard = (cardData: CreateCardRequest) => {
    return createCardMutation.mutateAsync(cardData);
  };

  const updateCard = (id: string, cardData: Partial<CardReadAloud>) => {
    return updateCardMutation.mutateAsync({ id, cardData });
  };

  const deleteCard = (id: string) => {
    return deleteCardMutation.mutateAsync(id);
  };

  return {
    // Estado
    cards,
    isLoading: isLoadingCards,
    error: cardsError,
    
    // Mutations
    createCard,
    updateCard,
    deleteCard,
    
    // Estados das mutations
    isCreating: createCardMutation.isPending,
    isUpdating: updateCardMutation.isPending,
    isDeleting: deleteCardMutation.isPending,
    
    // Erros das mutations
    createError: createCardMutation.error,
    updateError: updateCardMutation.error,
    deleteError: deleteCardMutation.error,
    
    // Funções utilitárias
    refetchCards,
    resetCreateError: () => createCardMutation.reset(),
    resetUpdateError: () => updateCardMutation.reset(),
    resetDeleteError: () => deleteCardMutation.reset(),
  };
};

export const useCard = (id: string) => {
  const queryClient = useQueryClient();
  const container = DIContainer.getInstance();
  const cardUseCases = container.getCardUseCases();

  // Query para obter um card específico
  const {
    data: card,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['card', id],
    queryFn: async () => {
      if (!id) return null;
      return await cardUseCases.getCardById(id);
    },
    enabled: !!id, // Só executa se id existir
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    card,
    isLoading,
    error,
    refetch,
  };
};
