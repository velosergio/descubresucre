"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsApi } from "@/lib/load-google-maps";

export type MapPin = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  color: string;
};

const DEFAULT_CENTER = { lat: 9.45, lng: -75.5 };

export function GoogleDestinationsMap({
  apiKey,
  destinations,
  selectedId,
  onSelect,
}: {
  apiKey: string;
  destinations: MapPin[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [mapReady, setMapReady] = useState(false);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    async function init() {
      await loadGoogleMapsApi(apiKey);
      if (cancelled || !host) return;
      mapRef.current = new google.maps.Map(host, {
        center: DEFAULT_CENTER,
        zoom: 9,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: "cooperative",
      });
      setMapReady(true);
    }

    void init();
    return () => {
      cancelled = true;
      setMapReady(false);
      mapRef.current = null;
    };
  }, [apiKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    for (const marker of markersRef.current.values()) {
      marker.setMap(null);
    }
    markersRef.current.clear();

    const bounds = new google.maps.LatLngBounds();
    for (const dest of destinations) {
      const marker = new google.maps.Marker({
        map,
        position: { lat: dest.lat, lng: dest.lng },
        title: dest.name,
        animation: dest.id === selectedId ? google.maps.Animation.BOUNCE : null,
      });
      marker.addListener("click", () => {
        onSelectRef.current(dest.id);
      });
      markersRef.current.set(dest.id, marker);
      bounds.extend({ lat: dest.lat, lng: dest.lng });
    }

    const selected = destinations.find((d) => d.id === selectedId);
    if (selected) {
      map.panTo({ lat: selected.lat, lng: selected.lng });
      map.setZoom(12);
      return;
    }
    if (destinations.length === 0) {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(9);
      return;
    }
    map.fitBounds(bounds, 48);
  }, [destinations, mapReady, selectedId]);

  return (
    <div ref={hostRef} role="application" aria-label="Mapa de Sucre" className="h-full w-full" />
  );
}
