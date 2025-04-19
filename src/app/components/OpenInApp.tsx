'use client'
import { useState, useEffect } from 'react';

import supabase from 'utils/supabase/supabase';

const OpenInAppBanner = ({link}) => {
  const [showBanner, setShowBanner] = useState(false);

  const [user_id, setUser_id] = useState(null);

  useEffect(() => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setShowBanner(true);
    }
  }, []);
  

  const getUserId = async () => {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()
  
    if (error) {
      console.error(error)
      return null
    }
  
    return session?.user?.id || null
  }
  
  getUserId().then(userId => {
    setUser_id(userId);
    console.log('User ID:', userId)
  })

  const handleOpenApp = () => {
    // Replace with your actual deep link
    window.location.href = `upin://pin/user/${user_id}`;
  };

  const handleCloseBanner = () => {
    setShowBanner(false); // Close the banner
  };
  if (!showBanner) return null;

  return (
    <div style={{
      backgroundColor: '#34D399', // emerald green
      color: 'white',
      padding: '12px',
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 9999
    }}>
      <span>Open this page in the Upin app!</span>
      <button 
        onClick={handleOpenApp}
        style={{
          marginLeft: '12px',
          backgroundColor: 'white',
          color: '#34D399',
          padding: '6px 12px',
          border: 'none',
          borderRadius: '6px'
        }}
      >
        Open App
      </button>
      <button
        onClick={handleCloseBanner}
        style={{
          position: 'absolute',
          top: '12px',
          right: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        X
      </button>
    </div>
  );
};

export default OpenInAppBanner;
