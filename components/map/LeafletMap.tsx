"use client";

import { useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsService, DirectionsRenderer, InfoWindowF, PolylineF } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const libraries: any[] = ["places"];

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
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  const fetchedRouteRef = React.useRef("");
  
  const activeLoc = locations.find(loc => loc.isActiveRoute);
  const currentRouteKey = activeLoc && riderLocation 
    ? `${riderLocation[0]},${riderLocation[1]}-${activeLoc.lat},${activeLoc.lng}` 
    : "";

  const mapCenter = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);

  if (loadError) return <div className="p-4 text-red-500">Error loading Google Maps</div>;
  if (!isLoaded) return (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <Loader2 className="size-8 text-primary animate-spin" />
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        mapTypeId: 'hybrid'
      }}
    >
      {/* Render Rider Location */}
      {riderLocation && (
        <MarkerF
          position={{ lat: riderLocation[0], lng: riderLocation[1] }}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
          onClick={() => setActiveMarker('rider')}
        >
          {activeMarker === 'rider' && (
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div>You are here (Rider)</div>
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
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        >
          {activeMarker === loc.id && (
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div className="font-semibold text-gray-800">{loc.title}</div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}

      {/* Render Routes */}
      {riderLocation && activeLoc && fetchedRouteRef.current !== currentRouteKey && (
        <DirectionsService
          options={{
            origin: { lat: riderLocation[0], lng: riderLocation[1] },
            destination: { lat: activeLoc.lat, lng: activeLoc.lng },
            travelMode: google.maps.TravelMode.DRIVING,
          }}
          callback={(res, status) => {
            if (status === "OK" && res) {
              fetchedRouteRef.current = currentRouteKey;
              setDirections(res);
            } else {
              console.error("Directions request failed:", status);
              fetchedRouteRef.current = currentRouteKey;
            }
          }}
        />
      )}

      {directions ? (
        <DirectionsRenderer
          options={{
            directions: directions,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#3b82f6",
              strokeOpacity: 0.8,
              strokeWeight: 6,
            }
          }}
        />
      ) : (
        // Fallback straight line if directions haven't loaded or failed
        riderLocation && activeLoc && (
          <PolylineF
            key={`fallback-route-${activeLoc.id}`}
            path={[
              { lat: riderLocation[0], lng: riderLocation[1] },
              { lat: activeLoc.lat, lng: activeLoc.lng }
            ]}
            options={{
              strokeColor: "#3b82f6",
              strokeOpacity: 0.8,
              strokeWeight: 5,
              icons: [{
                icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                offset: '0',
                repeat: '20px'
              }],
            }}
          />
        )
      )}
    </GoogleMap>
  );
}
