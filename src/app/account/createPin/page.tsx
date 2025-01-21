'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "utils/supabase/supabase";
import { useRouter } from 'next/navigation';
import { getAccountData } from 'src/app/login/actions';
import { debounce } from '@mui/material';

const AddressInput = ({ onAddressSelect }: { onAddressSelect: (address: string, lat: number, lng: number) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear previous instance

      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
        placeholder: "Enter an address",
        debounce: 50,
        countries: "us",
        types: "address",
      });

      geocoder.addTo(containerRef.current);

      geocoder.on("result", (event) => {
        const selectedAddress = event.result.place_name || '';
        const [longitude, latitude] = event.result.geometry.coordinates; // Extract coordinates
        onAddressSelect(selectedAddress, latitude, longitude);
      });

      return () => geocoder.clear(); // Cleanup
    }
  }, [onAddressSelect]);

  return <div ref={containerRef} className="border rounded-lg shadow-md p-5 " style={{height:'100%', width:"100%"}}/>;
};
interface data{
  id: number;
}
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
      setUserData({ id: data.user.id  || '' });

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
    else{
      const form = new FormData(event.currentTarget);
      const meetupname = form.get("meetupname") as string;
      const description = form.get("description") as string;
      const start_date = form.get("start_date") as string;
      const end_date = form.get("end_date") as string;
      const isPublic = form.get("isPublic") as string;
      const isPrivate = form.get("isPrivate") as string;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("pins")
        .insert([
          {
            user_id: userData?.id,
            meetupname: meetupname,
            description: description,
            address: selectedAddress.current,
            latitude: selectedLatitude.current,
            longitude: selectedLongitude.current,
            start_date: start_date,
            end_date: end_date,
            isPublic: isPublic,
            isPrivate: isPrivate,
          },
        ]);
      setIsLoading(false);
      if (error) {
        setError(error.message);
      } else {
        console.log("Pin created successfully!" + data);
        router.push("/private");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-upinGreen mb-6">Create a Pin</h1>
        <h3 className="text-center text-upinGreen font-semibold mb-4">
          <Link href="/private">Nevermind, take me back to my account</Link>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-10">
        
            <AddressInput onAddressSelect={handleAddressSelect}  />
            <div >
              <label>
                Meetup Name:
                <input type="text" name="meetupname" required className='border border-upinGreen rounded-lg' />
              </label>
            </div>
            <div className='flex items-start justify-between'>
              <label>
                Description:
                <textarea name="description" required className='border border-upinGreen rounded-lg' rows={5}  />
              </label>
            </div>
            <div>
              <label>
                Start Date:
                <input type="datetime-local" name="start_date" required className='border border-upinGreen rounded-lg p-2 m-1' />
              </label>
            </div>
            <div>
              <label>
                End Date:
                <input type="datetime-local" name="end_date" required className='border border-upinGreen rounded-lg p-2 m-1' />
              </label>
            </div>
            <div className='flex justify-between'>
              <label>
                <input
                  type="checkbox"
                  checked={!isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className='m-2'             
                />
                Public
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPrivate(!isPrivate)}
                  className='m-2'
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
