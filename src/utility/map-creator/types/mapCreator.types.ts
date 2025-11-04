export interface MapCreatorFormData {
  mapUrl: string;
  keywords: string;
  radius: string;
  distance: string;
  description: string;
  urls: string;
  relatedSearches: string;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface CSVRow {
  keyword: string;
  lat: number;
  lng: number;
  radius: string;
  distance: string;
  description: string;
  url: string;
  relatedSearch: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
