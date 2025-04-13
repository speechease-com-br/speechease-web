"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { httpCardService } from "@/infrastructure/cards";
import { useUser } from "@/main/UserContext/UserContext";
import PhraseCardContainer from "./phrase-card-container";
import { QueryKeys } from "../page";
import { useParams } from "next/navigation";
import { reactQueryClient } from "@/main/ReactQueryContext/ReactQueryContext";
import { useCallback } from "react";
import { httpActivitie } from "@/infrastructure/activitie";

export default function PracticeAllReadAloudPage() {
  const params = useParams();
  const cardId = params.id as string;
  const { user } = useUser();
  const userId = user?.body?.data?.id;

  const {
    data,
    isLoading: isLoadingCards,
    error,
  } = useQuery({
    queryKey: [QueryKeys.CARD],
    enabled: !!userId,
    queryFn: () => httpCardService.getById(cardId),
  });

  const {
    mutate: mutateAnalysisFeedback,
    isPending: isLoadingAnalysisFeedback,
    data: speechAnalysis,
  } = useMutation({
    mutationFn: ({
      audioBase64,
      expectedText,
    }: {
      audioBase64: string;
      expectedText: string;
    }) =>
      httpCardService.speechAnalysis({
        audioBase64,
        expectedText,
      }),
  });

  const { mutate: createRegisterActivitie, isPending: isRegisteringActivitie } =
    useMutation({
      mutationFn: (newCard: any) =>
        httpActivitie.register({ ...newCard, userId }),
    });

  const onAnalisysAudio = useCallback(
    ({
      audioBase64,
      expectedText,
    }: {
      audioBase64: string;
      expectedText: string;
    }) => mutateAnalysisFeedback({ audioBase64, expectedText }),
    []
  );

  return (
    <PhraseCardContainer
      isLoadingCards={isLoadingCards}
      createRegisterActivitie={createRegisterActivitie}
      phraseCard={data?.body.data}
      isLoadingAnalysisFeedback={isLoadingAnalysisFeedback}
      speechAnalysis={speechAnalysis?.body.data.result}
      onAnalisysAudio={onAnalisysAudio}
    />
  );
}
