import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CardReadAloud } from "@/main/entities/card-read-aloud.type";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  form: UseFormReturn<CardReadAloud, any, CardReadAloud>;
  isEditing: boolean;
  isLoading: boolean;
  onEditCard: (cardId: CardReadAloud) => void;
  handleAddCard: (data: CardReadAloud) => void;
  children?: React.ReactNode;
}

export const DialogCard: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  isLoading,
  isEditing,
  onEditCard,
  handleAddCard,
  form,
  title,
  children,
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isEditing) {
      form.handleSubmit((data) => onEditCard({ ...data }))();
    } else {
      form.handleSubmit(handleAddCard)();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{!isEditing ? "Add New" : "Edit"} Card</DialogTitle>
          <DialogDescription>
            {!isEditing ? "Create a new" : "Edit"} phrase card for pronunciation
            practice.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">English Phrase</label>
            <FormField
              control={form.control}
              name="englishText"
              render={({ field }) => (
                <Textarea
                  required
                  placeholder="Enter the English phrase"
                  {...field}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Translation (Optional)
            </label>
            <FormField
              control={form.control}
              name="translation"
              render={({ field }) => (
                <Textarea placeholder="Enter the translation" {...field} />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select
                    required
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Conversations</SelectItem>
                      <SelectItem value="business">Business English</SelectItem>
                      <SelectItem value="travel">Travel English</SelectItem>
                      <SelectItem value="academic">Academic English</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select
                    required
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button variant="outline">Reset</Button>
            <Button disabled={isLoading} type="submit">{!isEditing ? "Add" : "Edit"} Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Dialog;
