// app/pin/PinPassFunctions.ts
'use client';

import { createClient } from 'utils/supabase/client';

type InsertPinTicketInfoArgs = {
  pinId: number
  hostId: number
  ticketPrice: number
  salesEnd: string // ISO format: '2025-05-01T23:59:00'
  stripeAccountId: string
  maxTickets?: number // optional, defaults to 0
  pinPassDescription: string
  refundPolicy: string
}

export async function insertPinTicketInfo({
  pinId,
  hostId,
  ticketPrice,
  salesEnd,
  stripeAccountId,
  maxTickets = 0,
  pinPassDescription,
  refundPolicy,
}: InsertPinTicketInfoArgs): Promise<number | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('insert_pin_ticket_info', {
    p_pin_id: pinId,
    p_host_id: hostId,
    p_ticket_price: ticketPrice,
    p_sales_end: salesEnd,
    p_stripe_account_id: stripeAccountId,
    p_max_tickets: maxTickets,
    p_pinpass_description: pinPassDescription,
    p_refund_policy: refundPolicy,
  })

  if (error) {
    console.error('Failed to insert pin ticket info:', error)
    return null
  }

  return data // This is the inserted row's ID
}

export const getStripeAccountIdForUser = async (
  userId: number,
  stripeMode: string
): Promise<string | null> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("host_stripe_accounts")
    .select("stripe_account_id")
    .eq("user_id", userId)
    .eq("stripe_mode", stripeMode.toLowerCase())
    .eq("status", "active") // ✅ Ensure status is active
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch Stripe account:", error.message);
    return null;
  }

  return data?.stripe_account_id ?? null;
};

export const fetchPinPassInfo = async (pin_id: number, host_id: number) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('fetch_pin_pass_info', {
      pin_id_input: pin_id,
      host_id_input: host_id,
    });

  if (error) {
    console.error('[fetchPinPassInfo] Supabase RPC error:', error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.error('[fetchPinPassInfo] No pin pass info found');
    return null;
  }

  return data[0]; // we expect only one row
};

export const getPinPassInfoById = async (ticketId: number) => {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('fetch_pinpass_by_id', {
    ticket_id_input: ticketId,
  });

  if (error) {
    console.error('[getPinPassById] Supabase RPC error:', error.message);
    return null;
  }

  return data?.[0] || null;
};

interface PinPass {
  pin_id: number;
  purchased_at: string; // ISO 8601 format (timestamptz)
  meetupname: string;
  description: string;
  mainphotourl: string;
  location: string;
  start_date: string; // ISO 8601 format (timestamptz)
  end_date: string;   // ISO 8601 format (timestamptz)
  ticket_id: number | string
}

export async function fetchPinPassesForUser(userId: number): Promise<PinPass[] | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.rpc('fetch_pin_passes_for_user', { user_id_param: userId });

    if (error) {
      console.error('❌ Error fetching pin passes:', error);
      return null;
    }

    if (!data) {
      console.warn('⚠️ No pin passes found.');
      return null;
    }

    return data as PinPass[];
  } catch (err) {
    console.error('❌ Unexpected error fetching pin passes:', err);
    return null;
  }
}

/**
 * Fetches the ticket ID from pin_ticket_info for a given pinId
 * @param pinId - the ID of the pin
 * @returns ticket ID (string) or null if not found
 */
export const getTicketIdForPin = async (pinId: string): Promise<string | null> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pin_ticket_info')
    .select('id')
    .eq('pin_id', pinId)
    .maybeSingle(); // returns null instead of throwing if no row found

  if (error) {
    console.error('Failed to fetch ticket ID:', error);
    return null;
  }

  return data?.id ?? "";
};

export const getPublicTicketIdByPin = async (pinId: string): Promise<string | null> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ticket_public_info_view')
    .select('id')
    .eq('pin_id', pinId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch ticket ID from public view:', error);
    return null;
  }

  return data?.id ?? "";
};

// takes pin id and user id when coming from pin details since it doesn't have the ticket id there
export const fetchPinpassTicketInfo = async (pin_id: number, user_id: number) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('fetch_pinpass_ticket_info', {
      pin_id_param: pin_id,
      user_id_param: user_id,
    });

  if (error) {
    console.error('Error fetching pinpass ticket info:', error);
    throw error;
  }

  return data;
};

export const fetchPayoutEligiblePins = async (
  stripeAccountId: string
) => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.rpc("fetch_payout_eligible_pins", {
      stripe_account_id_param: stripeAccountId,
    });

    if (error) {
      console.error("❌ Error fetching payout-eligible pins:", error);
      return { success: false, error, data: null };
    }

    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { success: false, error: err, data: null };
  }
};

// version that only needs ticket id
export const fetchPinpassTicketById = async (ticketId: number) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc('fetch_pinpass_ticket_by_id', { ticket_id_param: ticketId });

  if (error) {
    console.error('❌ Error fetching pinpass ticket by ID:', error.message);
    return null;
  }

  return data?.[0] || null;
};

/**
 * Calls the Supabase RPC to check pin pass availability. I.E: if sold out, or sales have ended
 * 
 * @param pinTicketInfoId - The ID of the pin_ticket_info row to check
 * @returns An object with ticket availability info or null on error
 */
export const checkPinpassAvailability = async (pinTicketInfoId: number | string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('check_pinpass_availability', {
    pin_ticket_info_id_input: pinTicketInfoId, // Pass the input param to the RPC
  });

  // Log and return null on error
  if (error) {
    console.error('Error checking pin pass availability:', error);
    return null;
  }

  // Return the first (and only) row from the result
  return data?.[0] || null;
};

// sets checked_in to true for the user in pin tickets, updates checked in at, and also updates their pinparticipants record if needed
export const checkInPinpassAttendee = async (
  userId: number,
  pinTicketId: number,
  pinId: number
): Promise<string> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.rpc('check_in_pinpass_attendee', {
      user_id_param: userId,
      pin_ticket_id_param: pinTicketId,
      pin_id_param: pinId,
    });

    if (error) {
      console.error('❌ Check-in RPC error:', error);
      return 'Check-in failed. Please try again.';
    }

    return data ?? 'Unknown result';
  } catch (err) {
    console.error('❌ Check-in exception:', err);
    return 'Unexpected error occurred during check-in.';
  }
};

// resends pin pass confirmation email
export const resendPinPassConfirmation = async (
  userId: number,
  pinId: number,
  ticket_id: number,
  start_date: string,
  end_date: string
): Promise<{ success: boolean; errorMessage?: string }> => {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.functions.invoke("sendPinPassConfirmation", {
      body: {
        user_id: userId,
        pin_id: pinId,
        ticket_id,
        start_date,
        end_date,
      },
    });

    if (error) {
      return { success: false, errorMessage: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, errorMessage: err.message || "Unknown error" };
  }
};

/**
 * Calls the Supabase RPC `can_refund_ticket` to determine if a ticket is eligible for refund.
 *
 * @param pin_ticket_id - The ID of the ticket to check
 * @returns An object:
 *   {
 *     is_refundable: boolean, // true if refund is allowed, false otherwise
 *     reason: string | null   // reason why it's not refundable (if applicable)
 *   }
 */
export const checkIfRefundAllowed = async (pin_ticket_id: number | string) => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('can_refund_ticket', { pin_ticket_id_input: pin_ticket_id });

    if (error) {
      console.error('❌ Error checking refund eligibility:', error.message);
      return {
        is_refundable: false,
        reason: 'Unable to check refund policy',
      };
    }

    return {
      is_refundable: data?.is_refundable ?? false,
      reason: data?.reason ?? null,
    };
  } catch (err) {
    console.error('❌ Unexpected error checking refund eligibility:', err);
    return {
      is_refundable: false,
      reason: 'Unexpected error occurred',
    };
  }
};

/**
 * Fetches a list of users who have checked in for a given pin ticket info ID.
 * 
 * @param pinTicketInfoId - The ID referencing pin_ticket_id in the pin_tickets table.
 * @returns An array of users who match:
 *          - pin_ticket_id = pinTicketInfoId
 *          - payment_status = 'completed'
 *          - checked_in = true
 *          Returns fields: ticket_id, id, email, firstname, lastname, profilephotourl, interests
 */
export const fetchCheckedInUsers = async (pinTicketInfoId: number) => {
  const supabase = createClient();
  
  // Call the Supabase RPC (Postgres function) named fetch_checked_in_users
  const { data, error } = await supabase.rpc('fetch_checked_in_users', {
    pin_ticket_info_id: pinTicketInfoId, // match the function param name
  });

  // Log and return empty array on error
  if (error) {
    console.error('❌ Error fetching checked-in users:', error);
    return [];
  }

  // Return the list of checked-in users
  return data;
};

// returns users who purchased a pin pass
export const fetchPurchasedPinPassUsers = async (pinTicketInfoId: number) => {
  const supabase = createClient();
  
  // Call the Supabase RPC (Postgres function) named fetch_checked_in_users
  const { data, error } = await supabase.rpc('fetch_ticketed_users', {
    pin_ticket_info_id: pinTicketInfoId, // match the function param name
  });

  // Log and return empty array on error
  if (error) {
    console.error('❌ Error fetching ticketed users:', error);
    return [];
  }

  // Return the list of checked-in users
  return data;
};

/**
 * Sends a refund confirmation email using SparkPost via an Edge Function.
 * 
 * @param userId - ID of the user
 * @param pinId - ID of the pin
 * @param ticketId - ID of the refunded ticket
 * @returns Object: { success: boolean; errorMessage?: string }
 */
export const resendRefundConfirmationEmail = async (
  userId: number,
  pinId: number,
  ticketId: number,
  refundAmount: number // already formatted (e.g., 3.55)
): Promise<{ success: boolean; errorMessage?: string }> => {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.functions.invoke("refundPinPassEmail", {
      body: {
        user_id: userId,
        pin_id: pinId,
        ticket_id: ticketId,
        refund_amount: refundAmount, // no conversion
      },
    });

    if (error) {
      return { success: false, errorMessage: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, errorMessage: err.message || "Unknown error" };
  }
};