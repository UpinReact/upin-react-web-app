import { createClient } from 'utils/supabase/server';
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { FaLocationArrow } from "react-icons/fa";
import JoinPinButton from './JoinPinComponent';

async function PinPage({ params }) {
    const id = await (await params?.id);
    if (!id) return <div className="text-center text-gray-600">No pin found</div>;
    const supabase = await createClient();

    const { data: authData, error: authError } = await (await supabase).auth.getUser();
    const user = authData?.user;
    let hasJoined = false
    try{
        const { data: userid, error: userIdError } = await (await supabase)
        .from("userdata")
        .select("*")
        .eq("userUID", user.id)
        .single();

        console.log(userid.id)

        const participant_id = userid.id

        if (userIdError) {
            console.log(userIdError)
            console.error('Error fetching user data:', userIdError);
            return <div className="text-center text-red-500">Error fetching user data</div>;
        }
        console.log(`this is the pin id: ${id} and this is the user id  ${participant_id}`)
        let { data, error } = await (await supabase)
        .from("pinparticipants")
        .select("*")
        .eq("pin_id", id)
        .eq("user_id", participant_id);

        // console.log(data)
        hasJoined = data && data.length > 0; // Boolean value
        console.log("has the user join: " +hasJoined)

    
    
    if(userIdError) throw userIdError;
    }catch(error){
        console.log(error)
    }

    

    try {
        const { data: pinData, error } = await (await supabase)
            .from('pins')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        const { data: joinedUsers, error: joinedError } = await (await supabase)
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
                <Image 
                    src={bgImg} 
                    alt="Background" 
                    layout="fill" 
                    objectFit="cover" 
                    className="absolute inset-0 opacity-40" 
                />
                <div className="absolute inset-0 bg-upinGreen opacity-50"></div>

                <div className="relative bg-white bg-opacity-95 p-8 rounded-3xl shadow-xl max-w-3xl w-full sm:max-w-md text-center">
                    <h1 className="text-3xl font-bold text-upinGreen mb-4">{pinData.meetupname}</h1>
                    <p className="text-lg text-gray-700 mb-4">{pinData.description}</p>
                    
                    <p className="text-md text-gray-600 mb-2 flex items-center justify-center gap-2">
                        <span className="font-bold flex items-center gap-1 text-upinGreen">
                            <FaLocationArrow className="text-lg" /> Location:
                        </span> 
                        <span className="text-gray-700">{pinData.location}</span>
                    </p>
                    
                    <p className="text-md text-gray-600 mb-2">
                        <span className="font-bold">Start Date:</span> {new Date(pinData.start_date).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>
                    <p className="text-md text-gray-600 mb-2">
                        <span className="font-bold">End Date:</span> {new Date(pinData.end_date).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>
                    
                    <div className="mt-4">
                        <span className="inline-block bg-upinGreen text-white px-5 py-2 rounded-full text-md font-semibold shadow-md">
                            {joinedCount > 0 ? `${joinedCount} Joined` : "Be the first to join!"}
                        </span>
                    </div>

                    {user && hasJoined === true 
                    ? <p className="bg-gray-400 cursor-not-allowed mt-4 px-6 py-2 rounded-lg shadow-md transition-all w-auto">Joined!</p>
                    : user && (
                        <JoinPinButton pinId={id} user={user.id} joinedCount={joinedCount} />
                    )
                    }

                    

                    <div className="mt-6 flex justify-center">
                        {!pinData.mainphotourl ? (
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
                        <span className={`ml-1 ${new Date(pinData.end_date) >= new Date() ? "text-green-500" : "text-red-500"}`}>
                            {new Date(pinData.end_date) >= new Date() ? "Yes ✅" : "No ❌"}
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
    } catch (e) {
        console.log(e);
        return <div className="text-center text-red-500">Error loading pin data</div>;
    }
}

export default PinPage;
