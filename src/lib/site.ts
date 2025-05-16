import { format } from "date-fns";

export function mapPlantCondition(conditionRate: string) {
  return conditionRate === "A"
    ? "Excellent"
    : conditionRate === "B"
    ? "Good"
    : conditionRate === "C"
    ? "Fair"
    : conditionRate === "D"
    ? "Poor"
    : conditionRate === "E"
    ? "Very Poor"
    : conditionRate === "F"
    ? "Critical"
    : "";
}

export function doTheDayIsTheDay(a: Date, b?: Date) {
  const bDate = b ?? new Date();
  return format(a, "yyyy-MM-dd") === format(bDate, "yyyy-MM-dd");
}
