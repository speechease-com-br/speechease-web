"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs"
import { Badge } from "@/presentation/components/ui/badge"
import {
  Mic,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Briefcase,
  Plane,
  GraduationCap,
  Info,
  Check,
  AlertCircle,
} from "lucide-react"
import { Progress } from "@/presentation/components/ui/progress"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip"
import { useCardsData } from "./cards/contexts/read-aloud-card-context"
import { CardReadAloud } from "@/main/entities/card-read-aloud.type"

interface PhraseCard {
  id: string
  text: string
  translation?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: "daily" | "business" | "travel" | "academic"
}

interface FeedbackResult {
  score: number
  issues: string[]
  correctWords: number
  totalWords: number
}

export default function PracticeAllReadAloudCardContainer({ readAloudPhraseCard }: { readAloudPhraseCard: CardReadAloud[] | undefined }) {
  const [activeTab, setActiveTab] = useState("daily")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  console.log('data: ', readAloudPhraseCard);

  const phraseCards: Record<string, PhraseCard[]> = (readAloudPhraseCard || []).reduce((acc, card) => {
    const { category, uuid, englishText, translation, difficulty } = card;

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      id: uuid,
      text: englishText,
      translation,
      difficulty,
      category,
    });
    return acc;
  }, {} as Record<string, PhraseCard[]>);

  const currentCards = phraseCards[activeTab] || []
  const currentCard = currentCards[currentCardIndex]

  const handleStartRecording = () => {
    setIsRecording(true)
    setFeedback(null)

    setTimeout(() => {
      setIsRecording(false)

      setFeedback({
        score: Math.floor(Math.random() * 30) + 70, 
        issues: ["Pronunciation of 'th' sound", "Intonation at the end of the sentence"],
        correctWords: currentCard.text.split(" ").length - 1,
        totalWords: currentCard.text.split(" ").length,
      })
    }, 3000)
  }

  const handleNextCard = () => {
    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setFeedback(null)
    }
  }

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setFeedback(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "daily":
        return <BookOpen className="h-4 w-4" />
      case "business":
        return <Briefcase className="h-4 w-4" />
      case "travel":
        return <Plane className="h-4 w-4" />
      case "academic":
        return <GraduationCap className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Read Aloud
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
            Pronunciation Practice
          </Badge>
        </h1>
        <p className="text-muted-foreground">Practice your pronunciation with these phrases</p>
      </div>

      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="daily" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Daily Conversations</span>
            <span className="sm:hidden">Daily</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Business English</span>
            <span className="sm:hidden">Business</span>
          </TabsTrigger>
          <TabsTrigger value="travel" className="flex items-center gap-1">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Travel Phrases</span>
            <span className="sm:hidden">Travel</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Academic English</span>
            <span className="sm:hidden">Academic</span>
          </TabsTrigger>
        </TabsList>

        {Object.keys(phraseCards).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)} Phrases
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>
                    Card {currentCardIndex + 1} of {currentCards.length}
                  </span>
                  <Progress value={((currentCardIndex + 1) / currentCards.length) * 100} className="w-20 h-2" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  className="h-9 w-9 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextCard}
                  disabled={currentCardIndex === currentCards.length - 1}
                  className="h-9 w-9 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Card className="mb-6 border-2 border-primary/20 shadow-lg overflow-hidden">
              <div
                className={`h-1 w-full ${currentCard?.difficulty === "beginner" ? "bg-green-500" : currentCard?.difficulty === "intermediate" ? "bg-amber-500" : "bg-red-500"}`}
              ></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge
                    variant={
                      currentCard?.difficulty === "beginner"
                        ? "outline"
                        : currentCard?.difficulty === "intermediate"
                          ? "outline"
                          : "outline"
                    }
                    className={`
                    ${
                      currentCard?.difficulty === "beginner"
                        ? "border-green-500 text-green-500 bg-green-500/10"
                        : currentCard?.difficulty === "intermediate"
                          ? "border-amber-500 text-amber-500 bg-amber-500/10"
                          : "border-red-500 text-red-500 bg-red-500/10"
                    }
                  `}
                  >
                    {currentCard?.difficulty === "beginner" ? (
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Easy
                      </div>
                    ) : currentCard?.difficulty === "intermediate" ? (
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Medium
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Hard
                      </div>
                    )}
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="rounded-full">
                          <Volume2 className="h-4 w-4 mr-2" />
                          Listen
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Listen to correct pronunciation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardTitle className="text-2xl mt-4 leading-relaxed">{currentCard?.text}</CardTitle>
                {currentCard?.translation && (
                  <CardDescription className="mt-2 text-base italic">{currentCard?.translation}</CardDescription>
                )}
              </CardHeader>
              <CardFooter className="flex justify-center pb-6">
                <Button
                  size="lg"
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`px-6 ${isRecording ? "animate-pulse bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}`}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {isRecording ? "Recording..." : "Start Speaking"}
                </Button>
              </CardFooter>
            </Card>

            {feedback && (
              <Card className="mb-6 border-2 border-primary/20 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Pronunciation Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className="text-sm font-bold">{feedback.score}/100</span>
                        </div>
                        <Progress
                          value={feedback.score}
                          className={`h-2 ${
                            feedback.score > 80 ? "bg-green-500" : feedback.score > 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Needs Work</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      <div className="space-y-2 bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Word Accuracy</span>
                          <span className="text-sm font-bold">
                            {feedback.correctWords}/{feedback.totalWords}
                          </span>
                        </div>
                        <Progress
                          value={(feedback.correctWords / feedback.totalWords) * 100}
                          className={`h-2 ${
                            (feedback.correctWords / feedback.totalWords) * 100 > 80
                              ? "bg-green-500"
                              : (feedback.correctWords / feedback.totalWords) * 100 > 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Few Words</span>
                          <span>All Words</span>
                        </div>
                      </div>
                    </div>

                    {feedback.issues.length > 0 && (
                      <div className="bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Info className="h-4 w-4 text-primary" />
                          Areas to Improve:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {feedback.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 justify-end">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Volume2 className="h-4 w-4 mr-1" /> Listen to Correct Pronunciation
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleStartRecording}
                      className="rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Mic className="h-4 w-4 mr-1" /> Try Again
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> Previous
              </Button>
              <Button
                onClick={handleNextCard}
                disabled={currentCardIndex === currentCards.length - 1}
                className="rounded-full bg-primary hover:bg-primary/90"
              >
                Next <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

