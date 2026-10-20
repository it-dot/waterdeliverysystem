"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, PolylineF } from "@react-google-maps/api";
import { Loader2, MapPin, Navigation, Phone, ExternalLink, Clock, Compass, CheckCircle2, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { DeliveryActions } from "@/components/rider/delivery-actions";
import type { DeliveryMapLocation } from "./MapWrapper";

const libraries: any[] = [];

export default function LeafletMap({
  locations = [],
  center = [8.9475, 125.5406],
  zoom = 13,
  riderLocation,
  activeDeliveryId,
}: {
  locations?: DeliveryMapLocation[];
  center?: [number, number];
  zoom?: number;
  riderLocation?: [number, number];
  activeDeliveryId?: string;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    id: "google-map-script",
  });

  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(activeDeliveryId || null);
  const [riderPos, setRiderPos] = useState<[number, number]>(riderLocation || center);
  const [routeCoords, setRouteCoords] = useState<Array<{ lat: number; lng: number }>>([]);
  const [routeStats, setRouteStats] = useState<{ distance: string; duration: string } | null>(null);
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Sync selectedId when activeDeliveryId prop changes
  useEffect(() => {
    if (activeDeliveryId) {
      setSelectedId(activeDeliveryId);
    }
  }, [activeDeliveryId]);

  // Request actual device GPS position if available
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setRiderPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.log("Device GPS unavailable, falling back to depot coordinates:", err.message);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Determine the active delivery destination
  const activeLoc = useMemo(() => {
    if (selectedId) {
      const match = locations.find((loc) => loc.id === selectedId);
      if (match) return match;
    }
    return locations.find((loc) => loc.isActiveRoute) || locations[0] || null;
  }, [locations, selectedId]);

  // Fit bounds helper to ensure both rider and destination are visible with room for HUD
  const fitBoundsToRoute = (coords: Array<{ lat: number; lng: number }>, origin: [number, number], dest: { lat: number; lng: number }) => {
    if (!mapRef.current || typeof window === "undefined" || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: origin[0], lng: origin[1] });
    bounds.extend({ lat: dest.lat, lng: dest.lng });
    coords.forEach((pt) => bounds.extend(pt));
    mapRef.current.fitBounds(bounds, { top: 60, right: 60, bottom: 150, left: 60 });
  };

  // Fetch real road driving route from OSRM
  useEffect(() => {
    if (!activeLoc) {
      setRouteCoords([]);
      setRouteStats(null);
      return;
    }

    let cancelled = false;
    setIsRouting(true);

    const originLng = riderPos[1];
    const originLat = riderPos[0];
    const destLng = activeLoc.lng;
    const destLat = activeLoc.lat;

    // Use free public OSRM driving engine for road-accurate polyline navigation
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setIsRouting(false);

        if (data.code === "Ok" && data.routes?.[0]) {
          const route = data.routes[0];
          const pts = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
            lat,
            lng,
          }));
          setRouteCoords(pts);
          setRouteStats({
            distance: `${(route.distance / 1000).toFixed(1)} km`,
            duration: `${Math.max(1, Math.round(route.duration / 60))} mins`,
          });
          fitBoundsToRoute(pts, riderPos, activeLoc);
        } else {
          // Fallback to straight line
          const direct = [
            { lat: originLat, lng: originLng },
            { lat: destLat, lng: destLng },
          ];
          setRouteCoords(direct);
          fitBoundsToRoute(direct, riderPos, activeLoc);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setIsRouting(false);
        console.warn("OSRM routing fallback:", err);
        const direct = [
          { lat: originLat, lng: originLng },
          { lat: destLat, lng: destLng },
        ];
        setRouteCoords(direct);
        fitBoundsToRoute(direct, riderPos, activeLoc);
      });

    return () => {
      cancelled = true;
    };
  }, [riderPos, activeLoc?.id, activeLoc?.lat, activeLoc?.lng]);

  const mapCenter = useMemo(
    () => ({
      lat: activeLoc?.lat || center[0],
      lng: activeLoc?.lng || center[1],
    }),
    [activeLoc, center]
  );

  const googleNavUrl = activeLoc
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeLoc.lat},${activeLoc.lng}&travelmode=driving`
    : "";

  // Reliable OpenStreetMap fallback if Google Maps API key has quota, billing, or network restrictions
  if (loadError) {
    return (
      <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-border/80 bg-muted/10">
        <iframe
          title="Delivery Route Map"
          width="100%"
          height="100%"
          className="w-full h-full border-0 min-h-[380px]"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.05}%2C${mapCenter.lat - 0.05}%2C${mapCenter.lng + 0.05}%2C${mapCenter.lat + 0.05}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`}
        />

        {/* Floating Navigation HUD */}
        {activeLoc && (
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-xl z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span className="size-2 rounded-full bg-blue-500 animate-ping" />
                <span>Active Route Destination</span>
              </div>
              {googleNavUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 bg-background"
                  onClick={() => window.open(googleNavUrl, "_blank")}
                >
                  <ExternalLink className="size-3" />
                  Google Maps
                </Button>
              )}
            </div>
            <div className="pt-2 text-left">
              <h4 className="font-bold text-sm text-foreground">{activeLoc.customerName || "Customer"}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{activeLoc.address}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20 min-h-[350px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 text-primary animate-spin" />
          <span className="text-xs font-medium text-muted-foreground">Loading route map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px]">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "inherit" }}
        center={mapCenter}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
          if (routeCoords.length > 0 && activeLoc) {
            fitBoundsToRoute(routeCoords, riderPos, activeLoc);
          }
        }}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          mapTypeId: "roadmap",
        }}
      >
        {/* Courier / Rider Location Marker */}
        <MarkerF
          position={{ lat: riderPos[0], lng: riderPos[1] }}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
          onClick={() => setActiveMarker("rider")}
        >
          {activeMarker === "rider" && (
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div className="p-1 font-semibold text-xs text-foreground">
                🚴 Courier / Rider Location
              </div>
            </InfoWindowF>
          )}
        </MarkerF>

        {/* Delivery Destinations */}
        {locations.map((loc) => {
          const isCurrent = activeLoc?.id === loc.id;
          return (
            <MarkerF
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              onClick={() => {
                setSelectedId(loc.id);
                setActiveMarker(loc.id);
              }}
              icon={{
                url: isCurrent
                  ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            >
              {activeMarker === loc.id && (
                <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                  <div className="p-1.5 text-xs text-left max-w-[220px]">
                    <p className="font-bold text-foreground">{loc.customerName || loc.title}</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-2">
                      {loc.address}
                    </p>
                    {isCurrent ? (
                      <span className="inline-block mt-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200">
                        ⚡ Active Delivery Route
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedId(loc.id)}
                        className="mt-1.5 text-[10px] font-semibold text-primary underline block cursor-pointer"
                      >
                        Switch Route to this Stop
                      </button>
                    )}
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          );
        })}

        {/* Dual Polyline Route for enhanced visibility */}
        {routeCoords.length > 0 && (
          <>
            {/* Thicker Outer Glow Line */}
            <PolylineF
              path={routeCoords}
              options={{
                strokeColor: "#1d4ed8",
                strokeWeight: 7,
                strokeOpacity: 0.45,
                zIndex: 1,
              }}
            />
            {/* Core Vibrant Route Line */}
            <PolylineF
              path={routeCoords}
              options={{
                strokeColor: "#2563eb",
                strokeWeight: 4,
                strokeOpacity: 0.95,
                zIndex: 2,
              }}
            />
          </>
        )}
      </GoogleMap>

      {/* Floating Active Delivery Route HUD */}
      {activeLoc && (
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-xl z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/60">
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2.5 bg-blue-600"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Active Delivery Route
              </span>
            </div>

            {/* Live Distance & ETA Pill */}
            {isRouting ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                <Loader2 className="size-3 animate-spin" />
                Routing...
              </span>
            ) : routeStats ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-500/20">
                <Clock className="size-3" />
                {routeStats.duration} ({routeStats.distance})
              </span>
            ) : null}
          </div>

          {/* Customer & Address Details */}
          <div className="pt-2.5 text-left space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-bold text-sm sm:text-base text-foreground truncate">
                {activeLoc.customerName || "Customer Destination"}
              </h4>
              {activeLoc.amount ? (
                <span className="text-xs font-mono font-bold text-foreground shrink-0">
                  ₱{activeLoc.amount.toFixed(2)}
                </span>
              ) : null}
            </div>

            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-relaxed">{activeLoc.address}</span>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {googleNavUrl && (
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs text-xs"
                  onClick={() => window.open(googleNavUrl, "_blank")}
                >
                  <Navigation className="size-3.5" />
                  Turn-by-Turn GPS
                </Button>
              )}
              {activeLoc.phone && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs shadow-xs"
                  onClick={() => window.open(`tel:${activeLoc.phone}`)}
                >
                  <Phone className="size-3 text-emerald-600" />
                  Call
                </Button>
              )}
            </div>

            {/* Quick Status Actions (Mark Delivered) */}
            <DeliveryActions
              deliveryId={activeLoc.id}
              status={activeLoc.status || "in-transit"}
              address={activeLoc.rawAddress}
            />
          </div>
        </div>
      )}
    </div>
  );
}
