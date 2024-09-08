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
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [lng, lat],
      zoom: 9,
    });

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lng, lat]);

  const handleSearchChange = (result: any) => {
    if (result && result.center) {
      const [newLng, newLat] = result.center;
      setInputValue(result.place_name);
      mapInstanceRef.current!.flyTo({ center: [newLng, newLat], zoom: 9});
    }
  };

  return (
    <div className='bg-gray-400 backdrop-filter backdrop-blur-xl bg-opacity-30'>
      <div className='w-[75%] mx-auto border place-content-center rounded-3xl'>
    {mapLoaded && (
      <>
        <div>
          <SearchBox
            accessToken={accessToken}
            map={mapInstanceRef.current!}
            mapboxgl={mapboxgl} 
            onResult={handleSearchChange}
            marker={false}
          />  
        </div>
        <EventMarker 
          lat={lat} 
          lng={lng} 
          title={"San Marcos"} 
          description={"San Marcos, Ca"} 
          map={mapInstanceRef.current} 
        /> 
      </>
    )}
    <div ref={mapContainerRef} className="w-full h-[35rem] bg-black" />
  </div>
</div>

  );
}
