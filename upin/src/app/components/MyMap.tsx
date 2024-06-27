"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from "@mapbox/search-js-react";
import { MAPBOX_TOKEN_API } from "@/../../secretes.js";
import EventMarker from './EventMarker';

const accessToken = MAPBOX_TOKEN_API;
mapboxgl.accessToken = accessToken;

interface MyMapProps {
  lng: number;
  lat: number;
}

export default function MyMap({ lng, lat }: MyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 9,
    });

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });
  }, [lng, lat]);

  const handleSearchChange = (result: any) => {
    if (result && result.center) {
      const [newLng, newLat] = result.center;
      setInputValue(result.place_name);
      mapInstanceRef.current!.flyTo({ center: [newLng, newLat], zoom: 9 });
    }
  };

  return (
    <div>
      {mapLoaded && (
        <>
          <SearchBox
            accessToken={accessToken}
            map={mapInstanceRef.current!}
            mapboxgl={mapboxgl}
            onResult={handleSearchChange}
            marker={false}
          />
          <EventMarker 
            lat={33.1438} 
            lng={-117.1671} 
            title={"Test1"} 
            description={"This is a test"} 
            map={mapInstanceRef.current!} 
          />
        </>
      )}
      <div ref={mapContainerRef} className="w-full h-[35rem]" />
    </div>
  );
}
