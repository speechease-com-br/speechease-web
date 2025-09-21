// Domain exports
export * from '../domain/entities/card-read-aloud.type';
export * from '../domain/entities/pronunciation-feedback';
export * from '../domain/repositories/IAuthRepository';
export * from '../domain/repositories/ICardRepository';
export * from '../domain/repositories/IDashboardRepository';
export * from '../domain/use-cases/AuthUseCases';
export * from '../domain/use-cases/CardUseCases';
export * from '../domain/use-cases/DashboardUseCases';

// Infrastructure exports
export * from '../infrastructure/repositories/auth-infra';
export * from '../infrastructure/repositories/cards-infra';
export * from '../infrastructure/repositories/dashboard-infra';
export * from '../infrastructure/http/httpClient';
export * from '../infrastructure/http/types';
export * from '../infrastructure/di/Container';

// Presentation exports
export { useAuthViewModel, type AuthUser, type AuthViewModelState } from '../presentation/view-models/useAuthViewModel';
export { useCardViewModel, type CardViewModelState } from '../presentation/view-models/useCardViewModel';
export { useChatViewModel, type ChatMessage, type ChatViewModelState } from '../presentation/view-models/useChatViewModel';
export { useReadAloudViewModel, type ReadAloudSession, type ReadAloudViewModelState } from '../presentation/view-models/useReadAloudViewModel';
export { useProgressMapViewModel, type ProgressData, type ProgressMapViewModelState } from '../presentation/view-models/useProgressMapViewModel';
export { useAuth } from '../presentation/hooks/useAuth';
export { useCards, useCard } from '../presentation/hooks/useCards';
export { useDashboard, useUserProgress, useUserStatistics } from '../presentation/hooks/useDashboard';
export { useSpeechAnalysis, type SpeechAnalysisRequest } from '../presentation/hooks/useSpeechAnalysis';
export { useAuthGuard, useGuestGuard } from '../presentation/hooks/useAuthGuard';
export { QueryProvider } from '../presentation/providers/QueryProvider';
export { AppProviders } from '../presentation/providers/AppProviders';

// Shared exports
export * from '../shared/utils/utils';
export * from '../shared/constants/requests';
