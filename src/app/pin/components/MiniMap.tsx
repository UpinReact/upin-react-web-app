// app/pin/components/MiniMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import styles from '../[id]/PinPage.module.css';

// We'll use dynamic import to load Leaflet only on client side
let L: any = null;

interface MiniMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export default function MiniMap({ latitude, longitude, locationName }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Only load and initialize map on client side
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Dynamically import Leaflet
      if (!L) {
        L = (await import('leaflet')).default;
        
        // Import Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      }

      // Initialize map
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 15,
          zoomControl: false,
          dragging: true,
          touchZoom: true,
          doubleClickZoom: true,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
          attributionControl: false
        });

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add marker
        const marker = L.marker([latitude, longitude]).addTo(map);
        
        // Add popup with location name
        if (locationName) {
          marker.bindPopup(locationName).openPopup();
        }

        mapInstanceRef.current = map;
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName]);

  return (
    <div>
      <div className={styles.locationInfo}>
        <span className={styles.locationText}>📍 Event Location</span>
           <a 
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewMapLink}
        >
          View in Google Maps →
        </a>
      </div>
      <div className={styles.mapContainer}>
        <div ref={mapRef} className={styles.leafletMap} />
      </div>
    </div>
  );
}