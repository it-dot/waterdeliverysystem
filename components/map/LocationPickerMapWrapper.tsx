"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicLocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center bg-muted/20 rounded-md border">
      <Loader2 className="size-8 text-primary animate-spin" />
    </div>
  ),
});

export function LocationPickerMapWrapper({
  defaultLocation,
  initialPinnedLocation,
  onLocationSelect,
}: {
  defaultLocation?: [number, number];
  initialPinnedLocation?: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
}) {
  return <DynamicLocationPickerMap defaultLocation={defaultLocation} initialPinnedLocation={initialPinnedLocation} onLocationSelect={onLocationSelect} />;
}
