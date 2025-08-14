"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { throttle, debounce } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from 'utils/supabase/client'
import yellowPin from "public/yellowpin.png"
import greenPin from "public/greenpin.png"
import redPin from "public/redpin.png"
import SmartSearchBar from "./SmartSearchBar"

// Type definitions
type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  meetupname: string;
  description: string;
  end_date: string
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
  // Fetch pins within a 50-mile radius
useEffect(() => {
  const supabase = createClient();

const R = 3960; // Earth's radius in miles
const latDiff = 25 / R * (180 / Math.PI);
const lngDiff = 25 / (R * Math.cos(center[1] * (Math.PI / 180))) * (180 / Math.PI);

const fetchPins = async () => {
  try {
    const { data, error } = await supabase
      .from("pins")
      .select("*")
      .gte("end_date", new Date().toISOString())
      .gte("latitude", center[1] - latDiff)
      .lte("latitude", center[1] + latDiff)
      .gte("longitude", center[0] - lngDiff)
      .lte("longitude", center[0] + lngDiff)
      .gte("end_date", new Date().toISOString())
      .limit(100);

    if (error) throw error;
    setPins(data || []);
  } catch (error) {
    console.error("Error fetching pins:", error);
  }
};


  fetchPins(); // Fetch only when user location is available
}, [center]);


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
    // Determine pin color based on expiration date
    const now = new Date();
    const endDate = new Date(pin.end_date);
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let pinImage = greenPin; // Default: green
    if (diffDays <= 1) pinImage = redPin; // Expires today, tomorrow, or already expired
    else if (diffDays <= 3) pinImage = yellowPin; // 2-3 days left

// Determine link based on device type
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


let link = isMobile ? `upin://pin/${pin.id}` : `/pin/${pin.id}`;


function openLink(e: React.MouseEvent<HTMLAnchorElement>, pinId){
  e.preventDefault()
// Try opening the deep link only on mobile
if (isMobile) {
  const newTab = window.open(link, "_blank");

  // Check if the deep link failed after a short delay
  setTimeout(() => {
    if (!newTab || newTab.closed || newTab.location.href === "about:blank") {
      // Deep link failed, fallback to the web link
      window.location.href = `/pin/${pinId}`;
    }
  }, 500); // Adjust the delay as needed
} 
}


    // Create a custom pin element
    const pinElement = document.createElement("div");
    pinElement.className = "w-8 h-8"; // Adjust size if needed

    // Add an image inside the custom marker
    const img = document.createElement("img");
    img.src = pinImage.src; // Use the correct pin color
    img.alt = "Pin";
    img.className = "w-full h-full"; // Ensure it fills the container

    pinElement.appendChild(img);
    

    const marker = new mapboxgl.Marker(pinElement)
      .setLngLat([pin.longitude, pin.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="bg-white p-4 rounded-2xl border-gray-400 border-2 shadow-lg">
            <h3 class="text-xl font-bold text-upinGreen mb-2">${pin.meetupname}</h3>
            <p class="text-sm text-gray-600 mb-3">${pin.description}</p>
             
            <a href="${link}"  class="text-upinGreen hover:underline font-semibold">
            View Details
          </a>
           
          </div>
        `)
      )
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
        <SmartSearchBar />
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
      <div className="flex justify-center mt-4 space-x-6">
  <div className="flex items-center space-x-2">
    <img src="/greenpin.png" alt="Green Pin" className="w-6 h-6" />
    <span>3+ days left</span>
  </div>
  <div className="flex items-center space-x-2">
    <img src="/yellowpin.png" alt="Yellow Pin" className="w-6 h-6" />
    <span>2-3 days left</span>
  </div>
  <div className="flex items-center space-x-2">
    <img src="/redpin.png" alt="Red Pin" className="w-6 h-6" />
    <span>Expires today</span>
  </div>
</div>

      {/* <div className="text-center bg-gray-100 p-4 rounded-xl shadow-inner">
        {/* <p className="text-black mb-2">
          Longitude: {center[0].toFixed(4)} | 
          Latitude: {center[1].toFixed(4)} | 
          Zoom: {zoom.toFixed(2)}
        </p> */}
        {/* <button
          onClick={() => mapRef.current?.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM })}
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Reset View
        </button> */}
      {/* </div>  */}
    </div>
  );
}
