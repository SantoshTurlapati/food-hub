// Configuration for Google Maps Platform in FoodFlow
export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  "AIzaSyArJa-4WhmQW08dOa7NRDI6UA-oZj3ib20";

export const DEFAULT_MAP_CENTER = { lat: 17.3984, lng: 78.4735 };

export const ATTRIBUTION_ID = "gmp_mcp_codeassist_v1_aistudio";
