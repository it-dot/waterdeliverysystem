"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the map to prevent SSR issues with Leaflet
const DynamicMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <Loader2 className="size-8 text-primary animate-spin" />
    </div>
  ),
});

export function MapWrapper({
  locations,
  center,
  zoom,
  riderLocation,
}: {
  locations?: Array<{ id: string; lat: number; lng: number; title: string; isActiveRoute?: boolean }>;
  center?: [number, number];
  zoom?: number;
  riderLocation?: [number, number];
}) {
  return <DynamicMap locations={locations} center={center} zoom={zoom} riderLocation={riderLocation} />;
}
