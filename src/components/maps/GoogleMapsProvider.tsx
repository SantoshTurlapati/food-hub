import { ReactNode } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/maps-config";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-xs text-gray-500">
        Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment.
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={["places", "marker", "geometry"]}>
      {children}
    </APIProvider>
  );
}
