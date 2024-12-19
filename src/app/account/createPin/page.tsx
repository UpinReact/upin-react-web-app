'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
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

  return <div ref={containerRef} className="border rounded-lg shadow-md p-2 bg-white focus:ring-2 focus:ring-upinGreen" />;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-2xl transform hover:scale-105 transition-transform">
        <h1 className="text-3xl font-bold text-center text-upinGreen mb-6">Create a Pin</h1>
        <h3 className="text-center text-upinGreen font-semibold mb-4">
          <Link href="/account">Nevermind, take me back to my account</Link>
        </h3>
        <hr className="mb-6 border-gray-300" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="meetupname" className="font-medium text-gray-700">Meetup Name:</label>
            <input
              type="text"
              id="meetupname"
              name="meetupname"
              className="mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-upinGreen"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-upinGreen"
              required
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label htmlFor="location" className="font-medium text-gray-700">Location:</label>
            <AddressInput onAddressSelect={handleAddressSelect} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="start_date" className="font-medium text-gray-700">Start Date:</label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              className="mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-upinGreen"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end_date" className="font-medium text-gray-700">End Date:</label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              className="mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-upinGreen`"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Event Type:</span>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="public"
                  checked={isPublic}
                  onChange={() => {
                    setIsPublic(!isPublic);
                    setIsPrivate(false);
                  }}
                />
                <span>Public</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="private"
                  checked={isPrivate}
                  onChange={() => {
                    setIsPrivate(!isPrivate);
                    setIsPublic(false);
                  }}
                />
                <span>Private</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-upinGreen"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Create Pin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
