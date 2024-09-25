"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN_API } from "@/../../secretes.js";
import Pins from './Pins';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = MAPBOX_TOKEN_API;
const INITIAL_CENTER = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

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
      style: 'mapbox://styles/mapbox/outdoors-v12', // Choose a Mapbox style
    });

    // Wait for the map to load before adding markers
    mapRef.current.on('load', () => {
      mapRef.current?.resize();

      // Add markers for the pins
      pins.forEach((pin) => {
        new mapboxgl.Marker()
          .setLngLat([pin.longitude, pin.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
`<div class="bg-white p-3 rounded-lg shadow-lg w-60"> <!-- Add a width to control the size -->
          <h3 class="text-lg font-bold text-upinGreen break-words">${pin.meetupname}</h3>
          <p class="text-gray-500 whitespace-normal break-words">${pin.description}</p>
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
    <div>
      {/* Ensures full viewport height */}
      <button onClick={handleButtonClick}>Reset</button>
      <div className="sidebar bg-white" style={{ height: '100%' }}>
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <div
        className="h-screen w-3/4 absolute left-0 top-15 bg-gray-400"
        ref={mapContainerRef}
      />
    </div>
  );
}



