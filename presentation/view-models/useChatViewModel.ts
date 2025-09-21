import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DIContainer } from '../../infrastructure/di/Container';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
}

export interface ChatViewModelState {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: Error | null;
  currentMessage: string;
}

export const useChatViewModel = () => {
  const queryClient = useQueryClient();
  const container = DIContainer.getInstance();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Query para obter histórico de mensagens
  const {
    data: chatHistory = [],
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ['chat', 'history'],
    queryFn: async () => {
      // Implementar busca do histórico de chat
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para enviar mensagem
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // Simular envio de mensagem para o chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date(),
      };

      // Adicionar mensagem do usuário
      setMessages(prev => [...prev, userMessage]);

      // Simular resposta do assistente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Resposta para: "${message}"`,
        role: 'assistant',
        timestamp: new Date(),
      };

      return assistantMessage;
    },
    onSuccess: (assistantMessage) => {
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentMessage('');
    },
    onError: (error) => {
      console.error('Send message error:', error);
    },
  });

  // Mutation para análise de áudio
  const analyzeAudioMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      // Implementar análise de áudio
      return {
        transcript: 'Transcrição do áudio',
        feedback: 'Feedback de pronúncia',
      };
    },
    onSuccess: (result) => {
      const audioMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Áudio: ${result.transcript}`,
        role: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, audioMessage]);
    },
    onError: (error) => {
      console.error('Audio analysis error:', error);
    },
  });

  // Actions do ViewModel
  const actions = {
    sendMessage: (message: string) => {
      if (message.trim()) {
        return sendMessageMutation.mutateAsync(message);
      }
    },
    
    sendAudioMessage: (audioBlob: Blob) => {
      return analyzeAudioMutation.mutateAsync(audioBlob);
    },
    
    setCurrentMessage: (message: string) => {
      setCurrentMessage(message);
    },
    
    clearMessages: () => {
      setMessages([]);
    },
    
    resetErrors: () => {
      sendMessageMutation.reset();
      analyzeAudioMutation.reset();
    },
  };

  // Estado do ViewModel
  const state: ChatViewModelState = {
    messages,
    isLoading: isLoadingHistory,
    isSending: sendMessageMutation.isPending,
    error: historyError || sendMessageMutation.error || analyzeAudioMutation.error,
    currentMessage,
  };

  return {
    // Estado completo
    state,
    
    // Actions
    actions,
    
    // Getters individuais para conveniência
    messages,
    isLoading: isLoadingHistory,
    isSending: sendMessageMutation.isPending,
    isAnalyzingAudio: analyzeAudioMutation.isPending,
    error: historyError || sendMessageMutation.error || analyzeAudioMutation.error,
    currentMessage,
  };
};
