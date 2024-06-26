"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from "@mapbox/search-js-react";
import {MAPBOX_TOKEN_API} from "@/../../secretes.js"

const accessToken =  MAPBOX_TOKEN_API
mapboxgl.accessToken = accessToken;

interface MyMapProps {
  lng: number,
  lat: number
}

export default function MyMap({ lng, lat }: MyMapProps) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (typeof window === null || mapInstanceRef.current) return; // Check if window is defined and map is not already initialized

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    markerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapInstanceRef.current);

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });
  }, [lng, lat]);

  const handleSearchChange = (result) => {
    if (result && result.center) {
      const [newLng, newLat] = result.center;
      setInputValue(result.place_name);
      mapInstanceRef.current.flyTo({ center: [newLng, newLat], zoom: 9 });
      markerRef.current.setLngLat([newLng, newLat]);
    }
  };

  return (
    <div>
      {mapLoaded && (
        <SearchBox
          accessToken={accessToken}
          map={mapInstanceRef.current}
          mapboxgl={mapboxgl}
          onResult={handleSearchChange}
          marker={true} // Disable default marker to use custom marker
        />
      )}
      <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
}
