// Centralized business-related types
export type BusinessLocationLite = {
  name: string;
  latitude: string;
  longitude: string;
  type?: number; // 2 for Map URL, 3 for CID; omit for Google autocomplete
  input?: string; // raw input value for Map URL or CID
};

export type ProjectLite = {
  id: string;
  project_name: string;
};
