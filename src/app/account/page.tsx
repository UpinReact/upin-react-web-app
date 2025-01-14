// // pages/account.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from "@/../utils/supabase/supabase";
// import { parseCookies } from 'nookies';

// export default function Account() {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//  const cookies = parseCookies();
//  console.log("upin auth token: "+ cookies.email);
//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         // Get session from Supabase client
//         const { data: { session }, error } = await supabase.auth.getSession();
//         console.log("this is the session" + session);
//         if (error) throw error;

//         if (session) {
//           setUser(session.user);
//         }
//       } catch (err) {
//         setError('Failed to fetch session');
//       }
//     };

//     fetchSession();
//   }, []);

//   if (error) return <div>{error}</div>;
//   if (!user) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Welcome, {user.email}</h1>
//     </div>
//   );
// }
