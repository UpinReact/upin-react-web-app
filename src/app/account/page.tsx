'use client';
import { useEffect, useState } from 'react';
import AccountForm from './account-form';
import { getAccountData } from 'src/app/login/actions';  // Adjust if needed
import { useContext,createContext } from 'react';


// Create a context for user data
const UserContext = createContext(null);

export default function Account() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAccountData();
        if (result.error) setError(result.error);
        else setUserData(result.user);
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };
    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={userData}>
      <AccountForm  />
    </UserContext.Provider>
  );
}


// Hook for consuming user data context in child components
export function useUserData() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserContext.Provider");
  }
  return context;
}
export { UserContext };