// app/pin/components/PinPassDetailsComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCartOutlined, InfoCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import styles from './PinPassDetailsComponent.module.css';
import usePinDetails from '../hooks/usePinDetails';
import { createClient } from 'utils/supabase/client';

interface PinPassInfo {
  pinpass_id: number;
  ticket_price: number;
  max_tickets: number;
  sales_end: string;
  pinpass_description: string;
  host_stripe_account_id: string;
  pin_name: string;
  refund_policy: string;
}

interface PinPassDetailsComponentProps {
  userId?: string;
}

export default function PinPassDetailsComponent({ userId }: PinPassDetailsComponentProps) {
  const params = useParams();
  const pinId = params.id as string;
  const { pinPassId } = usePinDetails(pinId);
  
  const [showPricing, setShowPricing] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<PinPassInfo | null>(null);
  const [fetchingTicketInfo, setFetchingTicketInfo] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  
  const supabase = createClient();

  // Mock data for development - replace with actual API call later
  useEffect(() => {
    setFetchingTicketInfo(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockTicketInfo: PinPassInfo = {
        pinpass_id: 22,
        ticket_price: 25.00,
        max_tickets: 50,
        sales_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        pinpass_description: "Join us for an exclusive pin pass experience! Includes access to premium areas and special perks.",
        host_stripe_account_id: "acct_1RIgm5R2H5VGXBYC",
        pin_name: "46438",
        refund_policy: "Full refund available up to 24 hours before the event. After that, refunds are at the discretion of the host. No refunds for no-shows."
      };
      
      setTicketInfo(mockTicketInfo);
      setFetchingTicketInfo(false);
    }, 500);
  }, []); // No dependencies needed for mock data

  // Calculate pricing breakdown
  const calculatePricing = (ticketPrice: number) => {
    const stripePercent = 0.029;
    const stripeFlatCents = 30;
    const upinPercent = 0.05;

    const basePriceCents = Math.round(ticketPrice * 100);
    const upinFeeCents = Math.round(basePriceCents * upinPercent);

    // Calculate total user charge to cover all fees
    const totalChargeCents = Math.round((basePriceCents + upinFeeCents + stripeFlatCents) / (1 - stripePercent));

    // Stripe fee is the rest
    const stripeFeeCents = totalChargeCents - basePriceCents - upinFeeCents;

    return {
      basePrice: ticketPrice,
      upinFee: upinFeeCents / 100,
      stripeFee: stripeFeeCents / 100,
      total: totalChargeCents / 100
    };
  };


const handleProceedToCheckout = async () => {
  const { data: checkoutData, error } = await supabase.functions.invoke('pinPassStripeCheckout', {
    body: {
          pin_id: "40026",
          ticket_id: "10",
          stripe_account_id: "acct_1RQZwHQxugd8ylNc", 
          user_id: "1",
          pinName: "40026",
    },
  });

  if (checkoutData?.checkout_url) {
    window.location.href = checkoutData.checkout_url;
  }
};

  if (fetchingTicketInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticketInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>Unable to load ticket information</p>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing(ticketInfo.ticket_price);
  const salesEndDate = new Date(ticketInfo.sales_end);
  const isSalesActive = salesEndDate > new Date();

  return (
    <div className={styles.container}>
      {!showPricing ? (
        // Initial view - compact pricing display
        <div className={styles.compactView}>
          <div className={styles.priceHeader}>
            <div className={styles.priceDisplay}>
              <span className={styles.priceLabel}>Pin Pass</span>
              <span className={styles.priceAmount}>${ticketInfo.ticket_price.toFixed(2)}</span>
            </div>
            <div className={styles.totalDisplay}>
              <span className={styles.totalLabel}>Total: ${pricing.total.toFixed(2)}</span>
            </div>
          </div>
          
          {isSalesActive ? (
            <div className={styles.actionButtons}>
              <button 
                onClick={() => setShowPricing(true)}
                className={styles.viewDetailsButton}
              >
                <InfoCircleOutlined /> View Details
              </button>
              <button 
                onClick={handleProceedToCheckout}
                className={styles.buyNowButton}
                disabled={isProcessingCheckout}
              >
                <ShoppingCartOutlined /> 
                {isProcessingCheckout ? 'Processing...' : 'Purchase Pin Pass'}
              </button>
            </div>
          ) : (
            <div className={styles.salesEndedMessage}>
              <p>Ticket sales have ended</p>
              <small>Sales ended on {salesEndDate.toLocaleDateString()}</small>
            </div>
          )}
        </div>
      ) : (
        // Expanded view - full pricing breakdown
        <div className={styles.expandedView}>
          <div className={styles.header}>
            <h3 className={styles.title}>Pin Pass Details</h3>
            <button 
              onClick={() => setShowPricing(false)}
              className={styles.collapseButton}
            >
              ×
            </button>
          </div>

          {/* Pin Pass Description */}
          {ticketInfo.pinpass_description && (
            <div className={styles.descriptionSection}>
              <p className={styles.description}>{ticketInfo.pinpass_description}</p>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className={styles.pricingSection}>
            <h4 className={styles.sectionTitle}>
              <CreditCardOutlined /> Price Breakdown
            </h4>
            
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Pin Pass</span>
                <span className={styles.priceValue}>${pricing.basePrice.toFixed(2)}</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Service Fee (5%)</span>
                <span className={styles.priceValue}>+${pricing.upinFee.toFixed(2)}</span>
              </div>
              
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Payment Processing (2.9% + $0.30)</span>
                <span className={styles.priceValue}>+${pricing.stripeFee.toFixed(2)}</span>
              </div>
              
              <div className={styles.totalDivider}></div>
              
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Ticket Info */}
          <div className={styles.ticketInfoSection}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Available Tickets:</span>
              <span className={styles.infoValue}>{ticketInfo.max_tickets}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Sales End:</span>
              <span className={styles.infoValue}>
                {salesEndDate.toLocaleDateString()} at {salesEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Refund Policy */}
          <div className={styles.refundSection}>
            <h4 className={styles.sectionTitle}>
              <InfoCircleOutlined /> Refund Policy
            </h4>
            <p className={styles.refundText}>
              {ticketInfo.refund_policy || 'Please contact the host for refund information.'}
            </p>
            <p className={styles.refundNote}>
              For special requests, please contact the event host directly.
            </p>
          </div>

          {/* Action Buttons */}
          {isSalesActive ? (
            <div className={styles.checkoutActions}>
              <button 
                onClick={handleProceedToCheckout}
                className={styles.checkoutButton}
                disabled={isProcessingCheckout}
              >
                <ShoppingCartOutlined /> 
                {isProcessingCheckout ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          ) : (
            <div className={styles.salesEndedMessage}>
              <p>Ticket sales have ended</p>
              <small>Sales ended on {salesEndDate.toLocaleDateString()}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}