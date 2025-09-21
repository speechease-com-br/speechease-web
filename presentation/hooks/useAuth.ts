import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';
import { LoginRequest, SignupRequest } from '../../domain/use-cases/AuthUseCases';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const container = DIContainer.getInstance();
  const authUseCases = container.getAuthUseCases();

  // Query para obter dados do usuário atual
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      try {
        const userData = await authUseCases.getCurrentUser(token);
        return userData;
      } catch (error) {
        // Se o token for inválido, remove do localStorage
        localStorage.removeItem('accessToken');
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const result = await authUseCases.login(credentials);
      localStorage.setItem('accessToken', result.accessToken);
      return result;
    },
    onSuccess: (data) => {
      // Invalidar e refetch da query do usuário
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Mutation para signup
  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupRequest) => {
      const result = await authUseCases.signup(credentials);
      localStorage.setItem('accessToken', result.accessToken);
      return result;
    },
    onSuccess: (data) => {
      // Invalidar e refetch da query do usuário
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error) => {
      console.error('Signup error:', error);
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authUseCases.logout();
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear(); // Limpar todo o cache
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Mesmo com erro, limpar o estado local
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(['auth', 'user'], null);
    },
  });

  // Funções de conveniência
  const login = (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const signup = (email: string, password: string, name: string) => {
    return signupMutation.mutateAsync({ email, password, name });
  };

  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  return {
    // Estado
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser,
    
    // Mutations
    login,
    signup,
    logout,
    
    // Estados das mutations
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    // Erros
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    
    // Reset errors
    resetLoginError: () => loginMutation.reset(),
    resetSignupError: () => signupMutation.reset(),
    resetLogoutError: () => logoutMutation.reset(),
  };
};
