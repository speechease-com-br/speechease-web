"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import { useTheme } from "next-themes"

// Hero Icons imports
import {
  PaperAirplaneIcon as SendIcon,
  MicrophoneIcon as MicIcon,
  SpeakerWaveIcon as VolumeIcon,
  HandThumbUpIcon as ThumbsUpIcon,
  HandThumbDownIcon as ThumbsDownIcon,
} from "@heroicons/react/24/outline"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  feedback?: {
    pronunciation?: {
      score: number
      issues?: string[]
    }
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm GUGA, your personal English tutor. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      feedback: {
        pronunciation: {
          score: 85,
          issues: ["th sound in 'think'"],
        },
      },
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "That's a good question! Let me help you with that. Remember to practice the 'th' sound in 'think' - try placing your tongue between your teeth and gently blowing air out.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const startRecording = () => {
    setIsRecording(true)
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false)
      setInput("I think English pronunciation is difficult to master.")
    }, 3000)
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
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                {message.sender === "ai" ? (
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
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : theme === "dark"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-secondary/50 text-secondary-foreground"
                    } shadow-sm`}
                  >
                    <p>{message.content}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {message.sender === "ai" && (
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

                  {message.feedback?.pronunciation && (
                    <div className="bg-card border border-border rounded-lg p-3 space-y-2 shadow-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <MicIcon className="h-3 w-3 text-primary" />
                          Pronunciation Feedback
                        </h4>
                        <Badge variant={message.feedback.pronunciation.score > 80 ? "default" : "secondary"}>
                          Score: {message.feedback.pronunciation.score}/100
                        </Badge>
                      </div>
                      {message.feedback.pronunciation.issues && message.feedback.pronunciation.issues.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <p>Areas to improve:</p>
                          <ul className="list-disc list-inside">
                            {message.feedback.pronunciation.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
              className={isRecording ? "animate-pulse bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              <MicIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Use the microphone to speak..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              className="flex-1"
              disabled
            />
            <Button onClick={handleSendMessage} disabled={!input.trim()} className="bg-primary hover:bg-primary/90">
              <SendIcon className="h-5 w-5 mr-1" />
              Send
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <p>Press the microphone button to practice speaking - typing is disabled</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

