import { AcademicCapIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon, BriefcaseIcon } from "lucide-react";

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
      return <BookOpenIcon className="h-4 w-4" />;
    case "business":
      return <BriefcaseIcon className="h-4 w-4" />;
    case "travel":
      return <GlobeAltIcon className="h-4 w-4" />;
    case "academic":
      return <AcademicCapIcon className="h-4 w-4" />;
    default:
      return <BookOpenIcon className="h-4 w-4" />;
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
};

export const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

