// app/pin/PinActions.ts
import axios from 'axios';
import { createClient } from 'utils/supabase/server';
//import { handleEndPin, fetchKeyValue } from '../../utils/config';
//import { insertSharedPin } from './PinFunctions';
//import { insertPinJoinPress, fetchJoinedUsers, insertPinRequestPress, addLogRecord} from '../../utils/functions';
//import { getPinRequestID } from './PinFunctions';
// Note: You'll need to install and configure Amplitude for web
// import { track } from '@amplitude/analytics-browser';

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

// export const handleEndPinNow = async ({
//   pinId,
//   setHasEnded,
//   getPinDetails,
// }: HandleEndPinNowProps) => {
//   console.log('handleEndPinNow received props:', { pinId });
  
//   showAlert(
//     "Confirm End Pin",
//     "Are you sure you want to end your pin? This cannot be undone.",
//     [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "OK",
//         onPress: async () => {
//           try {
//             console.log('Alert OK pressed with pinId:', pinId);
//             await handleEndPin(pinId);
//             setHasEnded(true);
//             showAlert("Success", "Pin ended successfully!");
//             getPinDetails();
//           } catch (error: any) {
//             showAlert("Error", error.message);
//           }
//         },
//       },
//     ]
//   );
// };

interface HandleShareLinkProps {
  pinId: string;
  pinDetails: { meetupname: string };
  useUniversalLink?: boolean;
  userId: string;
}

// export const handleShareLink = async ({ 
//   pinId, 
//   pinDetails, 
//   useUniversalLink = true, 
//   userId 
// }: HandleShareLinkProps) => {
//   try {
//     let finalLink;
    
//     if (!useUniversalLink) {
//       // Create deep link and shorten it
//       const deepLinkUrl = `upin://pin/${pinId}`;
//       const response = await axios.get(
//         `https://tinyurl.com/api-create.php?url=${encodeURIComponent(deepLinkUrl)}`
//       );
//       finalLink = response.data;
//     } else {
//       // Use universal link (better for web)
//       finalLink = `https://upinlinks.co/pin/${pinId}`;
//     }

//     const message = `${finalLink}`;

//     await shareLink(message);

//     // Record the share in shared_pins
//     const insertResult = await insertSharedPin(userId, pinId);
//     if (!insertResult.success) {
//       console.error("Failed to record shared pin:", insertResult.error);
//     }

//   } catch (error: any) {
//     console.error('Error opening share dialog:', error.message);
//     showAlert('Error', 'Failed to generate share link.');
//   }
// };

// export const handleJoinPress = async ({
//   pinId,
//   pinDetails,
//   userId,
//   setJoinedUsers,
//   setUserStatus,
//   getPinDetails,
//   distancetoPin
// }: HandleJoinPressProps) => {
//   try {
//     // Convert distance to a number (in case it's a string)
//     const distance = Number(distancetoPin);

//     // Ensure pin start date is valid
//     const currentTime = new Date();
//     const pinStartTime = new Date(pinDetails.start_date); 

//     let differenceInHours = 0;

//     if (!isNaN(pinStartTime.getTime())) {
//       differenceInHours = Math.floor((pinStartTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60));
//     }

//     // Prevent joining if the event starts in 5 hours or sooner AND the user is more than 300 units away
//     if (differenceInHours <= MAX_TIME_TO_JOIN && distance > MAX_PIN_DISTANCE) {
//       showAlert(
//         "Ineligible to join",
//         "You must be within a 300 mile range to join a pin within a 5 hour starting time."
//       );
//       return; // Stop execution
//     }

//     const result: PinJoinPressResult = await insertPinJoinPress(
//       pinId,
//       pinDetails.host_id,
//       userId,
//       fetchJoinedUsers,
//       pinDetails.pin_type,
//       pinDetails.is_community_hosted,
//       pinDetails.isgooglesearch
//     );

//     if (result.success) {
//       // Track User joins pin (uncomment when Amplitude is set up)
//       // track('Pin joined', {
//       //   user_id: userId,
//       //   pin_id: pinId,
//       //   pin_name: pinDetails.meetupname,
//       //   created_time: new Date().toISOString(),
//       // });

//       if (result.pinType === "Public") {
//         setJoinedUsers(result.data);
//         setUserStatus((prev) => ({
//           ...prev,
//           userCanViewChat: true,
//           userCanJoinPin: false,
//           userIsJoined: true,
//         }));
//         getPinDetails(true); // Ensure to refresh details after state update

//         // Show success alert for public pins
//         showAlert(
//           "Joined Pin",
//           "You may view the full pin details in your My Pins section"
//         );
//       } else {
//         showAlert("Success", result.message);
//         setUserStatus((prev) => ({
//           ...prev,
//           userCanJoinPin: false,
//           userHasRequested: true,
//         }));
//       }
//     } else {
//       showAlert("Error", result.message);
//     }
//   } catch (error) {
//     showAlert("Error", "Failed to join the pin.");
//   }
// };

// export const handleRequestPinPress = async ({
//   pinId,
//   pinDetails,
//   userId,
//   setUserStatus,
//   getPinDetails,
// }: HandleJoinPressProps) => {
//   try {
//     console.log("Starting handleRequestPinPress...");
//     console.log("Inputs:", { pinId, pinDetails, userId });

//     // Call the insertPinRequestPress function to handle the request
//     console.log("Calling insertPinRequestPress with:", {
//       pinId,
//       hostId: pinDetails.host_id,
//       userId,
//       meetupName: pinDetails.meetupname,
//     });

//     const result = await insertPinRequestPress(
//       pinId,
//       pinDetails.host_id,
//       userId,
//       pinDetails.meetupname
//     );

//     console.log("insertPinRequestPress result:", result);

//     if (result.success) {
//       console.log("Request was successful. Updating user status...");
//       // Update user status after a successful request
//       showAlert("Success", result.message);
//       setUserStatus((prev) => ({
//         ...prev,
//         userCanJoinPin: false,
//         userHasRequested: true,
//       }));
//       console.log("User status updated. Refreshing pin details...");
//       getPinDetails(true); // Refresh the pin details
//     } else {
//       console.error("Request failed with message:", result.message);
//       // Handle errors by showing an alert
//       showAlert("Error", result.message);
//     }
//   } catch (error) {
//     console.error("Unexpected error in handleRequestPinPress:", error);
//     // Handle unexpected errors
//     showAlert("Error", "Failed to request to join the pin.");
//   }
// };

// export const handleUnrequest = async ({
//   pinId,
//   userId,
//   getPinDetails,
// }: {
//   pinId: string;
//   userId: string;
//   getPinDetails: () => Promise<void>;
// }) => {
//   try {
//     // Get the request ID
//     const requestID = await getPinRequestID(pinId, userId);
//     if (!requestID) {
//       throw new Error("No request ID found");
//     }

//     // Delete the pin invite using the request ID
//     const supabase = createClient(); // Create client instance when needed
//     const { data, error } = await supabase
//       .from("pininvites")
//       .delete()
//       .eq("id", requestID)
//       .select();

//     if (error) {
//       throw new Error(`Error removing request: ${error.message}`);
//     }

//     // Refresh pin details
//     await getPinDetails();
//   } catch (error: any) {
//     console.error("Error in handleUnrequest:", error);
//     showAlert(
//       "Error",
//       error.message || "An unexpected error occurred while removing the request."
//     );
//   }
// };