'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from 'utils/supabase/client';
import Image from 'next/image'; // Import Image from next/image

const FollowersPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [followerData, setFollowerData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Unwrap the params Promise
    const unwrapParams = async () => {
      const resolvedParams = await params;
      const id = parseInt(resolvedParams.id, 10);
      setUserId(id);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (userId) {
      const fetchFollowerData = async () => {
        try {
          const supabase = await createClient();
          const { data: follower, error } = await supabase
            .from('userdata')
            .select('firstName, lastName, email, birthDate, interests, profilePhotoURL')
            .eq('id', userId);

          if (error) {
            throw error;
          }

          console.log('Follower data:', follower);
          setFollowerData(follower || []);
        } catch (error: any) {
          console.error('Error fetching followers:', error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFollowerData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className=" p-4 bg-upinGreen h-screen">
      <h1 className="text-3xl font-semibold text-center text-emerald-600 mb-4">
        Followers Page
      </h1>

      {followerData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {followerData.map((follower) => (
            <div
              key={follower.email}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 border border-gray-200"
            >
              <div className="flex flex-col items-center space-y-2">
                <p className="text-xl font-semibold text-gray-800">
                  {follower.firstName} {follower.lastName}
                </p>
                {follower.profilePhotoURL && (
                  <Image
                    src={follower.profilePhotoURL}
                    alt="Profile Photo"
                    width={100} // Set width
                    height={100} // Set height
                    className="rounded-full" // Optional: Add rounded corners to the image
                  />
                )}
                <p className="text-gray-600">{follower.email}</p>
                <p className="text-gray-600">{follower.birthDate}</p>
                <p className="text-gray-600 text-center overflow-wrap ">{follower.interests}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No followers found.</p>
      )}
    </div>
  );
};

export default FollowersPage;
