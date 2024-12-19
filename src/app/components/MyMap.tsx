"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { throttle, debounce } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchPins } from "./Pins";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
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
          console.error("Error fetching user location:", error);
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
        console.log("Fetched pins:", fetchedPins);
        setPins(fetchedPins);
      } catch (error) {
        console.error("Error fetching pins:", error);
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
      style: "mapbox://styles/mapbox/outdoors-v11",
    });

    mapRef.current.on("load", () => {
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

      const throttledUpdate = throttle((map: mapboxgl.Map) => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      }, 200);

      const debouncedUpdate = debounce((map: mapboxgl.Map) => {
        const mapCenter = map.getCenter();
        const mapZoom = map.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      }, 500);

      const onMoveEnd = () => {
        throttledUpdate(mapRef.current!);
        debouncedUpdate(mapRef.current!);
      };

      mapRef.current?.on("moveend", onMoveEnd);

      return () => {
        mapRef.current?.flyTo({
          center: INITIAL_CENTER as [number, number],
          zoom: INITIAL_ZOOM,
        });
      };
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
    <div className="relative bg-gradient-to-t from-upinGreen to-green-900 p-12 text-white min-h-screen">
      {/* Background Overlay */}
      <div className="absolute inset-0 -z-10 opacity-50 bg-cover bg-center" style={{ backgroundImage: "url('/locationBg.jpg')" }}></div>

      {/* Header Section */}
      <div className="text-center text-white space-y-4">
        <h1 className="text-4xl font-extrabold drop-shadow-lg">Discover Pins Near You</h1>
        <p className="text-lg">Explore meetups, events, and communities nearby.</p>
      </div>

      {/* Map Section */}
      <div className="flex items-center justify-center my-10">
        <div
          className="relative w-full h-[40rem] rounded-xl shadow-lg border-4 border-white overflow-hidden"
          ref={mapContainerRef}
        />
      </div>

      {/* Sidebar Section */}
      <div className="text-center bg-gray-100 p-4 rounded-xl shadow-inner">
        <p>
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </p>
        <button
          onClick={handleButtonClick}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
