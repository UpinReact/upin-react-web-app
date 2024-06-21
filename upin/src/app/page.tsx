'use client'
import GOOGLE_MAPS_API_KEY from "../../secretes"
import {APIProvider, Map} from '@vis.gl/react-google-maps';
export default function Home() {


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
