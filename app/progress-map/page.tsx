"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  TrendingUp,
  Mic,
  BookOpen,
  Lightbulb,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUpRight,
  BarChart3,
  BookMarked,
  MessageSquare,
} from "lucide-react"

export default function ProgressMapPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for the progress map
  const skillsData = [
    {
      name: "Pronunciation",
      score: 72,
      strengths: ["Vowel sounds", "Basic consonants"],
      weaknesses: ["'Th' sound", "Word stress patterns", "Intonation"],
      tips: [
        "Practice 'th' sounds daily with tongue twisters",
        "Record yourself speaking and compare with native speakers",
        "Focus on word stress in multi-syllable words",
      ],
    },
    {
      name: "Vocabulary",
      score: 85,
      strengths: ["Daily conversation", "Basic business terms"],
      weaknesses: ["Academic vocabulary", "Idioms and expressions"],
      tips: [
        "Read academic articles in your field of interest",
        "Learn 3 new idioms each week and use them in conversation",
        "Create flashcards for new vocabulary",
      ],
    },
    {
      name: "Grammar",
      score: 68,
      strengths: ["Present tense", "Basic sentence structure"],
      weaknesses: ["Conditional tenses", "Passive voice", "Perfect tenses"],
      tips: [
        "Practice using conditional sentences in your writing",
        "Identify passive voice in news articles and rewrite in active voice",
        "Create a study schedule focusing on perfect tenses",
      ],
    },
    {
      name: "Listening",
      score: 79,
      strengths: ["Clear speech comprehension", "Following instructions"],
      weaknesses: ["Fast speech", "Different accents", "Background noise"],
      tips: [
        "Watch movies with subtitles, then without",
        "Listen to podcasts with various English accents",
        "Practice listening exercises in noisy environments",
      ],
    },
    {
      name: "Speaking",
      score: 75,
      strengths: ["Basic conversation", "Asking questions"],
      weaknesses: ["Speaking fluently", "Public speaking", "Debate skills"],
      tips: [
        "Practice speaking for 10 minutes daily without pausing",
        "Join an English speaking club or find a language partner",
        "Record yourself discussing various topics",
      ],
    },
  ]

  // Recent activities data
  const recentActivities = [
    {
      type: "pronunciation",
      name: "Read Aloud Practice",
      score: 78,
      date: "2 days ago",
      details: "Completed 12 phrases with focus on 'th' sounds",
    },
    {
      type: "conversation",
      name: "Chat with GUGA",
      score: 82,
      date: "Yesterday",
      details: "20-minute conversation about travel plans",
    },
    {
      type: "vocabulary",
      name: "Business English Lesson",
      score: 90,
      date: "4 days ago",
      details: "Learned 15 new business terms and expressions",
    },
  ]

  // Recommended resources
  const recommendedResources = [
    {
      title: "Pronunciation Workshop",
      description: "Focus on problematic 'th' sounds and word stress",
      type: "exercise",
      icon: <Mic className="h-5 w-5 text-primary" />,
    },
    {
      title: "Grammar Essentials: Conditionals",
      description: "Master conditional tenses with guided practice",
      type: "lesson",
      icon: <BookMarked className="h-5 w-5 text-primary" />,
    },
    {
      title: "Accent Training: British English",
      description: "Improve your listening skills with different accents",
      type: "audio",
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Progress Map
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
            Learning Insights
          </Badge>
        </h1>
        <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Skills Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span>Recommendations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Overall Progress
              </CardTitle>
              <CardDescription>Your English proficiency level and recent improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="text-3xl font-bold text-primary">76%</div>
                  </div>
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/30"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="440"
                      strokeDashoffset="105.6"
                      className="text-primary"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Intermediate (B1-B2)</h3>
                  <p className="text-muted-foreground mb-4">
                    You're making steady progress! Your overall proficiency has improved by 8% in the last month.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {skillsData.map((skill) => (
                      <div key={skill.name} className="bg-card/50 backdrop-blur-sm p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm font-medium">{skill.name}</div>
                          <div className={`text-sm font-bold ${getScoreColor(skill.score)}`}>{skill.score}%</div>
                        </div>
                        <Progress
                          value={skill.score}
                          className={`h-1.5 ${getProgressColor(skill.score)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-border/50 shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-card/50 backdrop-blur-sm">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {activity.type === "pronunciation" ? (
                          <Mic className="h-5 w-5 text-primary" />
                        ) : activity.type === "conversation" ? (
                          <MessageSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{activity.name}</h4>
                          <span className={`font-bold ${getScoreColor(activity.score)}`}>{activity.score}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Areas to Focus On
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="font-medium flex items-center gap-1 text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      Pronunciation
                    </h4>
                    <p className="text-sm mt-1">Difficulty with 'th' sounds and word stress patterns</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <h4 className="font-medium flex items-center gap-1 text-amber-500">
                      <Info className="h-4 w-4" />
                      Grammar
                    </h4>
                    <p className="text-sm mt-1">Challenges with conditional tenses and passive voice</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <h4 className="font-medium flex items-center gap-1 text-amber-500">
                      <Info className="h-4 w-4" />
                      Speaking
                    </h4>
                    <p className="text-sm mt-1">Need to improve fluency and public speaking skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {skillsData.map((skill) => (
            <Card key={skill.name} className="border-2 border-border/50 shadow-lg overflow-hidden">
              <div className={`h-1 w-full ${getProgressColor(skill.score)}`}></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {skill.name === "Pronunciation" ? (
                      <Mic className="h-5 w-5 text-primary" />
                    ) : skill.name === "Vocabulary" ? (
                      <BookOpen className="h-5 w-5 text-primary" />
                    ) : skill.name === "Grammar" ? (
                      <BookMarked className="h-5 w-5 text-primary" />
                    ) : skill.name === "Listening" ? (
                      <MessageSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-primary" />
                    )}
                    {skill.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`${getScoreColor(skill.score)} border-${getScoreColor(skill.score).replace("text-", "border-")}/20 bg-${getScoreColor(skill.score).replace("text-", "bg-")}/10`}
                  >
                    {skill.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <h4 className="font-medium flex items-center gap-1 text-green-500 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {skill.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <h4 className="font-medium flex items-center gap-1 text-red-500 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      Areas to Improve
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {skill.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <h4 className="font-medium flex items-center gap-1 text-primary mb-2">
                    <Lightbulb className="h-4 w-4" />
                    Improvement Tips
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {skill.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>Based on your progress and areas that need improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedResources.map((resource, index) => (
                  <Card
                    key={index}
                    className="border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary/10 p-2 rounded-full">{resource.icon}</div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {resource.type === "exercise" ? "Exercise" : resource.type === "lesson" ? "Lesson" : "Audio"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-4">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-primary hover:text-primary hover:bg-primary/10"
                      >
                        Start Now
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Study Plan
              </CardTitle>
              <CardDescription>A suggested schedule to improve your weakest areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["Monday", "Wednesday", "Friday"].map((day) => (
                    <div key={day} className="bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-border">
                      <h4 className="font-medium">{day}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mic className="h-4 w-4 text-primary" />
                          <span>20 min: Pronunciation Practice</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookMarked className="h-4 w-4 text-primary" />
                          <span>15 min: Grammar Exercises</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {["Tuesday", "Thursday", "Weekend"].map((day) => (
                    <div key={day} className="bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-border">
                      <h4 className="font-medium">{day}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span>20 min: Speaking Practice</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>15 min: Vocabulary Building</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90">Apply This Study Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

