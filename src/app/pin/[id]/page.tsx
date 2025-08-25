import { createClient } from 'utils/supabase/server';
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { FaLocationArrow } from "react-icons/fa";
import JoinPinButton from './JoinPinComponent';

async function PinPage({ params }) {
  const id = params?.id;
  if (!id) return <div className="text-center text-gray-600">No pin found</div>;

  const supabase = await createClient();

  // Get logged-in user
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  // State variables
  let participant_id = null;
  let hasJoined = false;
  let pinData = null;
  let pinInfo = null;
  let joinedCount = 0;

  try {
    // Get userdata id for logged user
    if (user?.id) {
      const { data: userid, error: userIdError } = await supabase
        .from("userdata")
        .select("id")
        .eq("userUID", user.id)
        .single();

      if (userIdError) throw userIdError;

      participant_id = userid?.id;

      // Check if user already joined this pin
      const { data: joinedData } = await supabase
        .from("pinparticipants")
        .select("*")
        .eq("pin_id", id)
        .eq("user_id", participant_id);

      hasJoined = joinedData && joinedData.length > 0;
    }
  } catch (e) {
    console.log("User join fetch error:", e);
  }

  try {
    // Fetch pin main data
    const { data, error } = await supabase
      .from("pins")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    pinData = data;

    // Fetch ticket price info
    const { data: infoData, error: infoError } = await supabase
      .from("pin_ticket_info")
      .select("ticket_price")
      .eq("id", id)
      .single();

    if (!infoError) pinInfo = infoData;

    // Get count of joined participants
    const { data: joinedUsers, error: joinedError } = await supabase
      .from("pinparticipants")
      .select("participant_id")
      .eq("pin_id", id);

    if (!joinedError) joinedCount = joinedUsers.length;
  } catch (e) {
    console.log("Pin data fetch error:", e);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <Image 
        src={bgImg} 
        alt="Background" 
        layout="fill" 
        objectFit="cover" 
        className="absolute inset-0 opacity-40" 
      />
      <div className="absolute inset-0 bg-upinGreen opacity-50"></div>

      <div className="relative bg-white bg-opacity-95 p-8 rounded-3xl shadow-xl max-w-3xl w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-bold text-upinGreen mb-4">{pinData?.meetupname}</h1>
        <p className="text-lg text-gray-700 mb-4">{pinData?.description}</p>

        <p className="text-md text-gray-600 mb-2 flex items-center justify-center gap-2">
          <span className="font-bold flex items-center gap-1 text-upinGreen">
            <FaLocationArrow className="text-lg" /> Location:
          </span> 
          <span className="text-gray-700">{pinData?.location}</span>
        </p>

        <p className="text-md text-gray-600 mb-2">
          <span className="font-bold">Start Date:</span> {pinData?.start_date ? new Date(pinData.start_date).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) : null}
        </p>
        <p className="text-md text-gray-600 mb-2">
          <span className="font-bold">End Date:</span> {pinData?.end_date ? new Date(pinData.end_date).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) : null}
        </p>

        {/* Buy Ticket Button */}
        {user && pinInfo?.ticket_price ? (
          <button
            onClick={async () => {
              const res = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pinId: id,
                  userId: user.id,
                }),
              });

              const { url } = await res.json();
              if (url) {
                window.location.href = url; // Redirect to Stripe UI
              } else {
                alert("Could not start checkout");
              }
            }}
            className="bg-upinGreen hover:bg-green-600 text-white px-6 py-2 mt-4 rounded-lg shadow-md transition-all"
          >
            🎟️ Buy Ticket
          </button>
        ) : hasJoined ? (
          <p className="bg-gray-400 mt-4 px-6 py-2 rounded-lg shadow-md">Joined!</p>
        ) : (
          user && <JoinPinButton pinId={id} user={user.id} joinedCount={joinedCount} />
        )}

        <div className="mt-6 flex justify-center">
          {!pinData?.mainphotourl ? (
            <p className="text-gray-500 italic">Upin Photo Placeholder</p>
          ) : (
            <Image 
              src={pinData.mainphotourl} 
              alt="Pin Image" 
              width={500} 
              height={350} 
              className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-md"
            />
          )}
        </div>

        <p className="text-md font-semibold mt-4">
          Is this still active?  
          <span className={`ml-1 ${pinData?.end_date && new Date(pinData.end_date) >= new Date() ? "text-green-500" : "text-red-500"}`}>
            {pinData?.end_date && new Date(pinData.end_date) >= new Date() ? "Yes ✅" : "No ❌"}
          </span>
        </p>

        <div className="mt-6">
          <Link href="/get-the-app">
            <span className="inline-block hover:bg-opacity-90 transition-all duration-300 text-center font-bold border border-upinGreen rounded-lg px-6 py-3 bg-upinGreen text-white shadow-md">
              📲 Get The App
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PinPage;
