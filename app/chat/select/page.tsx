"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpenIcon,
  BriefcaseIcon,
  GlobeAltIcon as PlaneIcon,
  AcademicCapIcon as GraduationCapIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import { ChatBubbleLeftRightIcon as MessageSquareIcon } from "@heroicons/react/24/outline"

export default function ChatSelectPage() {
  const router = useRouter()
  const [customTopic, setCustomTopic] = useState<string>("")

  const topics = [
    {
      id: "daily",
      title: "Daily Conversations",
      description: "Practice everyday English for common situations",
      icon: <BookOpenIcon className="h-5 w-5" />,
    },
    {
      id: "business",
      title: "Business English",
      description: "Learn professional vocabulary and expressions",
      icon: <BriefcaseIcon className="h-5 w-5" />,
    },
    {
      id: "travel",
      title: "Travel English",
      description: "Essential phrases for your next trip abroad",
      icon: <PlaneIcon className="h-5 w-5" />,
    },
    {
      id: "academic",
      title: "Academic English",
      description: "Improve your formal writing and speaking skills",
      icon: <GraduationCapIcon className="h-5 w-5" />,
    },
  ]

  const handleStartChat = () => {
    if (customTopic.trim()) {
      // Navigate to chat page with custom topic
      router.push(`/chat?topic=${encodeURIComponent(customTopic.trim())}`)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Chat with GUGA
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
            Custom Topic
          </Badge>
        </h1>
        <p className="text-muted-foreground">Enter any topic you'd like to discuss with GUGA</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What would you like to talk about?</h2>
        <Card className="border border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Enter Your Topic</CardTitle>
            <CardDescription>Type any subject you're interested in discussing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., Travel tips for Japan, Business presentations, Daily greetings..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-muted-foreground">
                GUGA will adapt to your chosen topic and help you practice your English skills
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Or choose a topic shortcut:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="cursor-pointer transition-all hover:border-primary/50 border border-border"
              onClick={() => setCustomTopic(topic.title)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-secondary/50">{topic.icon}</div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{topic.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleStartChat}
          disabled={!customTopic.trim()}
          className="bg-primary hover:bg-primary/90 px-6"
          size="lg"
        >
          <MessageSquareIcon className="mr-2 h-5 w-5" />
          Start Conversation
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

