import { differenceInDays, format, isToday, isYesterday } from "date-fns";
import { id } from "date-fns/locale";

export function formatWateringDate(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  const diff = differenceInDays(new Date(), date);
  if (diff < 7) return `${diff} days ago`;

  return format(date, "dd MMMM yyyy", { locale: id });
}