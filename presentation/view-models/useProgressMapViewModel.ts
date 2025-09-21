import { useQuery } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';

export interface ProgressData {
  totalCards: number;
  completedCards: number;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  streakDays: number;
  lastActivity: Date;
  weeklyProgress: {
    day: string;
    cardsCompleted: number;
    averageScore: number;
  }[];
  categoryProgress: {
    category: string;
    totalCards: number;
    completedCards: number;
    averageScore: number;
  }[];
  difficultyProgress: {
    difficulty: string;
    totalCards: number;
    completedCards: number;
    averageScore: number;
  }[];
}

export interface ProgressMapViewModelState {
  progressData: ProgressData | null;
  isLoading: boolean;
  error: Error | null;
  selectedTimeRange: 'week' | 'month' | 'year';
  selectedCategory: string | null;
  selectedDifficulty: string | null;
}

export const useProgressMapViewModel = () => {
  const container = DIContainer.getInstance();
  const dashboardUseCases = container.getDashboardUseCases();

  // Query para obter dados de progresso
  const {
    data: progressData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['progress-map', 'data'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token de acesso não encontrado');
      
      // Simular dados de progresso (implementar busca real)
      const mockData: ProgressData = {
        totalCards: 150,
        completedCards: 45,
        totalSessions: 30,
        completedSessions: 25,
        averageScore: 78.5,
        streakDays: 7,
        lastActivity: new Date(),
        weeklyProgress: [
          { day: 'Seg', cardsCompleted: 5, averageScore: 75 },
          { day: 'Ter', cardsCompleted: 8, averageScore: 82 },
          { day: 'Qua', cardsCompleted: 6, averageScore: 79 },
          { day: 'Qui', cardsCompleted: 7, averageScore: 85 },
          { day: 'Sex', cardsCompleted: 4, averageScore: 72 },
          { day: 'Sáb', cardsCompleted: 3, averageScore: 78 },
          { day: 'Dom', cardsCompleted: 2, averageScore: 80 },
        ],
        categoryProgress: [
          { category: 'daily', totalCards: 50, completedCards: 20, averageScore: 80 },
          { category: 'business', totalCards: 40, completedCards: 15, averageScore: 75 },
          { category: 'travel', totalCards: 35, completedCards: 8, averageScore: 70 },
          { category: 'academic', totalCards: 25, completedCards: 2, averageScore: 65 },
        ],
        difficultyProgress: [
          { difficulty: 'beginner', totalCards: 60, completedCards: 30, averageScore: 85 },
          { difficulty: 'intermediate', totalCards: 50, completedCards: 12, averageScore: 75 },
          { difficulty: 'advanced', totalCards: 40, completedCards: 3, averageScore: 65 },
        ],
      };
      
      return mockData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });

  // Estado do ViewModel
  const state: ProgressMapViewModelState = {
    progressData: progressData || null,
    isLoading,
    error,
    selectedTimeRange: 'week',
    selectedCategory: null,
    selectedDifficulty: null,
  };

  // Actions do ViewModel
  const actions = {
    refetchData: () => {
      return refetch();
    },
    
    setTimeRange: (timeRange: 'week' | 'month' | 'year') => {
      // Implementar filtro por período
    },
    
    setCategory: (category: string | null) => {
      // Implementar filtro por categoria
    },
    
    setDifficulty: (difficulty: string | null) => {
      // Implementar filtro por dificuldade
    },
  };

  return {
    // Estado completo
    state,
    
    // Actions
    actions,
    
    // Getters individuais para conveniência
    progressData,
    isLoading,
    error,
    refetch,
  };
};
