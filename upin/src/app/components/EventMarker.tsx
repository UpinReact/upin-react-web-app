import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MarkerProps {
  lat: number;
  lng: number;
  title: string;
  description: string;
  map: mapboxgl.Map | null;
}

const EventMarker: React.FC<MarkerProps> = ({ lat, lng, title, description, map }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && map && !markerRef.current) {
      const el = document.createElement('div');
      el.className = 'marker bg-red-500 w-5 h-5 rounded-full cursor-pointer z-10';
      // el.style.zIndex = '9999';

      el.addEventListener('click', () => {
        alert(`${title}: ${description}`);
      });

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map);
    }

    // Clean up marker on component unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, lat, lng, title, description]);

  return null;
};

export default EventMarker;
