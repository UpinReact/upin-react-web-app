// app/pin/[id]/PinPageClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeftOutlined, 
  ThunderboltOutlined
} from '@ant-design/icons';
import styles from './PinPage.module.css';
import JoinPinButton from './JoinPinComponent';
import MiniMap from '../components/MiniMap';
import usePinDetails from '../hooks/usePinDetails';

interface PinPageClientProps {
  pinData: any;
  user: any;
  hasJoined: boolean;
  pinId: string;
}

export default function PinPageClient({ pinData, user, hasJoined, pinId }: PinPageClientProps) {
  // Use the hook to get dynamic data like joinedUsers
  const { joinedUsers, loading: hookLoading, pinPassId } = usePinDetails(pinId);

  console.log(`pinPassId: ${pinPassId}`)
  
  const joinedCount = joinedUsers.length;
  
  // Convert serialized date strings back to Date objects
  const startDate = new Date(pinData.start_date);
  const endDate = new Date(pinData.end_date);
  const isActive = endDate >= new Date();

  // Mock data for additional fields - these will come from the hook eventually
  const mockEventLink = "https://azonline.com/e-calendar/?_evDiscoveryPath=/event/107212619n-los-paisanos-live-at-baba-coffee";
  const mockDistance = "0.23 mi";
  const mockAges = "34";
  const mockAttended = "0";
  const mockInvited = "0";

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Left Column - Main Content */}
        <div className={styles.leftColumn}>
          {/* Hero Image */}
          <div className={styles.heroImage}>
            <button className={styles.backButton}>
              <ArrowLeftOutlined style={{ fontSize: '16px', color: '#374151' }} />
            </button>
            
            {pinData.mainphotourl ? (
              <Image 
                src={pinData.mainphotourl} 
                alt="Pin Image" 
                fill
                className={styles.heroImageContent}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className={styles.heroPlaceholder}>
                📍 Event Photo
              </div>
            )}
          </div>

          {/* Event Stats - Now under the photo */}
          <div className={styles.eventStatsSection}>
            <div className={styles.eventStatsGrid}>
              <div className={styles.eventStatItem}>
                <span className={styles.eventStatNumber}>{mockAges}</span>
                <div className={styles.eventStatLabel}>Ages</div>
              </div>
              <div className={styles.eventStatItem}>
                <span className={styles.eventStatNumber}>{mockAttended}</span>
                <div className={styles.eventStatLabel}>Attended</div>
              </div>
              <div className={styles.eventStatItem}>
                <span className={styles.eventStatNumber}>
                  {hookLoading ? '...' : joinedCount}
                </span>
                <div className={styles.eventStatLabel}>Joined</div>
              </div>
              <div className={styles.eventStatItem}>
                <span className={styles.eventStatNumber}>{mockInvited}</span>
                <div className={styles.eventStatLabel}>Invited</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            <h1 className={styles.title}>{pinData.meetupname}</h1>
            
            <p className={styles.description}>{pinData.description}</p>

            {/* Pin Type Tag */}
            <div className={styles.pinTypeTag}>
              <ThunderboltOutlined /> Public • {mockDistance}
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>📅</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Time Frame</div>
                  <div className={styles.detailValue}>
                    <strong>Start:</strong> {startDate.toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit", 
                      year: "numeric"
                    })}, {startDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </div>
                  <div className={styles.detailValue}>
                    <strong>End:</strong> {endDate.toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric"
                    })}, {endDate.toLocaleTimeString("en-US", {
                      hour: "numeric", 
                      minute: "2-digit",
                      hour12: true
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>📍</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Location</div>
                  <div className={styles.detailValue}>{pinData.location}</div>
                </div>
              </div>
            </div>

            {/* Map Section - Standalone */}
            {pinData.latitude && pinData.longitude && (
              <MiniMap 
                latitude={pinData.latitude}
                longitude={pinData.longitude}
                locationName={pinData.location}
              />
            )}

            {/* Event Link */}
            {mockEventLink && (
              <div className={styles.linkSection}>
                <div className={styles.detailLabel} style={{ marginBottom: '8px' }}>Event Link</div>
                <div className={styles.linkText}>{mockEventLink}</div>
              </div>
            )}

            {/* Third Party Notice */}
            <div className={styles.thirdPartyNotice}>
              <div className={styles.thirdPartyText}>
                This pin is hosted by a third party. Amount of attendees and timeframe may be inaccurate, 
                please view the event link for more detailed info.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Action Button Only */}
        <div className={styles.rightColumn}>
          {/* Status & Action Button */}
          <div className={`${styles.sideCard} ${styles.actionCard}`}>
            {!isActive ? (
              <div className={styles.statusSection}>
                <div className={styles.statusEnded}>
                  Event Ended ❌
                </div>
              </div>
            ) : user && hasJoined ? (
              <button className={`${styles.actionButton} ${styles.joinedButton}`} disabled>
                ✓ You've Joined!
              </button>
            ) : user ? (
              <JoinPinButton pinId={pinId} user={user.id} joinedCount={joinedCount} />
            ) : (
              <button className={`${styles.actionButton} ${styles.joinButton}`}>
                Sign In to Join Event
              </button>
            )}
          </div>

          {/* App Promo */}
          <div className={styles.appPromoBanner}>
            <div className={styles.appPromoText}>
              Get the full Upin experience
            </div>
            <p style={{ marginBottom: '16px', opacity: 0.9, fontSize: '14px' }}>
              Create events, join communities, and connect with people nearby.
            </p>
            <Link href="/get-the-app" className={styles.appPromoButton}>
              Download Mobile App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}