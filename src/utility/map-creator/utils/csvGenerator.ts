import { MapCreatorFormData, MapCoordinates } from "../types/mapCreator.types";

export const extractCoordinatesFromMapUrl = (
  url: string
): MapCoordinates | null => {
  if (!url) return null;

  // Pattern 1: @lat,lng
  const pattern1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match1 = url.match(pattern1);
  if (match1) {
    return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) };
  }

  // Pattern 2: /place/@lat,lng
  const pattern2 = /place\/@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match2 = url.match(pattern2);
  if (match2) {
    return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };
  }

  return null;
};

export const generateCSV = (
  formData: MapCreatorFormData,
  coordinates: MapCoordinates
): string => {
  const keywords = formData.keywords
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k);
  const urls = formData.businessDetails
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u);
  const relatedSearches = formData.relatedSearches
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r);

  // CSV Headers
  const headers = [
    "Keyword",
    "Latitude",
    "Longitude",
    "Radius",
    "Distance",
    "Description",
    "URL",
    "Related Search",
  ];

  const rows: string[] = [headers.join(",")];

  // Generate rows for each keyword
  keywords.forEach((keyword, index) => {
    const url = urls[index % urls.length] || "";
    const relatedSearch = relatedSearches[index % relatedSearches.length] || "";
    const description = formData.description.replace(/,/g, " ");

    const row = [
      `"${keyword}"`,
      coordinates.lat.toString(),
      coordinates.lng.toString(),
      formData.radius,
      formData.distance,
      `"${description}"`,
      `"${url}"`,
      `"${relatedSearch}"`,
    ];

    rows.push(row.join(","));
  });

  return rows.join("\n");
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
