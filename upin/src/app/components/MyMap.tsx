"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN_API } from "@/../../secretes.js";
import Pins from './Pins';
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from 'framer-motion';



mapboxgl.accessToken = MAPBOX_TOKEN_API;
const INITIAL_CENTER = [-117.3506,33.1581 ];
const INITIAL_ZOOM = 9.12;

type Pin = {
  latitude: number;
  longitude: number;
  meetupname: string;
  description: string;
};

export default function MyMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null); // Typing for map instance
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Typing for map container
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [pins, setPins] = useState<Pin[]>([]);

  

  // Fetch pins from database
  useEffect(() => {
    const getPins = async () => {
      const fetchedPins = await Pins(); // Fetch pins from Supabase
      setPins(fetchedPins); // Update state with fetched pins
    };

    getPins(); // Call the function to fetch pins once

    // Add an empty dependency array to ensure this useEffect runs once when component mounts
  }, []);

  // Set up the map and markers
  useEffect(() => {
    if (!mapContainerRef.current) return; // Ensure the container exists

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center as [number, number],
      zoom: zoom,
      style: 'mapbox://styles/mapbox/outdoors-v11', // Choose a Mapbox style
    });

    // Wait for the map to load before adding markers
    mapRef.current.on('load', () => {
      mapRef.current?.resize();

      // Add markers for the pins
      pins.forEach((pin) => {
        new mapboxgl.Marker()
          .setLngLat([pin.longitude, pin.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 5 }).setHTML(
        `<div class="bg-white p-4 rounded-2xl border-slate-400 border-2 shadow-lg shadow-zinc-700">
            <h3 class="text-2xl font-bold text-upinGreen mb-2 break-words">${pin.meetupname}</h3>
            <p class="text-sm text-gray-600 leading-tight whitespace-normal mb-3 break-words">${pin.description}</p>
            <div class="flex justify-between items-center">
              <a href="#" class="text-upinGreen hover:underline text-sm font-semibold">View More</a>
              <button class="bg-upinGreen text-white px-3 py-1 rounded-full text-xs hover:bg-opacity-80 focus:outline-none">
                Join
              </button>
            </div>
          </div>`
              )
          )
          .addTo(mapRef.current!);
      });
    });

    // Move event to update center and zoom state
    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current!.getCenter();
      const mapZoom = mapRef.current!.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    // Clean up the map on unmount
    return () => {
      mapRef.current?.remove();
    };
  }, [pins]); // Add pins as a dependency to update markers when pins are fetched

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
    });
  };




  return (
    <div className="flex items-center justify-center h-screen min-h-screen bg-gradient-to-r from-green-200 via-yellow-100 to-orange-200">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4">
        <div className="sidebar bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
  
        <div
          className="h-[40rem]  w-full rounded-lg shadow-2xl overflow-hidden relative"
          ref={mapContainerRef}
        />
      </div>
    </div>
  );
}

