import React from 'react';
import { Card, Badge, Empty, Tag, Typography } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import styles from './MyPins.module.css';

const { Title, Text, Paragraph } = Typography;

// Mock data types - replace with your actual types
interface Pin {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  isHost: boolean;
  status: 'current' | 'past';
}

// Mock data - replace with actual data fetching
const mockPins: Pin[] = [
  {
    id: '1',
    title: 'Coffee Chat Downtown',
    location: 'Starbucks, Main St',
    date: '2024-08-16',
    time: '2:00 PM',
    participants: 3,
    maxParticipants: 5,
    isHost: true,
    status: 'current',
  },
  // Add more mock data as needed
];

const MyPins: React.FC = () => {
  // Filter pins by category
  const currentPins = mockPins.filter(pin => pin.status === 'current' && !pin.isHost);
  const hostingPins = mockPins.filter(pin => pin.status === 'current' && pin.isHost);
  const joinedPins = mockPins.filter(pin => pin.status === 'current' && !pin.isHost);
  const pastPins = mockPins.filter(pin => pin.status === 'past');

  const PinCard: React.FC<{ pin: Pin }> = ({ pin }) => (
    <Card
      className={styles.pinCard}
      hoverable
      actions={[<span key="view">View Details</span>]}
    >
      <div className={styles.cardHeader}>
        <Title level={4} className={styles.pinTitle}>{pin.title}</Title>
        {pin.isHost && <Tag color="blue">Host</Tag>}
      </div>

      <div className={styles.pinDetails}>
        <div className={styles.detailItem}>
          <EnvironmentOutlined />
          <Text className={styles.detailText}>{pin.location}</Text>
        </div>

        <div className={styles.detailItem}>
          <CalendarOutlined />
          <Text className={styles.detailText}>{pin.date} at {pin.time}</Text>
        </div>

        <div className={styles.detailItem}>
          <UserOutlined />
          <Text className={styles.detailText}>
            {pin.participants}/{pin.maxParticipants} people
          </Text>
        </div>
      </div>
    </Card>
  );

  const PinSection: React.FC<{ title: string; pins: Pin[]; emptyMessage: string }> = ({
    title,
    pins,
    emptyMessage,
  }) => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Title level={3} className={styles.sectionTitle}>
          {title}
        </Title>
        <Badge count={pins.length} className={styles.countBadge} />
      </div>

      {pins.length > 0 ? (
        <div className={styles.pinsGrid}>
          {pins.map(pin => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      ) : (
        <Empty description={emptyMessage} className={styles.emptyState} />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <Title level={1} className={styles.pageTitle}>My Pins</Title>
          <Paragraph className={styles.pageDescription}>
            Manage your pin activities and history
          </Paragraph>
        </header>

        <div className={styles.sectionsContainer}>
          <PinSection
            title="Current"
            pins={currentPins}
            emptyMessage="No current pins. Join some pins to get started!"
          />

          <PinSection
            title="Hosting"
            pins={hostingPins}
            emptyMessage="You're not hosting any pins right now. Create one to bring people together!"
          />

          <PinSection
            title="Joined"
            pins={joinedPins}
            emptyMessage="You haven't joined any pins yet. Browse available pins to join!"
          />

          <PinSection
            title="Past"
            pins={pastPins}
            emptyMessage="No past pins to show. Your pin history will appear here."
          />
        </div>
      </div>
    </div>
  );
};

export default MyPins;
