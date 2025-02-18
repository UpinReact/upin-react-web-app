"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { throttle, debounce } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from 'utils/supabase/client'

// Type definitions
type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  meetupname: string;
  description: string;
};

// Map configuration
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const INITIAL_CENTER: [number, number] = [-117.3506, 33.1581];
const INITIAL_ZOOM = 9.12;



export default function MyMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [pins, setPins] = useState<Pin[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCenter(newCenter);
          setZoom(12);
          mapRef.current?.flyTo({ center: newCenter });
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  // Fetch pins from Supabase
  useEffect(() => {
    const supabase = createClient();
    
    const fetchPins = async () => {
      try {
        const { data, error } = await supabase
          .from('pins')
          .select('*')
          .limit(100);

        if (error) throw error;
        setPins(data || []);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };

    fetchPins();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) {
      console.error("Map container is missing. Check your DOM.");
      return;
    }
  
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center,
      zoom,
      style: "mapbox://styles/mapbox/outdoors-v11",
    });
  
    mapRef.current = map;
  
    console.log("Map initialized:", mapRef.current);
  
    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);
  

  // Update map markers when pins change
  useEffect(() => {
    if (!mapRef.current || !pins.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    pins.forEach((pin) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const webLink = `/pin/${pin.id}`;
      const appLink = `upin://pin/${pin.id}`;
    
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="bg-white p-4 rounded-2xl border-slate-400 border-2 shadow-lg shadow-zinc-700 max-w-xs">
          <h3 class="text-xl font-bold text-upinGreen mb-2">${pin.meetupname}</h3>
          <p class="text-sm text-gray-600 mb-3">${pin.description}</p>
          <a href="${webLink}" 
             ${isMobile ? `onclick="handleAppDeepLink(event, '${appLink}', '${webLink}')"` : ''}
             class="text-upinGreen hover:underline font-semibold">
            View Details
          </a>
        </div>
      `);
      

      const marker = new mapboxgl.Marker()
        .setLngLat([pin.longitude, pin.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [pins]);

  // Map movement handlers
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMove = () => {
      const map = mapRef.current!;
      setCenter([map.getCenter().lng, map.getCenter().lat]);
      setZoom(map.getZoom());
    };

    const throttledMove = throttle(handleMove, 200);
    const debouncedMove = debounce(handleMove, 500);

    mapRef.current.on('move', throttledMove);
    mapRef.current.on('moveend', debouncedMove);

    return () => {
      mapRef.current?.off('move', throttledMove);
      mapRef.current?.off('moveend', debouncedMove);
    };
  }, []);
   

  return (
    <div className="relative bg-gradient-to-t from-upinGreen to-green-900 p-12 text-white min-h-screen">
      <div 
        className="absolute inset-0 -z-10 opacity-50 bg-cover bg-center" 
        style={{ backgroundImage: "url('/locationBg.jpg')" }}
      />

      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-extrabold drop-shadow-lg">
          Discover Pins Near You
        </h1>
        <p className="text-lg">
          Explore meetups, events, and communities nearby
        </p>
      </div>

      <div className="flex items-center justify-center my-10">
        <div 
          ref={mapContainerRef}
          className="relative w-full h-[40rem] rounded-xl shadow-lg border-4 border-white overflow-hidden"
        />
      </div>

      <div className="text-center bg-gray-100 p-4 rounded-xl shadow-inner">
        <p className="text-black mb-2">
          Longitude: {center[0].toFixed(4)} | 
          Latitude: {center[1].toFixed(4)} | 
          Zoom: {zoom.toFixed(2)}
        </p>
        <button
          onClick={() => mapRef.current?.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM })}
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
