'use client';
import React, { useEffect, useState } from 'react';
import {createClient} from 'utils/supabase/client';
import Image from 'next/image';
import bgImg from 'public/Screen Shot 2020-03-12 at 9.26.39 AM.png';

const CheckPins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClient();

  const fetchPins = async (userId) => {
    try {
      const { data: participatingPins, error: participantError } = await supabase
        .from('pinparticipants')
        .select('*')
        .eq('user_id', userId);

      if (participantError) throw participantError;

      const pinIds = participatingPins.map((p) => p.pin_id);

      const { data: pins, error: pinsError } = await supabase
        .from('pins')
        .select('*')
        .in('id', pinIds);

      if (pinsError) throw pinsError;

      setPins(pins);
    } catch (error) {
      console.error('Error fetching pins:', error);
      setError('Failed to fetch pins.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      const { data: userinfo, error: userInfoError } = await supabase
        .from('userdata')
        .select('id')
        .eq('userUID', user.id)
        .single();

      if (userInfoError) throw userInfoError;

      await fetchPins(userinfo.id);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen bg-upinGreen py-10">
      {/* Background Image */}
      <div className="absolute inset-0 -z-0">
        <Image
          src={bgImg}
          alt="Background image"
          fill
          style={{ objectFit: 'cover', opacity: 0.1 }}
          className="h-screen"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-upinGreen mb-8">Pins I am Active In</h1>
        {pins.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-upinGreen text-white text-left">
                  <th className="py-4 px-6 rounded-tl-lg">Location</th>
                  <th className="py-4 px-6">Pin Name</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 rounded-tr-lg">Image</th>
                </tr>
              </thead>
              <tbody>
                {pins.map((pin, index) => (
                  <tr
                    key={pin.id}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-upinGreen/10 transition`}
                  >
                    <td className="py-4 px-6 border-b border-gray-200">{pin.location}</td>
                    <td className="py-4 px-6 border-b border-gray-200 font-semibold">{pin.meetupname}</td>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-600">{pin.description}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {pin.mainphotourl ? (
                        <Image
                          src={pin.mainphotourl}
                          alt={pin.meetupname || 'Pin Image'}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">No pins found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPins;