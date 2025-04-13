export const getColorClass = (count: number | null) => {
    console.log('count: ', count);
  if (count === null) return "bg-slate-100";
  if (count === 0) return "bg-slate-200";
  if (count < 5) return "bg-green-200";
  if (count < 10) return "bg-green-300";
  return "bg-green-500";
};

export const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
