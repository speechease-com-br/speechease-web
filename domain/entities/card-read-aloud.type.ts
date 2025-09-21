export type CardReadAloud = {
  uuid: string;
  userId: string;
  category: "daily" | "business" | "travel" | "academic";
  englishText: string;
  translation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: string; // ISO 8601 format
};
