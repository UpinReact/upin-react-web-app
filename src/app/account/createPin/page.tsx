'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-geocoder.css";
import { supabase } from "utils/supabase/supabase";
import { useRouter } from 'next/navigation';
import { getAccountData } from 'src/app/login/actions';


const AddressInput = ({ onAddressSelect }: { onAddressSelect: (address: string, lat: number, lng: number) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        placeholder: "Enter an address",
        countries: "us",
        types: "address",
      });

      geocoder.addTo(containerRef.current);
      geocoderRef.current = geocoder;

      geocoder.on("result", (event) => {
        const selectedAddress = event.result.place_name;
        const { coordinates } = event.result.geometry;
        const [longitude, latitude] = coordinates;
        onAddressSelect(selectedAddress, latitude, longitude);
      });

      geocoder.on("clear", () => {
        onAddressSelect("", 0, 0);
      });

      return () => {
        if (geocoderRef.current) {
          geocoderRef.current.clear();
          geocoderRef.current = null;
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
  const [userData, setUserData] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAccountData();
      if (result.error) setError(result.error);
      else setUserData({ id: result.user.id });
    };
    fetchData();
  }, []);

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    selectedAddress.current = address;
    selectedLatitude.current = lat;
    selectedLongitude.current = lng;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;

    // Validate date range
    if (new Date(startDate) >= new Date(endDate)) {
      alert("Start date must be before the end date.");
      return;
    }

    const data = {
      host_id: userData?.id || "",
      meetupname: formData.get("meetupname") as string,
      description: formData.get("description") as string,
      location: selectedAddress.current,
      latitude: selectedLatitude.current,
      longitude: selectedLongitude.current,
      start_date: startDate,
      end_date: endDate,
      pin_type: isPublic ? "public" : "private",
    };

    try {
      setIsLoading(true);
      const { error: pinError } = await supabase.rpc('add_pin_rpc', {
        _user_id: userData?.id,
        _pin_type: data.pin_type,
        _pin_title: data.meetupname,
        _short_description: data.description,
        _location: data.location,
        _start_date: data.start_date,
        _end_date: data.end_date,
        _latitude: data.latitude,
        _longitude: data.longitude,
        _community_id: null,
        _is_community_hosted: false,
      });

      if (pinError) {
        console.error("Error creating pin:", pinError.message);
        alert(`Error: ${pinError.message}`);
      } else {
        alert("Pin created successfully");
        router.push('/account');
      }
    } catch (error: any) {
      console.error("Unexpected error creating pin:", error.message);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create a Pin</h1>
        <h3 className="text-blue-500 text-center font-montserrat">
          <Link href="/account">Nevermind, take me back to my account</Link>
        </h3>
        <hr className="mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={userData?.id || ""} />

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
            <label htmlFor="end_date" className="text-sm font-medium text-gray-700 mb-1">
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
          <div className="flex justify-between items-center">
            <legend className="text-sm font-medium text-gray-700">
              Is this Event Public or Private:
            </legend>
            <label htmlFor="public" className="flex items-center">
              <input
                type="checkbox"
                name="Public"
                id="public"
                value="public"
                checked={isPublic}
                onChange={() => {
                  setIsPublic(!isPublic);
                  setIsPrivate(false);
                }}
                className="mr-2"
              />
              Public
            </label>
            <label htmlFor="private" className="flex items-center">
              <input
                type="checkbox"
                name="Private"
                id="private"
                value="private"
                checked={isPrivate}
                onChange={() => {
                  setIsPrivate(!isPrivate);
                  setIsPublic(false);
                }}
                className="mr-2"
              />
              Private
            </label>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
