// app/pin/[id]/PinPassButton.tsx
'use client';

import React, { useState } from 'react';
import styles from './PinPage.module.css';

interface PinPassButtonProps {
  pinId: string;
  user: string;
  pinPassId: string | null;
}

export default function PinPassButton({ pinId, user, pinPassId }: PinPassButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePinPassAction = async () => {
    setLoading(true);
    
    try {
      if (pinPassId) {
        // User already has a pin pass - view it
        console.log('Viewing pin pass:', pinPassId);
        // Add your logic to view/display the pin pass
        // This might open a modal, navigate to a page, etc.
      } else {
        // User needs to purchase a pin pass
        console.log('Purchasing pin pass for pin:', pinId);
        // Add your logic to handle pin pass purchase
        // This might redirect to payment, open purchase modal, etc.
      }
    } catch (error) {
      console.error('Error handling pin pass action:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePinPassAction}
      disabled={loading}
      className={`${styles.baseButton} ${styles.joinButton}`}
    >
      {loading ? (
        'Loading...'
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Join</span>
          <span>🔓</span>
        </div>
      )}
    </button>
  );
}