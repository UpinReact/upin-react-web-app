// app/pin/PinActions.ts
import axios from 'axios';
import { createClient } from 'utils/supabase/client';


const MAX_PIN_DISTANCE = 300; // in miles
const MAX_TIME_TO_JOIN = 5; // in hours

interface HandleEndPinNowProps {
  pinId: string;
  setHasEnded: (ended: boolean) => void;
  getPinDetails: () => void;
}

interface PinJoinPressResult {
  success: boolean;
  message?: string;
  data?: any;
  pinType?: string;
  start_date?: string | number;
}

interface HandleJoinPressProps {
  pinId: string;
  pinDetails: {
    host_id?: string;
    pin_type: string;
    meetupname: string;
    is_community_hosted?: boolean;
    isgooglesearch?: boolean;
    start_date?: string | number;
  };
  userId: string;
  distancetoPin?: number | string;
  setJoinedUsers: (data: any) => void;
  setUserStatus: (status: any) => void;
  getPinDetails: (refresh?: boolean) => void;
}

// Web equivalent of React Native Alert
const showAlert = (title: string, message: string, buttons?: { text: string; onPress?: () => void; style?: string }[]) => {
  if (buttons && buttons.length > 1) {
    // For confirm dialogs
    const confirmed = window.confirm(`${title}\n\n${message}`);
    const confirmButton = buttons.find(b => b.style !== 'cancel');
    const cancelButton = buttons.find(b => b.style === 'cancel');
    
    if (confirmed && confirmButton?.onPress) {
      confirmButton.onPress();
    } else if (!confirmed && cancelButton?.onPress) {
      cancelButton.onPress();
    }
  } else {
    // Simple alert
    window.alert(`${title}\n\n${message}`);
  }
};

// Web equivalent of React Native Share
const shareLink = async (message: string) => {
  if (navigator.share) {
    // Use Web Share API if available (mobile browsers)
    try {
      await navigator.share({
        text: message,
      });
    } catch (error) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(message);
      showAlert('Link Copied', 'The share link has been copied to your clipboard!');
    } catch (error) {
      // Fallback to manual copy
      showAlert('Share Link', `Copy this link to share:\n\n${message}`);
    }
  }
};



// Handle leaving a pin
export async function handleLeavePin(userId: string, pinId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('handle_leave_pin', { user_id_param: userId, pin_id: pinId });

    if (error) {
      console.error("Error leaving pin:", error.message);
      return { success: false, message: error.message };
    }

    return data;
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    return { success: false, message: error.message };
  }
}

// Get pin invitation id based on userid and pinid where user is invited
export async function fetchPinInviteId(userId: string, pinId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from("pininvites")
      .select("id, *")
      .eq("invitee_id", userId)
      .eq("pin_id", pinId)
      .eq("status", "invited")
      .single();

    if (error) {
      console.error("Error fetching invite details:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    return { success: false, message: error.message };
  }
}

// Accept pin invite
export async function acceptPinInvite(invitationId: string, pinId: string, userId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.rpc("accept_pin_invite", {
      invitation_id: invitationId,
      pin_id: pinId,
      user_accepting_invite: userId,
    });

    if (error) {
      console.error("Error accepting invite to join pin:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    return { success: false, message: error.message };
  }
}

// Handle leave pin press (web version)
export async function handleLeavePress(userId: string, pinId: string, onSuccess?: () => void) {
  const confirmed = window.confirm("Are you sure you want to leave this pin?");
  
  if (!confirmed) {
    console.log("Leave cancelled");
    return;
  }

  try {
    const result = await handleLeavePin(userId, pinId);

    if (!result.success) {
      console.error("Error leaving pin:", result.message);
      return;
    }
    
    if (onSuccess) onSuccess();
    // await calculateAwardedPointstoRemove('joinedpin', userId) // Add when you have this function
  } catch (error: any) {
    console.error("Unexpected error leaving:", error.message);
  }
}

// Handle invited press (web version)
export async function handleInvitedPress(userid: string, pin_id: string, getPinDetails: () => void) {
  try {
    const fetchResponse = await fetchPinInviteId(userid, pin_id);

    // const notification_id = await fetchInvitedNotificationByPin(pin_id, userid) // Add when available

    if (!fetchResponse.success) {
      console.error("Error fetching invite details:", fetchResponse.message);
      return;
    }

    const response = await acceptPinInvite(
      fetchResponse.data.id,
      pin_id,
      userid
    );

    if (!response.success) {
      console.error("Error accepting invite to join pin:", response.message);
      return;
    }

    // if(notification_id) {
    //   await markNotificationAsSeen(notification_id) // Add when available
    // }

    alert("Invite accepted!");
    getPinDetails();
  } catch (error: any) {
    console.error("Unexpected error accepting invite:", error.message);
  }
}

// Calculate distance to pin (web version - basic haversine formula)
export function calculateDistanceToPin(
  pinLatitude: number, 
  pinLongitude: number, 
  userLocation: { latitude: number; longitude: number }
) {
  if (!userLocation) {
    console.log('Error: userLocation is undefined.');
    return '0';
  }

  // Haversine formula for distance calculation
  const R = 3959; // Earth's radius in miles
  const dLat = (userLocation.latitude - pinLatitude) * Math.PI / 180;
  const dLon = (userLocation.longitude - pinLongitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pinLatitude * Math.PI / 180) * Math.cos(userLocation.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance.toFixed(2).toString();
}

// Fetch nearby pins with client-side filtering
export async function fetchNearbyPins(
  userLatitude: number, 
  userLongitude: number, 
  radiusInMiles: number
) {
  const supabase = createClient();
  
  // Call the fetch_all_pins RPC to get the pins that start today and up to 3 days from now
  const { data: pins, error } = await supabase.rpc('fetch_all_pins');

  if (error) {
    console.error('Error fetching pins:', error);
    return [];
  }

  const radiusInMeters = radiusInMiles * 1609.34;

  // Filter the pins based on the distance to the user's location and pin_type
  const nearbyPins = pins.filter((pin: any) => {
    // Haversine formula for distance calculation in meters
    const R = 6371000; // Earth's radius in meters
    const dLat = (pin.latitude - userLatitude) * Math.PI / 180;
    const dLon = (pin.longitude - userLongitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLatitude * Math.PI / 180) * Math.cos(pin.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Check if the pin is within the desired radius
    const isDistanceValid = distance <= radiusInMeters;

    // Check if the pin_type is 'Public' or 'Private'
    const isTypeValid = pin.pin_type === 'Public' || pin.pin_type === 'Private';

    return isDistanceValid && isTypeValid;
  });

  return nearbyPins;
}