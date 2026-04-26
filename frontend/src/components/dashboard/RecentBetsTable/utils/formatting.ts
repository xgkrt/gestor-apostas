import { format, parse } from "date-fns"

export function getStatusClasses(status: string) {
  const isGreen = status === "GREEN" || status === "HALF_GREEN"
  const isRed = status === "RED" || status === "HALF_RED"
  const isPending = status === "PENDING"

  if (isGreen) {
    return "bg-emerald-50 text-emerald-700 dark:text-emerald-300 border-emerald-300 impact-status"
  }
  if (isRed) {
    return "bg-red-50 text-red-700 dark:text-rose-300 border-red-300 impact-status"
  }
  if (isPending) {
    return "bg-yellow-50 text-yellow-700 dark:text-yellow-300 border-yellow-300 impact-status"
  }
  return "bg-muted text-muted-foreground border-border impact-status"
}

export function formatBetDate(dateStr: string) {
  try {
    const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date())
    return format(parsedDate, "dd MMM")
  } catch (error) {
    console.error("Error parsing date:", dateStr, error)
    return dateStr
  }
}
