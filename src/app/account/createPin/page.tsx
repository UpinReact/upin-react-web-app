'use client';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure Mapbox styles are loaded
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MAPBOX_TOKEN_API } from '@/../secretes';
import { createClient } from 'utils/supabase/client';

const AddressInput = ({ onAddressSelect }: { onAddressSelect: (address: string, lat: number, lng: number) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear the container to prevent duplicates
      containerRef.current.innerHTML = "";

      // Initialize the Geocoder if not already initialized
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN_API,
        placeholder: "Enter an address",
        countries: "us",
        types: "address",
      });

      geocoder.addTo(containerRef.current); // Add Geocoder to the container
      geocoderRef.current = geocoder; // Store reference

      // Handle result events
      geocoder.on("result", (event) => {
        const selectedAddress = event.result.place_name;
        const { coordinates } = event.result.geometry;
        const [longitude, latitude] = coordinates;
        console.log("Selected Address:", selectedAddress);
        console.log("Latitude:", latitude, "Longitude:", longitude);
        onAddressSelect(selectedAddress, latitude, longitude); // Pass the selected address and coordinates to the parent
      });

      // Handle clear events
      geocoder.on("clear", () => {
        console.log("Address input cleared");
        onAddressSelect("", 0, 0); // Clear the address and coordinates
      });

      // Cleanup on unmount
      return () => {
        if (geocoderRef.current) {
          geocoderRef.current.clear(); // Remove Geocoder input
          geocoderRef.current = null; // Reset reference
        }
      };
    }
  }, [onAddressSelect]);

  return <div ref={containerRef} className="border rounded-md focus:ring-2 focus:ring-blue-500" />;
};

const CreatePin = () => {
  const selectedAddress = useRef<string>("");
  const selectedLatitude = useRef<number>(0);
  const selectedLongitude = useRef<number>(0);

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    selectedAddress.current = address;
    selectedLatitude.current = lat;
    selectedLongitude.current = lng;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      meetupname: formData.get("meetupname"),
      description: formData.get("description"),
      location: selectedAddress.current, // Use the selected address
      latitude: selectedLatitude.current, // Use the selected latitude
      longitude: selectedLongitude.current, // Use the selected longitude
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
    };

    try{
      const supabase = createClient();
      const { error } = await supabase.from("pins").insert([data]).single();

      if (error) {
        console.error("Error creating pin:", error.message);
      } else {
        console.log("Pin created successfully");
        alert("Pin created successfully");
        window.location.href = "/account"; // Redirect to the account page
      }
    }catch(error){
      console.error("Error creating pin:", error.message);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create a Pin</h1>
        <h3 className="text-blue-500 text-center font-montserrat">
          <Link href={"/account"}>Nevermind, take me back to my account</Link>
        </h3>
        <hr className="mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="meetupname" className="text-sm font-medium text-gray-700 mb-1">
              Meetup Name:
            </label>
            <input
              type="text"
              id="meetupname"
              name="meetupname"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">
              Location:
            </label>
            <AddressInput onAddressSelect={handleAddressSelect} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="start_date" className="text-sm font-medium text-gray-700 mb-1">
              Start Date:
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="start_date" className="text-sm font-medium text-gray-700 mb-1">
              End Date:
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex  justify-between">
          <legend className="text-sm font-medium text-gray-700">
            Is this Event Public or Private:
          </legend>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="Public" 
              id="public" 
            />
            <label htmlFor="public" className="text-sm text-gray-700">
              Public
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="Private" 
              id="private" 
            />
            <label htmlFor="private" className="text-sm text-gray-700">
              Private
            </label>
          </div>
        </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;