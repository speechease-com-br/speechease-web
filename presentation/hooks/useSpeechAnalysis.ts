import { useMutation } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';
import { PronunciationFeedback } from '../../domain/entities/pronunciation-feedback';

export interface SpeechAnalysisRequest {
  audioBase64: string;
  expectedText: string;
}

export const useSpeechAnalysis = () => {
  const container = DIContainer.getInstance();
  const cardRepository = container.getCardRepository();

  // Mutation para análise de fala
  const speechAnalysisMutation = useMutation({
    mutationFn: async ({ audioBase64, expectedText }: SpeechAnalysisRequest) => {
      return await cardRepository.speechAnalysis({ audioBase64, expectedText });
    },
    onError: (error) => {
      console.error('Speech analysis error:', error);
    },
  });

  // Função de conveniência
  const analyzeSpeech = (audioBase64: string, expectedText: string) => {
    return speechAnalysisMutation.mutateAsync({ audioBase64, expectedText });
  };

  return {
    // Mutation
    analyzeSpeech,
    
    // Estado da mutation
    isAnalyzing: speechAnalysisMutation.isPending,
    
    // Dados e erro
    analysisResult: speechAnalysisMutation.data as PronunciationFeedback | undefined,
    error: speechAnalysisMutation.error,
    
    // Funções utilitárias
    reset: () => speechAnalysisMutation.reset(),
  };
};
