'use client';
import { useEffect, useState } from 'react';
import AccountForm from './account-form';
import { getAccountData } from 'src/app/login/actions';  // Adjust if needed


export default function Account() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async ()=> {
      const result = await getAccountData();
    
      if (result.error) setError(result.error);
      else setUserData(result.user);
    }
    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return <AccountForm user={userData} />;
}
