import { createClient } from '../../../utils/supabase/client';

type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  meetupname: string;
  description: string;
};

type SupabaseResponse = {
  data: Pin[] | null;
  error: Error | null;
};

export async function fetchPins(): Promise<Pin[]> {
  const supabase = createClient();

  try {
    const { data, error }: SupabaseResponse = await supabase
      .from('pins')
      .select('*')
      .eq("is_ended", "FALSE")
      .limit(100);

      console.log('Fetched pins:', data); // Debugging log
    if (error) {
      throw new Error(`Error fetching pins: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching pins:', error);
    return [];
  }
}