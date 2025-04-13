"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Suspense, useCallback, useState } from "react";
import CardContainer from "./read-aloud-card-container";
import useToast from "@/main/hooks/use-toast";
import { httpCardService } from "@/infrastructure/cards";
import { useUser } from "@/main/UserContext/UserContext";
import { CardReadAloud } from "@/main/entities/card-read-aloud.type";
import { reactQueryClient } from "@/main/ReactQueryContext/ReactQueryContext";
import { CardsDataContext } from "./contexts/read-aloud-card-context";
import { httpActivitie } from "@/infrastructure/activitie";

const REQUEST_MESSAGES = {
  LOGIN_SUCCESS:
    "Login realizado com sucesso! Redirecionando para a tela inicial.",
  UNKNOWN_ERROR: "Ocorreu um erro desconhecido. Por favor, tente novamente.",
  EDIT_SUCCESS: "Card editado com sucesso!",
  DELETE_SUCCESS: "Card excluído com sucesso!",
  CREATE_SUCSESS: "Card criado com sucesso!",
};

export enum QueryKeys {
  CARDS = "cards",
  CARD = "card"
}

export type ErrorResponse = {
  status: number;
  code: string;
  response: { data: { body: string } };
};

export default function PhraseCardPage() {
  const { user } = useUser();
  const userId = user?.body?.data?.id;
  const form = useForm<CardReadAloud>();
  const [isEditing, setIsEditing] = useState(false);
  const [cardIsOpen, setCardIsOpen] = useState(false);

  const { showError, showSuccess } = useToast();

  const handleCloseDialog = useCallback(() => {
    setCardIsOpen((old) => !old);
  }, []);

  const {
    data,
    isLoading: isLoadingCards,
    error,
  } = useQuery({
    queryKey: [QueryKeys.CARDS],
    enabled: !!userId,
    queryFn: () => httpCardService.getAll(userId),
  });

  const { mutate: createPhraseCard, isPending: isCreatingCard } = useMutation({
    mutationFn: (newCard: CardReadAloud) =>
      httpCardService.create({ ...newCard, userId }),
    onSuccess: () => {
      reactQueryClient.invalidateQueries({ queryKey: [QueryKeys.CARDS] });
      handleCloseDialog();
      showSuccess(REQUEST_MESSAGES.CREATE_SUCSESS);
    },
    onError: (error: ErrorResponse) => {
      showError(error.response.data.body || REQUEST_MESSAGES.UNKNOWN_ERROR);
    },
  });

  const { mutate: createRegisterActivitie, isPending: isRegisteringActivitie } = useMutation({
    mutationFn: (newCard: any) =>
      httpActivitie.register({ ...newCard, userId }),
  });

  const { mutate: editPhraseCard, isPending: isEditingCard } = useMutation({
    mutationFn: (value: CardReadAloud) => httpCardService.edit({ ...value }),
    onSuccess: () => {
      reactQueryClient.invalidateQueries({ queryKey: [QueryKeys.CARDS] });
      handleCloseDialog();
      showSuccess(REQUEST_MESSAGES.EDIT_SUCCESS);
    },
    onError: (error: ErrorResponse) => {
      showError(error.response.data.body || REQUEST_MESSAGES.UNKNOWN_ERROR);
    },
  });

  const { mutate: deletePhraseCard, isPending: isDeletingCard } = useMutation({
    mutationFn: (cardId: string) => httpCardService.delete(cardId),
    onSuccess: () => {
      reactQueryClient.invalidateQueries({ queryKey: [QueryKeys.CARDS] });
      setCardIsOpen(false);

      showSuccess(REQUEST_MESSAGES.DELETE_SUCCESS);
    },
    onError: (error: ErrorResponse) => {
      showError(error.response.data.body || REQUEST_MESSAGES.UNKNOWN_ERROR);
    },
  });

  const isLoadingArray = [
    isLoadingCards,
    isCreatingCard,
    isEditingCard,
    isDeletingCard,
  ];
  const isLoading = isLoadingArray.some((loading) => loading);

  const handleEditCard = useCallback(
    (value: CardReadAloud) => {
      editPhraseCard(value);
    },
    [editPhraseCard]
  );

  const handleDeleteCard = useCallback(
    (cardId: string) => {
      deletePhraseCard(cardId);
    },
    [deletePhraseCard]
  );

  const handleCreateCard = useCallback(
    (newCard: CardReadAloud) => {
      createPhraseCard(newCard);
    },
    [createPhraseCard]
  );

  const onIsEditing = useCallback(
    (value: boolean) => {
      setIsEditing(value);
    },
    [createPhraseCard]
  );

  return (
    <Suspense>
      <CardsDataContext value={data?.body.data}>
        <CardContainer
          form={form}
          createRegisterActivitie={createRegisterActivitie}
          handleCloseDialog={handleCloseDialog}
          cardIsOpen={cardIsOpen}
          cardsReadAloud={data?.body?.data}
          isEditing={isEditing}
          onIsEditing={onIsEditing}
          onEditCard={handleEditCard}
          onDeletePhraseCard={handleDeleteCard}
          onCreateCard={handleCreateCard}
          isLoading={isLoading}
        />
      </CardsDataContext>
    </Suspense>
  );
}
