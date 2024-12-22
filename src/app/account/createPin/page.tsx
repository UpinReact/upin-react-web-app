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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear previous instance

      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
        placeholder: "Enter an address",
        countries: "us",
        types: "address",
      });

      geocoder.addTo(containerRef.current);

      geocoder.on("result", (event) => {
        const selectedAddress = event.result.place_name;
        const [longitude, latitude] = event.result.geometry.coordinates; // Extract coordinates
        onAddressSelect(selectedAddress, latitude, longitude);
      });

      geocoder.on("clear", () => {
        onAddressSelect("", 0, 0); // Reset on clear
      });

      return () => geocoder.clear(); // Cleanup
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

  // Fetch user data on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccountData();
     
      if (error) setError(error);
      else setUserData({ id: data.user?.id  || '' });
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
    console.log(`Selected Address: ${selectedAddress.current}, Latitude: ${selectedLatitude.current}, Longitude: ${selectedLongitude.current}`);
    if (!selectedAddress.current || !selectedLatitude.current || !selectedLongitude.current) {
      alert("Please select a valid address.");
      return;
    }

    // const formData = new FormData(event.currentTarget);
    // const startDate = formData.get("start_date") as string;
    // const endDate = formData.get("end_date") as string;
    // if (new Date(startDate) >= new Date(endDate)) {
    //   alert("Start date must be before the end date.");
    //   return;
    // }

    // const data = {
    //   host_id: userData?.id || "",
    //   meetupname: formData.get("meetupname") as string,
    //   description: formData.get("description") as string,
    //   location: selectedAddress.current,
    //   latitude: selectedLatitude.current,
    //   longitude: selectedLongitude.current,
    //   start_date: startDate,
    //   end_date: endDate,
    //   pin_type: isPublic ? "public" : "private",
    // };

    // try {
    //   setIsLoading(true);
    //   const { error: pinError } = await supabase.rpc("add_pin_rpc", {
    //     _user_id: data.host_id,
    //     _pin_type: data.pin_type,
    //     _pin_title: data.meetupname,
    //     _short_description: data.description,
    //     _location: data.location,
    //     _start_date: data.start_date,
    //     _end_date: data.end_date,
    //     _latitude: data.latitude,
    //     _longitude: data.longitude,
    //     _community_id: null,
    //     _is_community_hosted: false,
    //   });

    //   if (pinError) {
    //     console.error("Error creating pin:", pinError.message);
    //     alert(`Error: ${pinError.message}`);
    //   } else {
    //     alert("Pin created successfully");
    //     router.push("/account");
    //   }
    // } catch (error: any) {
    //   console.error("Unexpected error creating pin:", error.message);
    //   alert(`Unexpected error: ${error.message}`);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-upinGreen mb-6">Create a Pin</h1>
        <h3 className="text-center text-upinGreen font-semibold mb-4">
          <Link href="/account">Nevermind, take me back to my account</Link>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
        
            <AddressInput onAddressSelect={handleAddressSelect} />
            <div>
              <label>
                Meetup Name:
                <input type="text" name="meetupname" required />
              </label>
            </div>
            <div>
              <label>
                Description:
                <textarea name="description" required />
              </label>
            </div>
            <div>
              <label>
                Start Date:
                <input type="datetime-local" name="start_date" required />
              </label>
            </div>
            <div>
              <label>
                End Date:
                <input type="datetime-local" name="end_date" required />
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                Public
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
                Private
              </label>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Pin"}
            </button>
          </form>
      </div>
    </div>
  );
};

export default CreatePin;
