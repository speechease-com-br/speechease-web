import { BookOpen, Briefcase, GraduationCap, Plane } from "lucide-react";

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "border-green-500 text-green-500 bg-green-500/10";
    case "medium":
      return "border-amber-500 text-amber-500 bg-amber-500/10";
    case "hard":
      return "border-red-500 text-red-500 bg-red-500/10";
    default:
      return "border-amber-500 text-amber-500 bg-amber-500/10";
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "daily":
      return <BookOpen className="h-4 w-4" />;
    case "business":
      return <Briefcase className="h-4 w-4" />;
    case "travel":
      return <Plane className="h-4 w-4" />;
    case "academic":
      return <GraduationCap className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};
