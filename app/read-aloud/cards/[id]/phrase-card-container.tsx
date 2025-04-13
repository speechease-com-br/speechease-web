"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  SpeakerWaveIcon,
  MicrophoneIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  BookOpenIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { CardReadAloud } from "@/main/entities/card-read-aloud.type";
import {
  PronunciationFeedback,
  WordFeedback,
} from "@/main/entities/pronunciation-feedback";
import {
  getCategoryIcon,
  getDifficultyColor,
  getProgressColor,
  getScoreColor,
} from "./utils";
import { Tag } from "@/components/ui/tag";
import { UseMutateFunction } from "@tanstack/react-query";

interface PhraseCardContainerProps {
  phraseCard?: CardReadAloud;
  isLoadingCards: boolean;
  isLoadingAnalysisFeedback: boolean;
  onAnalisysAudio: ({
    audioBase64,
    expectedText,
  }: {
    audioBase64: string;
    expectedText: string;
  }) => void;
  createRegisterActivitie: UseMutateFunction<any, Error, any, unknown>;
  speechAnalysis: PronunciationFeedback;
}

export default function PhraseCardContainer({
  phraseCard,
  isLoadingCards,
  speechAnalysis,
  isLoadingAnalysisFeedback,
  createRegisterActivitie,
  onAnalisysAudio,
}: PhraseCardContainerProps) {
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [expandedWords, setExpandedWords] = useState<Record<string, boolean>>(
    {}
  );
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handlePlayAudio = () => {
    if ("speechSynthesis" in window && phraseCard) {
      const utterance = new SpeechSynthesisUtterance(phraseCard.englishText);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleWordExpansion = useCallback(
    (word: string) => {
      setExpandedWords((prev) => ({
        ...prev,
        [word]: !prev[word],
      }));
    },
    [setExpandedWords]
  );

  const captureAudioAndConvertToBase64 = async (): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      setMediaRecorder(recorder);

      return new Promise((resolve, reject) => {
        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result?.toString().split(",")[1] || null;
            resolve(base64Audio);
          };
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        };

        recorder.start();
      });
    } catch (error) {
      console.error("Error capturing audio:", error);
      return null;
    }
  };

  const handleCaptureAudio = async () => {
    setIsRecording(true);
    const base64Audio = await captureAudioAndConvertToBase64();
    setIsRecording(false);

    if (base64Audio) {
      onAnalisysAudio({
        audioBase64: base64Audio,
        expectedText: phraseCard?.englishText ?? "",
      });
      console.log("Captured Audio in Base64:", base64Audio);
    } else {
      console.error("Failed to capture audio.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setHasSpoken(true);
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  if (isLoadingCards) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!phraseCard) {
    return (
      <div className="container py-8">
        <Button
          variant="outline"
          onClick={() => {
            createRegisterActivitie({ endPractice: new Date() });
            router.back();
          }}
          className="mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Cards
        </Button>

        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Card Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The card you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/read-aloud/cards")}>
            Return to Cards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="outline"
        onClick={() => {
          createRegisterActivitie({ endPractice: new Date() });
          router.back();
        }}
        className="mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Cards
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-primary/20 shadow-lg overflow-hidden mb-6">
          <div
            className={`h-2 w-full ${
              phraseCard.difficulty === "beginner"
                ? "bg-green-500"
                : phraseCard.difficulty === "intermediate"
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          ></div>

          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge
                variant="outline"
                className={getDifficultyColor(phraseCard.difficulty)}
              >
                {phraseCard?.difficulty?.charAt(0).toUpperCase() +
                  phraseCard?.difficulty?.slice(1)}
              </Badge>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getCategoryIcon(phraseCard.category)}
                  <span>
                    {phraseCard.category === "daily"
                      ? "Daily Conversations"
                      : phraseCard.category === "business"
                      ? "Business English"
                      : phraseCard.category === "travel"
                      ? "Travel English"
                      : "Academic English"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 mb-2">
              <CardTitle className="text-2xl leading-relaxed">
                {phraseCard.englishText}
              </CardTitle>
            </div>

            <div
              className="mt-4 relative"
              onMouseEnter={() => hasSpoken && setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div
                className={`
                transition-all duration-300 
                ${
                  !hasSpoken
                    ? "blur-md select-none"
                    : isHovering
                    ? ""
                    : "blur-[2px]"
                }
              `}
              >
                <CardDescription className="text-lg italic">
                  {phraseCard.translation || "No translation available"}
                </CardDescription>
              </div>

              {!hasSpoken && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-md">
                    Speak to reveal translation
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePlayAudio}
                className="flex-1"
              >
                <SpeakerWaveIcon className="h-5 w-5 mr-2" />
                Listen to Phrase
              </Button>

              <Button
                size="lg"
                onClick={isRecording ? handleStopRecording : handleCaptureAudio}
                className={`flex-1 ${
                  isRecording ? "bg-red-500 hover:bg-red-600" : ""
                }`}
              >
                <MicrophoneIcon className="h-5 w-5 mr-2" />
                {isRecording ? "Stop Recording" : "Speak Now"}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="w-full p-4 bg-primary/5 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">
                Pronunciation Tips:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Listen to the audio first to hear the correct pronunciation
                </li>
                <li>Pay attention to word stress and intonation</li>
                <li>Speak clearly and at a natural pace</li>
              </ul>
            </div>

            {hasSpoken && !speechAnalysis && (
              <div className="text-center w-full">
                <p>Hover over the translation to see it clearly</p>
              </div>
            )}
          </CardFooter>
        </Card>

        {isLoadingAnalysisFeedback ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Analyzing pronunciation...
              </p>
            </div>
          </div>
        ) : (
          speechAnalysis && (
            <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
              <CardHeader>
                {speechAnalysis.warning?.at(0)?.message && (
                  <Tag
                    variant="warning"
                    className="p-3 border border-amber-800 text-center flex justify-center items-center"
                  >
                    <p>{speechAnalysis.warning?.at(0)?.message}</p>
                  </Tag>
                )}
                <CardTitle className="flex items-center justify-between">
                  <span>Pronunciation Feedback</span>
                  <div className="relative bg-blue-100 rounded-full px-8 py-3 flex items-center">
                    <span
                      className={`text-3xl font-bold ${getScoreColor(
                        speechAnalysis.overall
                      )}`}
                    >
                      {speechAnalysis.overall}
                    </span>
                    <SpeakerWaveIcon
                      className="h-5 w-5 ml-2 text-blue-500 cursor-pointer"
                      onClick={handlePlayAudio}
                      title="Listen again"
                    />
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Detailed Scores */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Pronunciation</span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(
                          speechAnalysis.pronunciation
                        )}`}
                      >
                        {speechAnalysis.pronunciation}
                      </span>
                    </div>
                    <Progress
                      value={speechAnalysis.pronunciation}
                      className={`h-2 ${getProgressColor(
                        speechAnalysis.pronunciation
                      )}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Fluency</span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(
                          speechAnalysis.fluency
                        )}`}
                      >
                        {speechAnalysis.fluency}
                      </span>
                    </div>
                    <Progress
                      value={speechAnalysis.fluency}
                      className={`h-2 ${getProgressColor(
                        speechAnalysis.fluency
                      )}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Integrity</span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(
                          speechAnalysis.integrity
                        )}`}
                      >
                        {speechAnalysis.integrity}
                      </span>
                    </div>
                    <Progress
                      value={speechAnalysis.integrity}
                      className={`h-2 ${getProgressColor(
                        speechAnalysis.integrity
                      )}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Rhythm</span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(
                          speechAnalysis.rhythm
                        )}`}
                      >
                        {speechAnalysis.rhythm}
                      </span>
                    </div>
                    <Progress
                      value={speechAnalysis.rhythm}
                      className={`h-2 ${getProgressColor(
                        speechAnalysis.rhythm
                      )}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Speed (wpm)</span>
                      <span
                        className={`text-sm font-bold ${getScoreColor(
                          speechAnalysis.speed
                        )}`}
                      >
                        {speechAnalysis.speed}
                      </span>
                    </div>
                    <Progress
                      value={speechAnalysis.speed}
                      className={`h-2 ${getProgressColor(
                        speechAnalysis.speed
                      )}`}
                    />
                  </div>
                </div>

                {/* Word-level Evaluation */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Word-level Evaluation Result
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 bg-muted/20 p-3 font-medium">
                      <div>Word</div>
                      <div>Quality score</div>
                      <div>Click to see phoneme level analysis</div>
                    </div>

                    {speechAnalysis.words.map((wordScore, index) => (
                      <div key={index} className="border-t">
                        <div className="grid grid-cols-3 p-3 items-center hover:bg-muted/10">
                          <div>{wordScore.word}</div>
                          <div
                            className={`font-semibold ${getScoreColor(
                              wordScore.scores.overall
                            )}`}
                          >
                            {wordScore.scores.overall}
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleWordExpansion(wordScore.word)
                              }
                              className="flex items-center gap-1"
                            >
                              {expandedWords[wordScore.word] ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {expandedWords[wordScore.word] &&
                          wordScore.phonemes && (
                            <div className="bg-muted/5 p-3 border-t">
                              <h4 className="text-sm font-medium mb-2">
                                Phoneme Analysis
                              </h4>
                              <div className="space-y-2">
                                {wordScore.phonemes.map((phoneme, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="font-mono bg-muted/20 px-2 py-1 rounded">
                                      {phoneme.phoneme}
                                    </span>
                                    <Progress
                                      value={phoneme.pronunciation}
                                      className={`h-2 flex-1 ${getProgressColor(
                                        phoneme.pronunciation
                                      )}`}
                                    />
                                    <span
                                      className={`text-xs font-semibold ${getScoreColor(
                                        phoneme.pronunciation
                                      )}`}
                                    >
                                      {phoneme.pronunciation}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speech to Text Result */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Speech to Text Result
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/5">
                    <p>{phraseCard.englishText || "No recognized text"}</p>
                  </div>
                </div>

                {/* Improvement Tips
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-700">
                    Improvement Tips
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    {speechAnalysis.tips.map((tip, index) => (
                      <li key={index} className="text-blue-700">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div> */}
              </CardContent>

              {/* <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={handlePlayAudio}>
                  <SpeakerWaveIcon className="h-4 w-4 mr-2" />
                  Listen Again
                </Button>
                <Button onClick={handleStartRecording}>
                  <MicrophoneIcon className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardFooter> */}
            </Card>
          )
        )}
      </div>
    </div>
  );
}
