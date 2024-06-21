import React from 'react';

interface MarkerProps {
  lat: number;
  lng: number;
  title: string;
  description: string;
}

const EventMarker: React.FC<MarkerProps> = ({ lat, lng, title, description }) => {
  return (
    <div>
      {/* Customize the appearance of your marker here */}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default EventMarker;