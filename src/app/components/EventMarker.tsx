import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface EventMarkerProps {
  lng: number;
  lat: number;
  title: string;
  description: string;
  map: mapboxgl.Map | null;
}

const EventMarker: React.FC<EventMarkerProps> = ({ lng, lat, title, description, map }) => {
  useEffect(() => {
    if (!map) return;

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${title}</h3><p>${description}</p>`
    );

    const marker = new mapboxgl.Marker({ anchor: 'bottom' })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Update marker position on zoom events
    map.on('zoom', () => {
      marker.setLngLat([lng, lat]);
    });

    return () => {
      marker.remove(); // Cleanup on unmount
      // map.off('zoom'); // Cleanup zoom event listener
    };
  }, [map, lng, lat, title, description]);

  return null;
};

export default EventMarker;
