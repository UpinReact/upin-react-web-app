'use client'
import React, { Suspense, use, useEffect, useState } from 'react'
import Image from "next/legacy/image";
import Motionbutton from './Motionbutton';
import Link from 'next/link';
import { logout } from '../login/actions';
import { createClient } from 'utils/supabase/client'
import { useRouter } from 'next/navigation';
import defaultUserImage from "public/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
import googleImg from "public/GetItOnGooglePlay_Badge_Web_color_English-XvR5LaEp.png";
import appleImg from "public/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg";
import {updateUserData} from './action';

interface UserData {
  profilePhotoURL: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
}

const ProfileSection = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    profilePhotoURL: '',
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    interests: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    interests: '',
    birthDate: ''
  });

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        alert("Please login to view this page")
        const router = useRouter();
        router.push('/login');
        return;
      }

      const lowerCaseEmail = data.user.email?.toLowerCase();

      const { data: userData, error: userError } = await supabase
        .from('userdata')
        .select('*')
        .eq('email', lowerCaseEmail)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return { error: 'Failed to fetch user data.' };
      } 

      if (userData) { 
        setUserData({
          profilePhotoURL: userData.profilePhotoURL,
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          birthDate: userData.birthDate,
          interests: userData.interests,
        });
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          interests: userData.interests,
          birthDate: userData.birthDate
        });
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateUserData(userData.id, formData);
      setUserData(prev => ({
        ...prev,
        ...updatedUser
      }));
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-20">
      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-gray-100 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-gray-100 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Interests</label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  className="w-full bg-gray-100 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birthdate</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full bg-gray-100 rounded-lg px-4 py-2"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <Motionbutton
                  text="Cancel"
                  className="flex-1 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                  onClick={() => setShowUpdateModal(false)}
                />
                <Motionbutton
                  text={loading ? "Updating..." : "Save Changes"}
                  className="flex-1 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                  type="submit"
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="lg:col-span-1">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <Image 
                src={userData.profilePhotoURL || defaultUserImage} 
                alt="Profile Photo" 
                width={120} 
                height={120} 
                className="rounded-full border-4 border-white shadow-lg object-cover h-64 w-64" 
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-8">Profile</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                <input
                  type="text"
                  value={userData.email}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                  disabled
                />
              </div>

              {['firstName', 'lastName', 'interests', 'birthDate'].map((field) => (
                <div key={field}>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === 'birthDate' ? 'date' : 'text'}
                    value={userData[field as keyof UserData] || ''}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                    disabled
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <Motionbutton
                text="Update Profile"
                className="flex-1 px-6 py-2 bg-emerald-500/80 hover:bg-emerald-500/90 text-white rounded-lg shadow-lg"
                onClick={() => setShowUpdateModal(true)}
              />
              
              
                <Motionbutton
                  text="Sign Out"
                  className=" px-6 py-2 bg-red-500/80 hover:bg-red-500/90 text-white rounded-lg shadow-lg"
                  onClick={logout}
                />
              
            </div>
          </div>
        </div>
      </div>

      {/* App Download Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Welcome!</h2>
            <p>For the best experience we recommend downloading our app!</p>
            <div className="flex justify-center gap-8 py-10">
              <Link href="https://play.google.com/store/apps/details?id=com.benhavis.upinjtyc832ezysr5qkcjpax">
                <Image src={googleImg} height={50} width={150} alt="Google Play" />
              </Link>
              <Link href="https://apps.apple.com/us/app/upin/id1341978328">
                <Image src={appleImg} height={50} width={150} alt="App Store" />
              </Link>
            </div>
            <Motionbutton
              text="Close"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowPopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;