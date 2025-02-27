import { createClient } from 'utils/supabase/server';
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { FaLocationArrow } from "react-icons/fa";

interface PinData {
    id: number;
    meetupname: string;
    description: string;
    mainphotourl: string;
    link: string;
    location: string;
    user_id: number;
}

async function PinPage({ params }) {
    const id = (await params).id;
    const supabase = await createClient();
    
    try {
        const { data: PinData, error } = await supabase
            .from('pins')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!id) return <div className="text-center text-gray-600">No pin found</div>;

        // Fetch joined users count
        const { data: joinedUsers, error: joinedError } = await supabase
            .from("pinparticipants")
            .select("participant_id")
            .eq("pin_id", id);

        if (joinedError) {
            console.error('Error fetching joined users:', joinedError);
            return <div className="text-center text-red-500">Error fetching participant data</div>;
        }

        const joinedCount = joinedUsers.length;

        return (
            <div className="relative min-h-screen flex items-center justify-center px-4">
                {/* Background */}
                <Image 
                    src={bgImg} 
                    alt="Background" 
                    layout="fill" 
                    objectFit="cover" 
                    className="absolute inset-0 opacity-40" 
                />
                <div className="absolute inset-0 bg-upinGreen opacity-50"></div>

                {/* Main Card */}
                <div className="relative bg-white bg-opacity-95 p-8 rounded-3xl shadow-xl max-w-3xl w-full sm:max-w-md text-center">
                    <h1 className="text-3xl font-bold text-upinGreen mb-4">{PinData.meetupname}</h1>
                    <p className="text-lg text-gray-700 mb-4">{PinData.description}</p>
                    
                    {/* Location */}
                    <p className="text-md text-gray-600 mb-2 flex items-center justify-center gap-2">
                    <span className="font-bold flex items-center gap-1 text-upinGreen">
                        <FaLocationArrow className="text-lg" /> Location:
                    </span> 
                    <span className="text-gray-700">{PinData.location}</span>
                    </p>
                     {/*Start date */}
                    <p className="text-md text-gray-600 mb-2">
                        <span className="font-bold">Start Date:</span> {new Date(PinData.start_date).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // For AM/PM format
                        })}
                    </p>

                    {/* End Date */}
                    <p className="text-md text-gray-600 mb-2">
                        <span className="font-bold">End Date:</span> {new Date(PinData.end_date).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // For AM/PM format
                        })}
                    </p>

                    {/* Joined Users */}
                    <div className="mt-4">
                        <span className="inline-block bg-upinGreen text-white px-5 py-2 rounded-full text-md font-semibold shadow-md">
                            {joinedCount > 0 ? `${joinedCount} Joined` : "Be the first to join!"}
                        </span>
                    </div>

                    {/* Image */}
                    <div className="mt-6 flex justify-center">
                        {!PinData.mainphotourl ? (
                            <p className="text-gray-500 italic">Upin Photo Placeholder</p>
                        ) : (
                            <Image 
                                src={PinData.mainphotourl} 
                                alt="Pin Image" 
                                width={500} 
                                height={350} 
                                className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-md"
                            />
                        )}
                    </div>

                    {/* Event Status */}
                    <p className="text-md font-semibold mt-4">
                        Is this still active?  
                        <span className={`ml-1 ${!PinData.is_ended ? "text-green-500" : "text-red-500"}`}>
                        {new Date(PinData.end_date) >= new Date() ? "Yes ✅" : "No ❌"}
                        </span>
                    </p>

                    {/* Call to Action */}
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
    } catch (e) {
        console.log(e);
        return <div className="text-center text-red-500">Error loading pin data</div>;
    }
}

export default PinPage;
