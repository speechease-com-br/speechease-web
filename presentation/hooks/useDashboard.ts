import { useQuery } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';

export const useDashboard = () => {
  const container = DIContainer.getInstance();
  const dashboardUseCases = container.getDashboardUseCases();

  // Query para obter dados do dashboard
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['dashboard', 'data'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      return await dashboardUseCases.getDashboardData(token || undefined);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });

  return {
    dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard,
  };
};

export const useUserProgress = () => {
  const container = DIContainer.getInstance();
  const dashboardUseCases = container.getDashboardUseCases();

  // Query para obter progresso do usuário
  const {
    data: progressData,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ['dashboard', 'progress'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token de acesso não encontrado');
      return await dashboardUseCases.getUserProgress(token);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: false,
  });

  return {
    progressData,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress,
  };
};

export const useUserStatistics = () => {
  const container = DIContainer.getInstance();
  const dashboardUseCases = container.getDashboardUseCases();

  // Query para obter estatísticas do usuário
  const {
    data: statisticsData,
    isLoading: isLoadingStatistics,
    error: statisticsError,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token de acesso não encontrado');
      return await dashboardUseCases.getStatistics(token);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: false,
  });

  return {
    statisticsData,
    isLoading: isLoadingStatistics,
    error: statisticsError,
    refetch: refetchStatistics,
  };
};
