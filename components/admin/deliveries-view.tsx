"use client";

import { useState } from "react";
import { DeliveriesTable } from "./deliveries-table";
import { MapWrapper } from "@/components/map/MapWrapper";
import { List, MapPin } from "lucide-react";

export function DeliveriesView({ deliveries }: { deliveries: any[] }) {
  const [view, setView] = useState<"table" | "map">("table");

  // Create mock locations based on deliveries since we don't have real lat/lng in the DB
  const locations = deliveries.map((d) => ({
    id: d.id,
    lat: 8.9475 + (Math.random() - 0.5) * 0.05,
    lng: 125.5406 + (Math.random() - 0.5) * 0.05,
    title: `Order: ${d.orders?.id?.slice(0, 8) || 'Unknown'} - Status: ${d.status}`
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setView("table")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="size-4" />
            Table View
          </button>
          <button
            onClick={() => setView("map")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "map" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="size-4" />
            Map View
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card shadow-sm mt-2 overflow-hidden">
        {view === "table" ? (
          <DeliveriesTable deliveries={deliveries} />
        ) : (
          <div className="h-[600px] w-full relative z-0">
            <MapWrapper locations={locations} center={[8.9475, 125.5406]} zoom={12} />
          </div>
        )}
      </div>
    </div>
  );
}
