'use client'
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image';
import Motionbutton from './Motionbutton';
import Link from 'next/link';
import { logout } from '../login/actions';
import { createClient } from 'utils/supabase/client';
import { useRouter } from 'next/navigation';

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
  

  useEffect(() => {
    const fetchData = async () => {
     const supabase = await createClient()
      const { data } = await supabase.auth.getUser();
      if (!data) {
        alert("Please login to view this page")
        const router = useRouter();
        router.push('/login')
      }
      

      const lowerCaseEmail = data.user.email.toLowerCase();
 
      const { data: userData, error: userError } = await supabase
          .from('userdata')
          .select('*')
          .eq('email', lowerCaseEmail)
          .single();
          if (userError) {
            console.error('Error fetching user data:', userError.message);
            return { error: 'Failed to fetch user data.' };
          } 
      if (data) { 
        console.log("userData....."+userData.id)
        
        setUserData({
          profilePhotoURL: userData.profilePhotoURL,
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          birthDate: userData.birthDate,
          interests: userData.interests,
        });
        setLoading(false);

      }
  }
  fetchData();
  }, []);

  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Profile Section */}
      <div className="lg:col-span-1">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex flex-col items-center mb-6">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <Image 
              src={userData.profilePhotoURL || null} 
              alt="Profile Photo" 
              width={120} 
              height={120} 
              className="rounded-full border-4 border-white shadow-lg object-cover h-64 w-64" 
            />
          </div>

          {/* Create Pin Button */}
          <Link 
            href="/account/createPin"
            className="px-4 py-2 bg-yellow-500 hover:bg-upinGreen/90 text-white rounded-lg w-full text-center transition-all"
          >
            Create Pin
          </Link>
        </div>
          <h2 className="text-3xl font-bold text-white mb-8">Profile</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
            </div>

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

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={userData.firstName || ""}
                  onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={userData.lastName || ""}
                  onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Interests</label>
                <input
                  type="text"
                  value={userData.interests || ""}
                  onChange={(e) => setUserData({...userData, interests: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Birthdate</label>
                <input
                  type="date"
                  value={userData.birthDate || ""}
                  onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Motionbutton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-2 bg-emerald-500/80 hover:bg-emerald-500/90 text-white rounded-lg shadow-lg transition-all"
                text= "Update Profile"
                
                // disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Motionbutton>
              
              <form action={logout}  className="flex-1">
                <Motionbutton
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-2 bg-red-500/80 hover:bg-red-500/90 text-white rounded-lg shadow-lg transition-all"
                        text="Sign Out" children={''} />
                                      
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection