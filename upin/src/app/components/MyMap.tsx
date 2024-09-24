"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from "@mapbox/search-js-react";
import { MAPBOX_TOKEN_API } from "@/../../secretes.js";
import EventMarker from './EventMarker';
import "mapbox-gl/dist/mapbox-gl.css"


mapboxgl.accessToken = MAPBOX_TOKEN_API;
const INITIAL_CENTER = [
  -74.0242,
  40.6941
]
const INITIAL_ZOOM = 10.12

export default function MyMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null); // Typing for map instance
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Typing for map container
  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  useEffect(() => {
    if (!mapContainerRef.current) return; // Ensure the container exists

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center as [number, number],
      zoom: zoom,
      style: 'mapbox://styles/mapbox/outdoors-v12', // Choose a Mapbox style
    });
    new mapboxgl.Marker()
      .setLngLat([12.554729, 55.70651])
      .addTo(mapRef.current);

      new mapboxgl.Marker({ color: 'red', rotation: 45 })
      .setLngLat([12.65147, 55.608166])
      .addTo(mapRef.current);
    // Trigger resize on load to ensure the map fits the container
    mapRef.current.on('load', () => {
      mapRef.current?.resize();
    });
    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter()
      const mapZoom = mapRef.current.getZoom()

      // update state
      setCenter([ mapCenter.lng, mapCenter.lat ])
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current?.remove(); // Clean up the map on unmount
    };
  }, []);
  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER as [number,number],
      zoom: INITIAL_ZOOM
    })
  }

  return (
    
    <div> {/* Ensures full viewport height */}
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




// export default function MyMap({ lng, lat }: MyMapProps) {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   useEffect(() => {
//     if (typeof window === 'undefined' || mapInstanceRef.current) return;

//     mapInstanceRef.current = new mapboxgl.Map({
//       container: mapContainerRef.current!,
//       style: 'mapbox://styles/mapbox/streets-v8',
//       center: [lng, lat],
//       zoom: 9,
//     });

//     mapInstanceRef.current.on("load", () => {
//       setMapLoaded(true);
//     });

//     // Cleanup on unmount
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, [lng, lat]);

//   const handleSearchChange = (result: any) => {
//     if (result && result.center) {
//       const [newLng, newLat] = result.center;
//       setInputValue(result.place_name);
//       mapInstanceRef.current!.flyTo({ center: [newLng, newLat], zoom: 9});
//     }
//   };

//   return (
//     <div className='bg-gray-400 backdrop-filter backdrop-blur-xl bg-opacity-30'>
//       <div className='w-[75%] mx-auto border place-content-center rounded-3xl'>
//     {mapLoaded && (
//       <>
//         <div>
//           <SearchBox
//             accessToken={accessToken}
//             map={mapInstanceRef.current!}
//             mapboxgl={mapboxgl} 
//             onResult={handleSearchChange}
//             marker={false}
//           />  
//         </div>
//         <EventMarker 
//           lat={lat} 
//           lng={lng} 
//           title={"San Marcos"} 
//           description={"San Marcos, Ca"} 
//           map={mapInstanceRef.current} 
//         /> 
//       </>
//     )}
//     <div ref={mapContainerRef} className="w-full h-[35rem] bg-black" />
//   </div>
// </div>

//   );
// }
