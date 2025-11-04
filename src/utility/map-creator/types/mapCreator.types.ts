export interface MapCreatorFormData {
  mapUrl: string;
  keywords: string;
  radius: string;
  distance: string;
  description: string;
  businessDetails: string;
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

export interface CircleCoordinate {
  lat: number;
  lng: number;
}
