"use client";

import { useMemo, useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const libraries: any[] = ["places"];

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

  const [position, setPosition] = useState<{lat: number, lng: number} | null>(initialPinnedLocation || null);
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

  if (loadError) return <div className="p-4 text-red-500">Error loading Google Maps</div>;
  if (!isLoaded) return (
    <div className="flex h-[300px] w-full items-center justify-center bg-muted/20 rounded-md border">
      <Loader2 className="size-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div style={{ height: "300px", width: "100%", zIndex: 0 }} className="rounded-md border overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={position || mapCenter}
        zoom={13}
        onClick={onMapClick}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          mapTypeId: 'hybrid'
        }}
      >
        {position && (
          <MarkerF position={position} />
        )}
      </GoogleMap>
    </div>
  );
}
