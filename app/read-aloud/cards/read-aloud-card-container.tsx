"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Plus, Trash2, Edit, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CardReadAloud } from "@/main/entities/card-read-aloud.type";
import { UseFormReturn } from "react-hook-form";
import { DialogCard } from "./components/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryIcon, getDifficultyColor } from "./utils";
import { UseMutateFunction } from "@tanstack/react-query";

type ReadAloudCardsContainerProps = {
  onDeletePhraseCard: (cardId: string) => void;
  isEditing: boolean;
  onIsEditing: (value: boolean) => void;
  onEditCard: (value: CardReadAloud) => void;
  isLoading: boolean;
  onCreateCard: (newCard: CardReadAloud) => void;
  cardIsOpen: boolean;
  handleCloseDialog: () => void;
  createRegisterActivitie: UseMutateFunction<any, Error, any, unknown>
  cardsReadAloud?: CardReadAloud[] | Record<string, CardReadAloud>;
  form: UseFormReturn<CardReadAloud, any, CardReadAloud>;
};

export default function ReadAloudCardsContainer({
  form,
  cardsReadAloud,
  isEditing,
  isLoading,
  cardIsOpen,
  createRegisterActivitie,
  onEditCard,
  handleCloseDialog,
  onIsEditing,
  onCreateCard,
  onDeletePhraseCard,
}: ReadAloudCardsContainerProps) {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const normalizedCards = Array.isArray(cardsReadAloud)
  ? cardsReadAloud
  : Object.values(cardsReadAloud || {});
  
  console.log('cardsReadAloud: ', cardsReadAloud);
  const filteredCards =
    selectedCategory === "all"
      ? normalizedCards
      : normalizedCards.filter((card) => card.category === selectedCategory);

  const handleAddCard = useCallback((data: CardReadAloud) => {
    onCreateCard(data);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:Read Aloud Cards-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mt-10">
      <DialogCard
        form={form}
        isLoading={isLoading}
        isEditing={isEditing}
        handleAddCard={handleAddCard}
        isOpen={cardIsOpen}
        onEditCard={onEditCard}
        onClose={handleCloseDialog}
      />
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Read Aloud Cards
            <Badge
              variant="outline"
              className="ml-2 bg-primary/10 text-primary border-primary/20"
            >
              Manage Cards
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Create and manage your pronunciation practice cards
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="daily">Daily Conversations</SelectItem>
              <SelectItem value="business">Business English</SelectItem>
              <SelectItem value="travel">Travel English</SelectItem>
              <SelectItem value="academic">Academic English</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-primary hover:bg-primary/90"
            type="submit"
            onClick={() => {
              handleCloseDialog();
              onIsEditing(false);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>

          <Button variant="outline" className="hidden" onClick={() => router.push("/read-aloud")}>
            Start Practice
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards?.map((card) => (
          <Card
            key={card.uuid}
            className="border-2 border-border/50 shadow-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              createRegisterActivitie({ startPractice: new Date() })
              router.push(`/read-aloud/cards/${card.uuid}`);
            }}
          >
            <div
              className={`h-1 w-full ${
                card.difficulty === "beginner"
                  ? "bg-green-500"
                  : card.difficulty === "intermediate"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            ></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge
                  variant="outline"
                  className={getDifficultyColor(card.difficulty)}
                >
                  {card?.difficulty
                    ? card.difficulty.charAt(0).toUpperCase() +
                      card.difficulty.slice(1)
                    : "Difficulty not specified"}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      form.reset({
                        uuid: card.uuid,
                        englishText: card.englishText,
                        translation: card.translation,
                        difficulty: card.difficulty,
                        category: card.category,
                      });
                      handleCloseDialog();
                      onIsEditing(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this card.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePhraseCard(card.uuid);
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardTitle className="text-lg mt-2">{card.englishText}</CardTitle>
              {card.translation && (
                <CardDescription className="italic">
                  {card.translation}
                </CardDescription>
              )}
            </CardHeader>
            <CardFooter className="pt-0 pb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {getCategoryIcon(card.category)}
                  <span>
                    {card.category === "daily"
                      ? "Daily Conversations"
                      : card.category === "business"
                      ? "Business English"
                      : card.category === "travel"
                      ? "Travel English"
                      : "Academic English"}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCards?.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No cards found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory === "all"
              ? "You haven't created any cards yet."
              : `You don't have any cards in the ${selectedCategory} category.`}
          </p>
          <Dialog>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Card
            </Button>
            <DialogContent>{/* Dialog content same as above */}</DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
