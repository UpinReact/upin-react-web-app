'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from 'utils/supabase/client';
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
        .in('id', pinIds)
        .gt('end_date', new Date().toISOString()); // Only select pins where end_date is in the future

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
      <div className="flex justify-center items-center h-screen px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-upinGreen py-8 px-4 sm:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 -z-0">
        <Image
          src={bgImg}
          alt="Background image"
          fill
          style={{ objectFit: 'cover', opacity: 0.1 }}
          className="h-screen"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-lg sm:rounded-2xl">
        <h1 className="text-2xl sm:text-4xl font-bold text-upinGreen mb-6 text-center">Pins I am Active In</h1>
        {pins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pins.map((pin) => (
              <div key={pin.id} className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                  <div className="text-center sm:text-left">
                    <h2 className="font-semibold text-lg text-upinGreen">{pin.meetupname}</h2>
                    <p className="text-sm text-gray-600">{pin.location}</p>
                  </div>
                  {pin.mainphotourl && (
                    <Image
                      src={pin.mainphotourl}
                      alt={pin.meetupname || 'Pin Image'}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover mt-3 sm:mt-0"
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-3">{pin.description}</p>
                {!pin.mainphotourl && (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg mt-3">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 text-sm sm:text-base">No pins found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPins;

