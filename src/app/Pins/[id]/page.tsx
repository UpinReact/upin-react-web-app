import { createClient } from 'utils/supabase/server';
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

        if (error) {
            throw error;
        }

        if (!id) {
            return <div>No ID found</div>;
        }

        return (
            <div className='relative h-screen w-screen'>
                <Image 
                    src={bgImg} 
                    alt='Background' 
                    layout='fill' 
                    objectFit='cover' 
                    className='absolute inset-0 opacity-50' 
                />
                <div className='absolute inset-0 bg-upinGreen opacity-60'></div>
                <div className='relative flex items-center justify-center h-full'>
                    <div className='bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl max-w-4xl w-full text-center'>
                        <p>To join a pin and get the most out of our platform, we recommend downloading our app!<br />
                        </p>
                        <div className="flex justify-center">
                            <Link href="/get-the-app" className="hover:text-blue-500 transition-colors duration-300 text-center font-bold border border-upinGreen rounded-lg p-2 bg-upinGreen text-white w-full my-2 ">
                                Get The App
                            </Link>
                        </div>
                        <h1 className='text-4xl font-bold text-upinGreen mb-4'>{PinData.meetupname}</h1>
                        <p className='text-lg text-gray-700 mb-4'>{PinData.description}</p>
                        <p className='text-md text-gray-600 mb-4'> <span className='font-bold'>Location: </span> {PinData.location}</p>
                        {!PinData.mainphotourl ? (
                            <p className='text-gray-500'>Upin Photo Placeholder</p>
                        ) : (
                            <Image src={PinData.mainphotourl} alt='Pin Image' width={600} height={400} className='rounded-lg mx-auto' />
                        )}
                        <p className='text-md font-semibold mt-4'>Is this still active? <span className='text-upinGreen'>{!PinData.is_ended ? "Yes" : "No"}</span></p>
                    </div>
                </div>
            </div>
        );
    } catch (e) {
        console.log(e);
        return <div>Error loading pin data</div>;
    }
}

export default PinPage;
