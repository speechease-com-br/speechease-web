"use client"

import { useQuery } from "@tanstack/react-query";
import { CardsDataContext } from "./cards/contexts/read-aloud-card-context";
import PracticeAllReadAloudCardContainer from "./practice-all-read-aloud-container";
import { QueryKeys } from "./cards/page";
import { httpCardService } from "@/infrastructure/cards";
import { useUser } from "@/main/UserContext/UserContext";

export default function PracticeAllReadAloudPage() {
  const { user } = useUser();
  const userId = user?.body?.data?.id;

  const {
    data,
    isLoading: isLoadingCards,
    error,
  } = useQuery({
    queryKey: [QueryKeys.CARDS],
    enabled: !!userId,
    queryFn: () => httpCardService.getAll(userId),
  });
  
  return <PracticeAllReadAloudCardContainer readAloudPhraseCard={data?.body.data} />;
}
