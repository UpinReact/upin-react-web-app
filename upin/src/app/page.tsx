'use client'
import {APIProvider, Map} from '@vis.gl/react-google-maps';
export default function Home() {

const GOOGLE_MAPS_API_KEY="AIzaSyBx2yc0Ns_2GkG5mA40H4kAVOLnO_ADJTk";
  return (
    <div>
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map  
     
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3.2}
      gestureHandling={'greedy'}
      disableDefaultUI={false}
    />
    </APIProvider>
    </div>
  )
}
