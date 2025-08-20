// app/pin/hooks/usePinDetails.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "utils/supabase/client";
import { useAuthHandler } from "@/context/authHandler";

// !!! DO NOT import from ../PinFunctions here (that file uses server client).
// import { getPinById, getJoinedUsers, ... } from '../PinFunctions'  // <-- remove

interface UserStatus {
  isHost: boolean;
  userCanJoinPin: boolean;
  userCanViewChat: boolean;
  canViewPinSpecifics: boolean;
  userIsJoined: boolean;
  userHasRequested: boolean;
  userIsInvited: boolean;
}

interface PinPassAvailability {
  sales_ended: boolean;
  tickets_sold: number | string;
  max_tickets: number | string;
  sold_out: boolean;
  sales_end_time: string;
}

/* ---------------- client-safe helpers (use client SDK) ---------------- */

async function getPinByIdClient(pinId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('pins').select('*').eq('id', pinId).single();
  if (error) throw error;

  return {
    ...data,
    start_date: data?.start_date ? new Date(data.start_date).toISOString() : null,
    end_date: data?.end_date ? new Date(data.end_date).toISOString() : null,
    latitude: data?.latitude == null ? null : Number(data.latitude),
    longitude: data?.longitude == null ? null : Number(data.longitude),
  };
}

async function getJoinedUsersClient(pinId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pinparticipants")
    .select("participant_id")
    .eq("pin_id", pinId);
  if (error) throw error;
  return data ?? [];
}

async function fetchAttendedUsersClient(pinId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('fetch_attended_users', { pin_id_param: pinId });
  if (error) throw error;
  return data ?? [];
}

async function fetchPinChatIdClient(pinId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('pinchats').select('id').eq('pin_id', pinId);
  if (error) throw error;
  return data && data.length ? data[0].id : null;
}

async function fetchSharedPinCountClient(pinId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('fetch_shared_pin_count', { pin_id_param: pinId });
  if (error) throw error;
  return data ?? 0;
}

async function checkUserPinStatusClient(userId: string, pinId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('check_user_pin_status', {
    user_id_param: userId,
    pin_id_param: pinId,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}

/* --------------------------------------------------------------------- */

const usePinDetails = (pinId: string) => {
  const [pinDetails, setPinDetails] = useState<any>(null);
  const [joinedUsers, setJoinedUsers] = useState<any[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isGoogleEvent, setIsGoogleEvent] = useState(false);
  const [isEventBrite, setIsEventBrite] = useState(false);
  const [thirdPartyHost, setThirdPartyHost] = useState("");
  const [hostInfo, setHostInfo] = useState<any>(null);
  const [thirdPartyLink, setThirdPartyLink] = useState("");
  const [communityId, setCommunityID] = useState('');
  const [community, setCommunity] = useState<any>(null);
  const [communityName, setCommunityName] = useState<string | null>(null);
  const [communityOwnerUserID, setCommunityOwnerUserID] = useState<string | null>(null);
  const [publicPin, setPublicPin] = useState(false);
  const [pinPassId, setPinPassId] = useState('');
  const [pinPassAvailability, setPinPassAvailability] = useState<PinPassAvailability | null>(null);
  const [paidPin, setPaidPin] = useState(false);
  const [pinChatID, setPinChatID] = useState('');
  const [privatePin, setPrivatePin] = useState(false);
  const [sharedPinCount, setSharedPinCount] = useState(0);
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isHost: false,
    userCanJoinPin: false,
    userCanViewChat: false,
    canViewPinSpecifics: false,
    userIsJoined: false,
    userHasRequested: false,
    userIsInvited: false,
  });
  const [hasEnded, setHasEnded] = useState(false);
  const [atPinUsers, setAtPinUsers] = useState<any[]>([]);
  const [attendedUsers, setAttendedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

    const { userData, isReady } = useAuthHandler();
  const userId = userData?.id || null;

// console.log('user id in usepindetails', userId)

  const extractURL = (description: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const urls = description.match(urlRegex);
    return urls ? urls[0] : null;
  };

  const getPinDetails = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);
      else setLoading(true);

      const [details, joinedUsersData, attendedUsersData, userStatusResult] =
        await Promise.all([
          getPinByIdClient(pinId),
          getJoinedUsersClient(pinId),
          fetchAttendedUsersClient(pinId),
          userId ? checkUserPinStatusClient(userId, pinId) : Promise.resolve(null),
        ]);

      if (details) {
        setPinDetails(details);
        setIsGoogleEvent(!!details.isgooglesearch);

        setPublicPin(details.pin_type === "Public");
        setPrivatePin(details.pin_type === "Private");
        setPaidPin(details.pin_type === "Paid");

        const descriptionLower = (details.description || "").toLowerCase();

        if (descriptionLower.includes("eventbrite")) {
          setThirdPartyHost("eventbrite");
          setIsEventBrite(true);
        } else if (descriptionLower.includes("facebook")) {
          setThirdPartyHost("facebook");
        }

        const url = extractURL(descriptionLower);
        if (url) setThirdPartyLink(url);

        try {
          const [chatId, count] = await Promise.all([
            fetchPinChatIdClient(pinId),
            fetchSharedPinCountClient(pinId),
          ]);
          if (chatId) setPinChatID(chatId);
          setSharedPinCount(count);
        } catch (e) {
          console.error('Error fetching additional pin data:', (e as any)?.message || e);
        }

        setJoinedUsers(joinedUsersData);
        setAttendedUsers(attendedUsersData);
        setHasEnded(new Date(details.end_date) < new Date());

        if (userStatusResult && userId) {
          setUserStatus({
            isHost: userStatusResult.ishost || userId === communityOwnerUserID,
            userIsJoined: userStatusResult.isjoined,
            userHasRequested: userStatusResult.isrequested,
            userIsInvited: userStatusResult.isinvited,
            userCanJoinPin:
              !!userId &&
              !userStatusResult.ishost &&
              !userStatusResult.isjoined &&
              !userStatusResult.isrequested,
            userCanViewChat: !!userId && (userStatusResult.ishost || userStatusResult.isjoined),
            canViewPinSpecifics: userStatusResult.ishost || userStatusResult.isjoined || !!details.isgooglesearch,
          });
        }
      }
    } catch (error: any) {
      console.error("Unexpected error getting pin details:", error?.message || error);
    } finally {
      if (isRefreshing) setRefreshing(false);
      else setLoading(false);
    }
  }, [pinId, userId, communityOwnerUserID]);

  useEffect(() => {
    if (pinId) getPinDetails();
  }, [getPinDetails, pinId]);

  const memoizedUserStatus = useMemo(() => userStatus, [userStatus]);

  return {
    pinDetails,
    joinedUsers,
    invitedUsers,
    refreshing,
    userStatus: memoizedUserStatus,
    hostInfo,
    hasEnded,
    atPinUsers,
    attendedUsers,
    loading,
    isEventBrite,
    thirdPartyHost,
    thirdPartyLink,
    setHasEnded,
    getPinDetails,
    setPinDetails,
    setRefreshing,
    setUserStatus,
    setHostInfo,
    setAtPinUsers,
    setLoading,
    setJoinedUsers,
    setInvitedUsers,
    sharedPinCount,
    privatePin,
    publicPin,
    pinPassId,
    pinPassAvailability,
    paidPin,
    communityName,
    community,
    communityOwnerUserID,
    communityId,
    pinChatID,
    isGoogleEvent,
  };
};

export default usePinDetails;
