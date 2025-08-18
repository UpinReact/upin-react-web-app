// app/pin/[id]/page.tsx
import React from 'react';
import PinPageClient from './PinPageClient';
import { 
  getCurrentUser, 
  getUserParticipationStatus, 
  getPinById
} from '../PinFunctions';

interface PinPageProps {
  params: Promise<{ id: string }>;
}

async function PinPage({ params }: PinPageProps) {
  const { id } = await params;
  
  if (!id) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
        <p>No pin found</p>
      </div>
    );
  }

  try {
    // Get current user
    const user = await getCurrentUser();
    
    // Initialize participation status
    let hasJoined = false;

    // If user is logged in, check their participation status
    if (user) {
      try {
        const participationStatus = await getUserParticipationStatus(id, user.id);
        hasJoined = participationStatus.hasJoined;
      } catch (error) {
        console.error('Error checking user participation:', error);
      }
    }

    // Get pin data
    const pinData = await getPinById(id);

    if (!pinData) {
      return (
        <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
          <p>Pin not found</p>
        </div>
      );
    }

    const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;

    

    // Pass all data to client component
    return (
      <PinPageClient 
        pinData={pinData}
        user={serializedUser}
        hasJoined={hasJoined}
        pinId={id}
      />
    );

  } 
  
  catch (error) {
    console.error('Error loading pin page:', error);
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
        <p>Error loading pin data</p>
      </div>
    );
  }
}

export default PinPage;