"use client";

import { useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, PolylineF } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import React from "react";

const libraries: any[] = [];

export default function LeafletMap({
  locations = [],
  center = [8.9475, 125.5406],
  zoom = 12,
  riderLocation,
}: {
  locations?: Array<{ id: string; lat: number; lng: number; title: string; isActiveRoute?: boolean }>;
  center?: [number, number];
  zoom?: number;
  riderLocation?: [number, number];
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    id: 'google-map-script',
  });

  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const activeLoc = locations.find(loc => loc.isActiveRoute);
  const mapCenter = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);

  // Reliable OpenStreetMap fallback if Google Maps API key has quota, billing, or network restrictions
  if (loadError) {
    return (
      <div className="relative w-full h-full min-h-[350px] rounded-xl overflow-hidden border border-border/80 bg-muted/10">
        <iframe
          title="Delivery Route Map"
          width="100%"
          height="100%"
          className="w-full h-full border-0 min-h-[350px]"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${center[1] - 0.05}%2C${center[0] - 0.05}%2C${center[1] + 0.05}%2C${center[0] + 0.05}&layer=mapnik&marker=${center[0]}%2C${center[1]}`}
        />
        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm flex items-center gap-2">
          <MapPin className="size-3.5 text-primary" />
          <span>Interactive Map • {locations.length} Active Stop{locations.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        mapTypeId: 'roadmap',
      }}
    >
      {/* Render Rider / Courier Location */}
      {riderLocation && (
        <MarkerF
          position={{ lat: riderLocation[0], lng: riderLocation[1] }}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
          onClick={() => setActiveMarker('rider')}
        >
          {activeMarker === 'rider' && (
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div className="p-1 font-semibold text-xs text-foreground">
                🚴 Courier / Rider Location
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      )}

      {/* Render Delivery Destinations */}
      {locations.map((loc) => (
        <MarkerF
          key={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          onClick={() => setActiveMarker(loc.id)}
          icon={{
            url: loc.isActiveRoute
              ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        >
          {activeMarker === loc.id && (
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div className="p-1 text-xs">
                <p className="font-bold text-foreground">{loc.title}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}
                </p>
                {loc.isActiveRoute && (
                  <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    Active Delivery Route
                  </span>
                )}
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}

      {/* Direct Delivery Route Polyline */}
      {riderLocation && activeLoc && (
        <PolylineF
          path={[
            { lat: riderLocation[0], lng: riderLocation[1] },
            { lat: activeLoc.lat, lng: activeLoc.lng }
          ]}
          options={{
            strokeColor: "#2563eb",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            geodesic: true,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3,
                strokeColor: '#1d4ed8'
              },
              offset: '0',
              repeat: '18px'
            }],
          }}
        />
      )}
    </GoogleMap>
  );
}
