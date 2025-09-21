import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';
import { CardReadAloud } from '../../domain/entities/card-read-aloud.type';
import { PronunciationFeedback } from '../../domain/entities/pronunciation-feedback';

export interface ReadAloudSession {
  id: string;
  cardId: string;
  startTime: Date;
  endTime?: Date;
  attempts: number;
  bestScore?: number;
  isCompleted: boolean;
}

export interface ReadAloudViewModelState {
  currentCard: CardReadAloud | null;
  session: ReadAloudSession | null;
  isRecording: boolean;
  isAnalyzing: boolean;
  isLoading: boolean;
  error: Error | null;
  feedback: PronunciationFeedback | null;
  audioBlob: Blob | null;
  progress: number;
}

export const useReadAloudViewModel = (cardId?: string) => {
  const queryClient = useQueryClient();
  const container = DIContainer.getInstance();
  const cardUseCases = container.getCardUseCases();
  const cardRepository = container.getCardRepository();

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [session, setSession] = useState<ReadAloudSession | null>(null);

  // Query para obter card específico
  const {
    data: currentCard,
    isLoading: isLoadingCard,
    error: cardError,
  } = useQuery({
    queryKey: ['read-aloud', 'card', cardId],
    queryFn: async () => {
      if (!cardId) return null;
      return await cardUseCases.getCardById(cardId);
    },
    enabled: !!cardId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Query para obter sessão atual
  const {
    data: currentSession,
    isLoading: isLoadingSession,
  } = useQuery({
    queryKey: ['read-aloud', 'session', cardId],
    queryFn: async () => {
      if (!cardId) return null;
      // Implementar busca da sessão atual
      return null;
    },
    enabled: !!cardId,
  });

  // Mutation para análise de pronúncia
  const analyzePronunciationMutation = useMutation({
    mutationFn: async ({ audioBase64, expectedText }: { audioBase64: string; expectedText: string }) => {
      return await cardRepository.speechAnalysis({ audioBase64, expectedText });
    },
    onSuccess: (result) => {
      setFeedback(result);
      
      // Atualizar sessão com o resultado
      if (session) {
        const updatedSession: ReadAloudSession = {
          ...session,
          attempts: session.attempts + 1,
          bestScore: Math.max(session.bestScore || 0, result.overallScore || 0),
          isCompleted: (result.overallScore || 0) >= 80, // Considerar completo se score >= 80
        };
        setSession(updatedSession);
      }
    },
    onError: (error) => {
      console.error('Pronunciation analysis error:', error);
    },
  });

  // Mutation para salvar sessão
  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: ReadAloudSession) => {
      // Implementar salvamento da sessão
      return sessionData;
    },
    onSuccess: (savedSession) => {
      setSession(savedSession);
      queryClient.invalidateQueries({ queryKey: ['read-aloud', 'session'] });
    },
    onError: (error) => {
      console.error('Save session error:', error);
    },
  });

  // Actions do ViewModel
  const actions = {
    startRecording: () => {
      setIsRecording(true);
      setAudioBlob(null);
      setFeedback(null);
    },

    stopRecording: (blob: Blob) => {
      setIsRecording(false);
      setAudioBlob(blob);
    },

    analyzePronunciation: async (audioBlob: Blob, expectedText: string) => {
      if (!audioBlob || !expectedText) return;

      try {
        // Converter blob para base64
        const audioBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove data:audio/wav;base64, prefix
          };
          reader.readAsDataURL(audioBlob);
        });

        return await analyzePronunciationMutation.mutateAsync({ audioBase64, expectedText });
      } catch (error) {
        console.error('Error converting audio to base64:', error);
        throw error;
      }
    },

    startNewSession: (cardId: string) => {
      const newSession: ReadAloudSession = {
        id: Date.now().toString(),
        cardId,
        startTime: new Date(),
        attempts: 0,
        isCompleted: false,
      };
      setSession(newSession);
      return newSession;
    },

    completeSession: () => {
      if (session) {
        const completedSession: ReadAloudSession = {
          ...session,
          endTime: new Date(),
          isCompleted: true,
        };
        saveSessionMutation.mutate(completedSession);
      }
    },

    resetSession: () => {
      setSession(null);
      setFeedback(null);
      setAudioBlob(null);
      setIsRecording(false);
    },

    clearError: () => {
      analyzePronunciationMutation.reset();
      saveSessionMutation.reset();
    },
  };

  // Calcular progresso baseado no score
  const progress = feedback ? (feedback.overallScore || 0) : 0;

  // Estado do ViewModel
  const state: ReadAloudViewModelState = {
    currentCard,
    session: session || currentSession,
    isRecording,
    isAnalyzing: analyzePronunciationMutation.isPending,
    isLoading: isLoadingCard || isLoadingSession,
    error: cardError || analyzePronunciationMutation.error || saveSessionMutation.error,
    feedback,
    audioBlob,
    progress,
  };

  return {
    // Estado completo
    state,
    
    // Actions
    actions,
    
    // Getters individuais para conveniência
    currentCard,
    session: session || currentSession,
    isRecording,
    isAnalyzing: analyzePronunciationMutation.isPending,
    isLoading: isLoadingCard || isLoadingSession,
    error: cardError || analyzePronunciationMutation.error || saveSessionMutation.error,
    feedback,
    audioBlob,
    progress,
  };
};
