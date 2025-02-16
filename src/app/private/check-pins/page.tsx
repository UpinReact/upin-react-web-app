'use client';
import { userInfo } from 'os';
import React, { useEffect, useState } from 'react';
import createClient from 'utils/supabase/client';

const CheckPins = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClient();

  // Fetch pins for the current user
  const fetchPins = async (userId) => {
    console.log('Fetching pins for user:', userId);
    try {
      const { data: pins, error } = await supabase
        .from('pinparticipants')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setPins(pins);
    } catch (error) {
      console.error('Error fetching pins:', error);
      setError('Failed to fetch pins.');
    }
  };

  // Fetch user and userinfo
  const fetchUser = async () => {
    
    try {
      // Get the authenticated user from Supabase (stored in cookies)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      console.log('Fetched user:', authUser);

      // Get additional user info from the 'userdata' table
      const { data: userinfo, error: userInfoError } = await supabase
        .from('userdata')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (userInfoError) throw userInfoError;

      // Set the user state with combined data
      setUser({ ...authUser, ...userinfo });
      console.log('Fetched user:', user);
      
      // Fetch pins for the user
      await fetchPins(authUser.id);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Pins I am active in</h1>
      {pins.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pins.map((pin) => (
              <tr key={pin.id}>
                <td>{pin.title}</td>
                <td>{pin.description}</td>
                <td>{pin.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pins found.</p>
      )}
    </div>
  );
};

export default CheckPins;