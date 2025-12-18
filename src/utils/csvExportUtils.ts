import { MediaItem } from "@/components/Media/Gallery";

/**
 * Generates CSV content from media items
 */
export const generateMediaCSV = (items: MediaItem[]): string => {
  const headers = ["Name", "URL", "Type", "Date"];
  const rows = items.map((item) => [
    item.title || "Untitled",
    item.url,
    item.type,
    item.date,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
};

/**
 * Downloads media items as a CSV file
 */
export const downloadMediaCSV = (
  items: MediaItem[],
  filename?: string
): void => {
  const csvContent = generateMediaCSV(items);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = filename || `gallery-export-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
