import { createClient } from '../../../utils/supabase/client'

type Pin = {
  latitude: number;
  longitude: number;
  meetupname: string;
  description: string;
};

// Async function to fetch pins from Supabase
export default async function fetchPins(): Promise<Pin[]> {
  const supabase = createClient(); 

try{
  let { data: pins, error } = await supabase
  .from('pins')
  .select('*')
  if (error )throw error;
  console.log(pins)
  return pins as Pin[];


} catch(error){
  console.log(error);
  return [];
}
}

// const events = [
//     { lat: 37.7749, lng: -122.4194, title: 'Event 1', description: 'Description for Event 1' },
//     { lat: 34.0522, lng: -118.2437, title: 'Event 2', description: 'Description for Event 2' },
//     // ... more events
//   ];
  
// export default events