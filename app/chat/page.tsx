"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/presentation/components/ui/button"
import { Card } from "@/presentation/components/ui/card"
import { Input } from "@/presentation/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar"
import { Badge } from "@/presentation/components/ui/badge"
import { Tabs } from "@/presentation/components/ui/tabs"
import { useTheme } from "next-themes"
import { useChatViewModel } from "@/presentation/view-models/useChatViewModel"
import { useAuthGuard } from "@/presentation/hooks/useAuthGuard"

// Hero Icons imports
import {
  PaperAirplaneIcon as SendIcon,
  MicrophoneIcon as MicIcon,
  SpeakerWaveIcon as VolumeIcon,
  HandThumbUpIcon as ThumbsUpIcon,
  HandThumbDownIcon as ThumbsDownIcon,
} from "@heroicons/react/24/outline"

export default function ChatPage() {
  // Proteger a página
  const { canAccess } = useAuthGuard();
  
  // Usar o ViewModel de chat
  const {
    state,
    actions,
    messages,
    isLoading,
    isSending,
    isAnalyzingAudio,
    error,
    currentMessage,
  } = useChatViewModel();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    actions.sendMessage(currentMessage);
  };

  const startRecording = () => {
    // Simular gravação de áudio
    setTimeout(() => {
      const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
      actions.sendAudioMessage(mockAudioBlob);
    }, 3000);
  };

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
        <div className="text-lg">Carregando chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          Erro ao carregar chat: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Chat with GUGA
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                AI Tutor
              </Badge>
            </h1>
            <p className="text-muted-foreground">Your personal AI English tutor</p>
          </div>

          <Tabs defaultValue="chat" className="w-full md:w-auto"></Tabs>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border shadow-xl">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="font-medium text-primary mb-1 font-semibold">Conversation Simulation</h3>
            <p className="text-muted-foreground text-sm">
              You are in a football stadium talking about{" "}
              <span className="font-bold text-foreground">sports terminology</span>. Why not start with{" "}
              <span className="italic text-foreground">"Could you explain what offside means in football?"</span>
            </p>
          </div>

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                {message.role === "assistant" ? (
                  <Avatar className="border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground">GU</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  </Avatar>
                ) : (
                  <Avatar className="border-2 border-secondary/20">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">ME</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  </Avatar>
                )}
                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : theme === "dark"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-secondary/50 text-secondary-foreground"
                    } shadow-sm`}
                  >
                    <p>{message.content}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {message.role === "assistant" && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsUpIcon className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsDownIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {message.audioUrl && (
                    <div className="bg-card border border-border rounded-lg p-3 space-y-2 shadow-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <MicIcon className="h-3 w-3 text-primary" />
                          Audio Message
                        </h4>
                        <Badge variant="outline">Audio</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <VolumeIcon className="h-4 w-4 mr-1" /> Listen
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                          <MicIcon className="h-4 w-4 mr-1" /> Practice Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={startRecording}
              className={isAnalyzingAudio ? "animate-pulse bg-red-500 hover:bg-red-600 text-white" : ""}
              disabled={isAnalyzingAudio}
            >
              <MicIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type your message or use the microphone..."
              value={currentMessage}
              onChange={(e) => actions.setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentMessage.trim() || isSending} 
              className="bg-primary hover:bg-primary/90"
            >
              <SendIcon className="h-5 w-5 mr-1" />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <p>Type your message or press the microphone button to practice speaking</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

