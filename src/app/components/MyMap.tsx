"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN_API } from "@/../../secretes.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchPins } from './Pins';

mapboxgl.accessToken = MAPBOX_TOKEN_API;
const INITIAL_CENTER = [-117.3506, 33.1581];
const INITIAL_ZOOM = 9.12;

type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  meetupname: string;
  description: string;
};

export default function MyMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          setCenter(userLocation);
          setZoom(12);
        },
        (error) => {
          console.error('Error fetching user location:', error);
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const getPins = async () => {
      try {
        const fetchedPins = await fetchPins();
        console.log('Fetched pins:', fetchedPins); // Debugging log
        setPins(fetchedPins);
      } catch (error) {
        console.error('Error fetching pins:', error);
      }
    };

    getPins();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center as [number, number],
      zoom: zoom,
      style: 'mapbox://styles/mapbox/outdoors-v11',
    });

    mapRef.current.on('load', () => {
      mapRef.current?.resize();

      pins.forEach((pin) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([pin.longitude, pin.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 5 }).setHTML(`
              <div class="bg-white p-4 rounded-2xl border-slate-400 border-2 shadow-lg shadow-zinc-700">
                <h6 class="hidden">${pin.id}</h6>
                <h3 class="text-2xl font-bold text-upinGreen mb-2 break-words">${pin.meetupname}</h3>
                <p class="text-sm text-gray-600 leading-tight whitespace-normal mb-3 break-words">${pin.description}</p>
                <div class="flex justify-between items-center">
                  <button class="text-upinGreen hover:underline text-sm font-semibold" data-pin-id="${pin.id}">View More</button>
                </div>
              </div>`
            )
          )
          .addTo(mapRef.current!);
      });

      mapRef.current?.on('move', () => {
        const mapCenter = mapRef.current!.getCenter();
        const mapZoom = mapRef.current!.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [pins, center, zoom]);

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER as [number, number],
      zoom: INITIAL_ZOOM,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen min-h-screen bg-gradient-to-r from-green-200 via-yellow-100 to-orange-200">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full md:w-3/4">
        <div className="sidebar bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
        <div
          className="h-[40rem] w-full rounded-lg shadow-2xl overflow-hidden relative"
          ref={mapContainerRef}
        />
        <button onClick={handleButtonClick} className="mt-4 p-2 bg-blue-500 text-white rounded">
          Reset View
        </button>
      </div>
    </div>
  );
}