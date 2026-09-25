import { useState, useMemo, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { ATTRIBUTION_ID } from "@/lib/maps-config";
import { MapPin, Building2, CheckCircle2, Navigation, Users, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DiscoveryMatch {
  id: string;
  businessName: string;
  businessType: string;
  distance: number | string;
  score: number;
  capacity?: number;
  urgency?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

export interface RealDiscoveryMapProps {
  matches?: DiscoveryMatch[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  userAddress?: string;
  userCoordinates?: { lat: number; lng: number };
  className?: string;
}

// Default candidate partner coordinates if not specified in data
const DEFAULT_PARTNER_COORDS = [
  { lat: 17.4120, lng: 78.4680 },
  { lat: 17.4320, lng: 78.4610 },
  { lat: 17.4410, lng: 78.4790 },
  { lat: 17.3750, lng: 78.5020 },
  { lat: 17.3910, lng: 78.4410 },
];

function BoundsFitter({
  origin,
  destinations,
}: {
  origin: google.maps.LatLngLiteral;
  destinations: google.maps.LatLngLiteral[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(origin);
    destinations.forEach((d) => bounds.extend(d));
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [map, origin, destinations]);

  return null;
}

function DiscoveryMapContent({
  matches = [],
  selectedId,
  onSelect,
  userAddress = "Your Pickup Location",
  userCoordinates = { lat: 17.3850, lng: 78.4867 },
  className = "h-80 w-full min-h-[340px] rounded-2xl overflow-hidden relative shadow-inner border border-emerald-900/10",
}: RealDiscoveryMapProps) {
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(selectedId || null);

  // Synchronize active InfoWindow if selected externally
  useEffect(() => {
    if (selectedId) {
      setActiveInfoWindowId(selectedId);
    }
  }, [selectedId]);

  const partnersWithCoords = useMemo(() => {
    return matches.map((m, index) => {
      const fallbackCoord = DEFAULT_PARTNER_COORDS[index % DEFAULT_PARTNER_COORDS.length];
      return {
        ...m,
        latLng: m.coordinates || fallbackCoord,
      };
    });
  }, [matches]);

  const destinationCoords = useMemo(
    () => partnersWithCoords.map((p) => p.latLng),
    [partnersWithCoords],
  );

  return (
    <div className={className}>
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={userCoordinates}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
        internalUsageAttributionIds={[ATTRIBUTION_ID]}
        className="h-full w-full"
      >
        <BoundsFitter origin={userCoordinates} destinations={destinationCoords} />

        {/* 1. Origin (Donor / User) Marker */}
        <AdvancedMarker position={userCoordinates} title="Your Pickup Location">
          <div className="flex flex-col items-center cursor-pointer">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174A57] text-white shadow-xl ring-4 ring-white">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-[#173B38] shadow-sm border border-emerald-200 whitespace-nowrap">
              You (Pickup)
            </span>
          </div>
        </AdvancedMarker>

        {/* 2. Destination Matches (NGOs, Shelters, Community Kitchens) */}
        {partnersWithCoords.map((partner) => {
          const isSelected = selectedId === partner.id;
          return (
            <AdvancedMarker
              key={partner.id}
              position={partner.latLng}
              onClick={() => {
                setActiveInfoWindowId(partner.id);
                onSelect?.(partner.id);
              }}
              title={partner.businessName}
            >
              <div
                className={`flex flex-col items-center cursor-pointer transition-transform ${
                  isSelected ? "scale-110 z-20" : "hover:scale-105 z-10"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg ring-3 ring-white ${
                    isSelected
                      ? "bg-[#0B8B7F] ring-[#0B8B7F]/40"
                      : partner.score >= 90
                        ? "bg-[#0B8B7F]"
                        : "bg-[#C6A23A]"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                </span>
                <span
                  className={`mt-1 whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold shadow-xs border ${
                    isSelected
                      ? "bg-[#0B8B7F] text-white border-[#087C70]"
                      : "bg-white/95 text-[#173B38] border-gray-200"
                  }`}
                >
                  {partner.businessName} · {partner.score}%
                </span>
              </div>
            </AdvancedMarker>
          );
        })}

        {/* Active InfoWindow for Selected Partner */}
        {activeInfoWindowId &&
          (() => {
            const activePartner = partnersWithCoords.find((p) => p.id === activeInfoWindowId);
            if (!activePartner) return null;
            const isSelected = selectedId === activePartner.id;
            return (
              <InfoWindow
                position={activePartner.latLng}
                onCloseClick={() => setActiveInfoWindowId(null)}
              >
                <div className="p-1 max-w-[220px] text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-extrabold text-[#173B38] leading-tight">
                      {activePartner.businessName}
                    </p>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {activePartner.score}% Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 capitalize">
                    {activePartner.businessType} · {activePartner.distance} km away
                  </p>
                  {activePartner.capacity && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                      <Users className="h-3 w-3 text-emerald-600" />
                      Capacity: {activePartner.capacity} meals
                    </div>
                  )}
                  {activePartner.urgency && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                      <Clock3 className="h-3 w-3 text-amber-600" />
                      Urgency: {activePartner.urgency}
                    </div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onSelect?.(activePartner.id)}
                    className={`w-full mt-1.5 h-7 rounded-lg text-xs font-bold ${
                      isSelected
                        ? "bg-emerald-800 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Selected Destination
                      </>
                    ) : (
                      "Choose this NGO"
                    )}
                  </Button>
                </div>
              </InfoWindow>
            );
          })()}
      </Map>

      {/* Floating Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-md backdrop-blur border border-gray-200/80">
        <span className="flex items-center gap-1 font-bold text-[#174A57]">
          <span className="h-2 w-2 rounded-full bg-[#174A57]" /> You
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1 font-bold text-[#0B8B7F]">
          <span className="h-2 w-2 rounded-full bg-[#0B8B7F]" /> Best Matches
        </span>
      </div>
    </div>
  );
}

export function RealDiscoveryMap(props: RealDiscoveryMapProps) {
  return (
    <GoogleMapsProvider>
      <DiscoveryMapContent {...props} />
    </GoogleMapsProvider>
  );
}
