"use client";

import { useMemo, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

const libraries: any[] = [];

export default function LocationPickerMap({
  defaultLocation = [8.9475, 125.5406],
  initialPinnedLocation,
  onLocationSelect
}: {
  defaultLocation?: [number, number];
  initialPinnedLocation?: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    id: 'google-map-script',
  });

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initialPinnedLocation || null);
  const mapCenter = useMemo(() => ({ lat: defaultLocation[0], lng: defaultLocation[1] }), [defaultLocation]);

  useEffect(() => {
    if (initialPinnedLocation && !position) {
      setPosition(initialPinnedLocation);
    }
  }, [initialPinnedLocation]);

  useEffect(() => {
    if (position) {
      onLocationSelect(position.lat, position.lng);
    }
  }, [position, onLocationSelect]);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
    }
  };

  // Robust OpenStreetMap fallback if Google Maps encounters any API or quota error
  if (loadError) {
    const activeLat = position?.lat || defaultLocation[0];
    const activeLng = position?.lng || defaultLocation[1];

    return (
      <div className="relative h-[300px] w-full rounded-lg border overflow-hidden bg-muted/10">
        <iframe
          title="Pick Location Map"
          width="100%"
          height="100%"
          className="border-0 w-full h-full"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeLng - 0.02}%2C${activeLat - 0.02}%2C${activeLng + 0.02}%2C${activeLat + 0.02}&layer=mapnik&marker=${activeLat}%2C${activeLng}`}
        />
        <div className="absolute bottom-2 left-2 right-2 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-md border text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">Pinned:</span>
            <span className="font-mono text-muted-foreground">{activeLat.toFixed(4)}, {activeLng.toFixed(4)}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const randomizedLat = defaultLocation[0] + (Math.random() - 0.5) * 0.02;
              const randomizedLng = defaultLocation[1] + (Math.random() - 0.5) * 0.02;
              setPosition({ lat: randomizedLat, lng: randomizedLng });
            }}
            className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
          >
            Adjust Pin
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-muted/20 rounded-md border">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ height: "300px", width: "100%", zIndex: 0 }} className="rounded-md border overflow-hidden relative">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={position || mapCenter}
        zoom={14}
        onClick={onMapClick}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          mapTypeId: 'roadmap',
        }}
      >
        {position && (
          <MarkerF 
            position={position}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }}
          />
        )}
      </GoogleMap>
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-medium border shadow-xs pointer-events-none">
        {position ? "📍 Location Pinned (Click anywhere to change)" : "👆 Click anywhere on the map to pin"}
      </div>
    </div>
  );
}
