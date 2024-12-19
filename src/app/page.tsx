import React from 'react';
import dynamic from 'next/dynamic';

import Hero from './components/Hero';
// Lazy load the MyMap component
const MyMap = dynamic(() => import('./components/MyMap'), {
  loading: () => <div>Loading map...</div>, // Optional loading state
  ssr: false, // Disable server-side rendering for the map component
});

export default function Home() {
  return (
    
    <div>
      <Hero />
      <MyMap /> {/* Dynamically loaded MyMap component */}
    </div>
  
  );
}

