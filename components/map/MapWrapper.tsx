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

export type DeliveryMapLocation = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  customerName?: string;
  phone?: string;
  address?: string;
  rawAddress?: string;
  orderId?: string;
  amount?: number;
  paymentMethod?: string;
  status?: string;
  isActiveRoute?: boolean;
};

export function MapWrapper({
  locations,
  center,
  zoom,
  riderLocation,
  activeDeliveryId,
}: {
  locations?: DeliveryMapLocation[];
  center?: [number, number];
  zoom?: number;
  riderLocation?: [number, number];
  activeDeliveryId?: string;
}) {
  return (
    <DynamicMap
      locations={locations}
      center={center}
      zoom={zoom}
      riderLocation={riderLocation}
      activeDeliveryId={activeDeliveryId}
    />
  );
}
