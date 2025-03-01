"use client"; // Enables interactivity

import { useState } from "react";
import { createClient } from 'utils/supabase/client'; // Ensure this is the client-side version

export default function JoinPinButton({ pinId, user, joinedCount }) {
    const [isJoined, setIsJoined] = useState(false);
    const [count, setCount] = useState(joinedCount);
    const supabase = createClient();

    const handleJoinPin = async () => {
        
        try {
            if (!user) {
                console.error("User is not authenticated.");
                return;
            }
    
            console.log("Authenticated user:", user);
    
            // Fetch user data from the 'userdata' table
            const { data: userData, error: userError } = await supabase
                .from('userdata')
                .select("*")
                .eq("userUID", user)
                .single(); // Ensures you get a single object instead of an array
    
            if (userError) {
                throw new Error(`Error fetching user data: ${userError.message}`);
            }
    
            if (!userData) {
                throw new Error("User data not found.");
            }
            console.log(userData.id)
            // // Insert the user into the 'pinparticipants' table
            const { data, error } = await supabase
                .from("pinparticipants")
                .insert([{ pin_id: pinId, user_id: userData.id }])
                .select();
    
            if (error) {
                throw new Error(`Error joining pin: ${error.message}`);
            }
    
            // Update state to reflect the user has joined
            setIsJoined(true);
            setCount(count + 1); // Update count without reload
    
            console.log("Successfully joined pin:", data);
        } catch (error) {
            console.error("An error occurred in handleJoinPin:", error.message || error);
        }
    };
    

    return (
        <button
            onClick={handleJoinPin}
            disabled={isJoined}
            className={`mt-4 px-6 py-2 rounded-lg shadow-md transition-all ${
                isJoined ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
            {isJoined ? "Joined!" : "Join Pin"}
        </button>
    );
}
