import { format } from "date-fns";

export const getStatusVariant = (status: string | null | undefined) => {
  if (!status) return "secondary";
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "published":
    case "live":
    case "1":
      return "default";
    case "scheduled":
      return "secondary";
    case "failed":
    case "0":
      return "destructive";
    default:
      return "secondary";
  }
};

export const formatPublishDate = (dateString: string) => {
  try {
    // Parse the date format "05/09/2024 10:55 AM"
    const [datePart, timePart, period] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour24,
      parseInt(minutes)
    );
    return format(date, "MMM dd, yyyy • h:mm a");
  } catch {
    return dateString;
  }
};
