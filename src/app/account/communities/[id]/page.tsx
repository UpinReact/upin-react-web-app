'use client'
import { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { useParams } from 'next/navigation';
import PostToCommunity, { CheckIfUserIsInCommunity, fetchCommunityData } from "./actions";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import upin from "public/upin.png";
import { createClient } from 'utils/supabase/client';
// import { AuthSessionMissingError } from '@supabase/supabase-fs';
import Link from 'next/link';
import { MdCameraFront } from "react-icons/md";
import { MdDelete } from "react-icons/md";

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

  const supabase = createClient();

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should be a boolean state
  const [userId, setUserId] = useState(null)
  const [fileType, setFileType] = useState("media_url");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (!user?.email) {
          throw new Error("User email not found");
        }

        const { data: userData, error: userDataError } = await supabase
          .from("userdata")
          .select("*")
          .eq("email", user.email)
          .single();

          setUserId(userData.id)

        if (userDataError) throw userDataError;

        const isMember = await CheckIfUserIsInCommunity(userData.id, id);
        setIsLoggedIn(isMember); // Set isLoggedIn to the result of membership check

      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, supabase]); // Ensure to re-fetch when the community id or supabase changes

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

  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase
        .from('communityposts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId); // Only delete if the logged-in user is the post creator

      if (error) {
        throw error;
      }

      setCommunityPosts(communityPosts.filter(post => post.id !== postId)); // Update the UI to remove the post
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

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
  
  if (!userId) {
  return (
    <div>
      <div className='flex justify-center items-center h-screen'>
        <p className='font-extrabold text-gray-600'>Please Log in to view community posts</p>
        <div className='m-1'>
          <Link href={"/login"} className='border-2 bg-upinGreen text-black rounded-2xl p-3'>Login</Link>
        </div>
      </div>
    </div>
  );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    const form = event.target as HTMLFormElement;
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;

    const formData = {
      content: content,
      media_url: null, // Add media URL if available
      video_url: null, // Add video URL if available
    };

    const result = await PostToCommunity(userId, id, formData);

    if (result.success) {
      alert("Post created successfully!");
    } else {
      alert(`Failed to create post: ${result.error}`);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileType(file.type.startsWith("image/") ? "media_url" : "video_url");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4 bg-gray-100">
      {/* Background Image as Banner */}
      <div className="relative w-full h-[300px] overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={communityData.community_photo_url || bgImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          priority
        />
        {!communityData.community_photo_url && (
          <div className="absolute inset-0 bg-upinGreen opacity-50"></div>
        )}
      </div>

      {/* Main Content (Posts and Community Info Card) */}
      <div className="relative z-10 w-full max-w-3xl space-y-8 py-12 -mt-16">
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

        {isLoggedIn && (
          <div className="z-20 w-full max-w-3xl mt-6">
            {/* <form className="bg-white p-4 rounded-lg shadow-lg space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="content" className="font-semibold text-lg">Create Post</label>
              <input type="hidden" name="user_id" id="user_id" value={userId} />

              <textarea
                id="content"
                name="content"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-slate-100 focus:ring-upinGreen"
                placeholder="What's on your mind?"
              />
              <label htmlFor="file_input" className="flex items-center gap-2 cursor-pointer">
                <MdCameraFront className="text-gray-600 text-xl" />
                Upload Picture or Video
                <input
                  type="file"
                  accept="image/*, video/*"
                  name={fileType}
                  id="file_input"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <button
                type="submit"
                className="w-full py-2 bg-upinGreen text-white rounded-lg hover:bg-upinGreen/90 transition-colors"
              >
                Post
              </button>
            </form> */}
          </div>
        )}

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
                        className="object-cover w-full h-full mx-auto"
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
                {post.user_id === userId && (
                  <button
                  className="text-red-500 hover:text-red-700 mt-4"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <MdDelete className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  Delete Post
                </button>
                
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-lg text-gray-600">No posts yet!</div>
          )}
        </div>
      </div>
    </div>
  );
}
