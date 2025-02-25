'use client';
import { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { useParams } from 'next/navigation';
import { fetchCommunityData } from "./actions";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import upin from "public/upin.png";

interface CommunityData {
  id: number;
  community_name: string;
  community_description: string;
  community_photo_url: string;
  city: string;
}

interface CommunityPost {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string;
  media_url: string;
}

export default function CommunityPage() {
  const params = useParams(); // Use useParams to get dynamic route parameters
  const id = params?.id as string; // Extract the id from params

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Community ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch data using the server action
        const { communityData, postsData } = await fetchCommunityData(id);
        setCommunityData(communityData);
        setCommunityPosts(postsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-upinGreen"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {"Something went wrong: " + error}
        </div>
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Community not found</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4">
      {/* Background Image */}
      <Image
        src={communityData.community_photo_url || bgImg}
        alt="Background"
        layout="fill"
        className="absolute inset-0"
        priority
      />
    
      {/* Conditional Green Overlay */}
      {!communityData.community_photo_url && (
        <div className="absolute inset-0 bg-upinGreen opacity-50"></div>
      )}
    
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl space-y-8 py-12">
        {/* Community Info Card */}
        <div className="bg-white bg-opacity-95 p-6 sm:p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-bold text-upinGreen mb-4">
            {communityData.community_name}
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            {communityData.community_description}
          </p>
          <p className="text-md text-gray-600">
            <span className="font-bold">📍 Location:</span> {communityData.city}
          </p>
        </div>
    
        {/* Posts Section */}
        <div className="space-y-6">
          {communityPosts.length > 0 ? (
            communityPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-4 w-full">
                  {/* Conditional Media Display */}
                  {post.media_url ? (
                    <div className="h-auto text-center shadow-lg shadow-gray-500 rounded-lg overflow-hidden m-5">
                      <Image
                        src={post.media_url}
                        alt="Post Media"
                        width={500}
                        height={300}
                        className="object-cover w-full h-full mx-auto "
                      />
                    </div>
                  ) : (
                    <div className="flex justify-start w-[50px] h-[50px]">
                      <Image
                        src={upin}
                        alt="Post Media"
                        width={50}
                        height={50}
                        className="object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">{post.user_name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-4 text-gray-800">{post.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8">No posts available</div>
          )}
        </div>
      </div>
    </div>
  );
}
