import React from 'react';
import GoogleMapReact from 'google-map-react';
import EventMarker from './EventMarker'; // Import your marker component
import GOOGLE_MAPS_KEY from '../../../secretes';

interface MapProps {
  events: {
    lat: number;
    lng: number;
    title: string;
    description: string;
  }[];
}

const MyMap: React.FC<MapProps> = ({ events }) => {
 

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
      >
        {events.map((event, index) => (
          <EventMarker
            key={index}
            lat={event.lat}
            lng={event.lng}
            title={event.title}
            description={event.description}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default MyMap;