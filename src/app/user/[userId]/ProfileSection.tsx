"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  Avatar,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Statistic,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  CalendarOutlined,
  ManOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import defaultUserImage from "public/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";
import googleImg from "public/GetItOnGooglePlay_Badge_Web_color_English-XvR5LaEp.png";
import appleImg from "public/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg";
import { updateUserData } from "@/app/private/action";
import dayjs from "dayjs";
import styles from "./ProfileSection.module.css";
import {
  getFollowers,
  getFollowing,
  getFollowingStatuses,
} from "@/app/account/profileFunctions";

const { Title, Text, Paragraph } = Typography;

// Utility function to extract and clean interests
const extractInterests = (interestsString: string): string[] => {
  if (!interestsString) return [];

  // Remove outer brackets and split by comma
  const cleaned = interestsString.replace(/^\[|\]$/g, "").trim();
  if (!cleaned) return [];

  return cleaned
    .split(",")
    .map((interest) =>
      interest.trim().replace(/^["']|["']$/g, "").trim()
    )
    .filter((interest) => interest.length > 0);
};

interface ProfileSectionProps {
  profileData: any;
  isOwnProfile: boolean;
  currentUser: any;
  profileUserId: number;   // ← added
  currentUserId: number;   // ← added
  communities: any[];
}

const ProfileSection = ({
  profileData,
  isOwnProfile,
  currentUser,
  profileUserId,
  currentUserId,
  communities,
}: ProfileSectionProps) => {
  const router = useRouter();

  const [showAppModal, setShowAppModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [form] = Form.useForm();

  // New: local state for fetched data (keeps your styles/JSX intact)
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    if (isOwnProfile) {
      const hasSeenPopup = localStorage.getItem("hasSeenPopup");
      if (!hasSeenPopup) {
        setShowAppModal(true);
        localStorage.setItem("hasSeenPopup", "true");
      }
    }
  }, [isOwnProfile]);

  useEffect(() => {
    if (profileData && isOwnProfile) {
      form.setFieldsValue({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        interests: profileData.interests || "",
        birthDate: profileData.birthDate ? dayjs(profileData.birthDate) : null,
      });
    }
  }, [profileData, isOwnProfile, form]);

  // New: fetch followers, following, and following statuses here
  useEffect(() => {
    (async () => {
      try {
        const [
          fetchedFollowers,
          fetchedFollowing,
          fetchedStatuses,
        ] = await Promise.all([
          getFollowers(profileUserId),
          getFollowing(profileUserId),
          getFollowingStatuses(currentUserId, profileUserId),
        ]);

        setFollowers(fetchedFollowers ?? []);
        setFollowing(fetchedFollowing ?? []);
        setIsFollowing(fetchedStatuses?.following_user ?? false);
      } catch (error) {
        console.error("Error fetching follow info:", error);
        setFollowers([]);
        setFollowing([]);
        setIsFollowing(false);
      }
    })();
  }, [profileUserId, currentUserId]);

  const handleUpdate = async (values: any) => {
    if (!profileData || !isOwnProfile) return;

    setUpdateLoading(true);
    try {
      const updateData = {
        ...values,
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : null,
      };
      await updateUserData(profileData.id, updateData);
      setShowEditModal(false);
      message.success("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFollow = async () => {
    console.log(`${isFollowing ? "Unfollow" : "Follow"} user ${profileData.id}`);
    // TODO: wire your Supabase mutation here, then set state based on result.
    setIsFollowing(!isFollowing);
    message.success(
      isFollowing ? "Unfollowed successfully" : "Following successfully"
    );
  };

  const getAge = (birthDate: string) => {
    if (!birthDate) return "Not specified";
    return Math.floor(
      (new Date().getTime() - new Date(birthDate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
  };

  const interests = extractInterests(profileData?.interests || "");

  // Function to group interests into rows of two
  const groupInterests = (interests: string[]) => {
    const rows: string[][] = [];
    for (let i = 0; i < interests.length; i += 2) {
      rows.push(interests.slice(i, i + 2));
    }
    return rows;
  };

  const interestRows = groupInterests(interests);

  if (!profileData) {
    return (
      <div className={styles.loading}>
        <Text className={styles.loadingText}>Loading...</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Cover Photo */}
      <Card className={styles.coverCard} bodyStyle={{ padding: 0, height: 200 }}></Card>

      {/* Profile Info Card */}
      <Card className={styles.profileInfoCard}>
        <div className={styles.profileContent}>
          {/* Avatar */}
          <Avatar
            size={150}
            src={profileData.profilePhotoURL || defaultUserImage.src}
            className={styles.avatar}
          />

          {/* Action Buttons */}
          <div className={styles.profileActions}>
            <Space>
              {isOwnProfile ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setShowEditModal(true)}
                  className={styles.editButton}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  type={isFollowing ? "default" : "primary"}
                  icon={isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
                  onClick={handleFollow}
                  className={isFollowing ? styles.followingButton : styles.followButton}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </Space>
          </div>

          {/* Name and Bio */}
          <div className={styles.profileInfo}>
            <Title level={2} className={styles.userName}>
              {profileData.firstName} {profileData.lastName}
            </Title>
            <Paragraph className={styles.bio}>
              {profileData.bio || "No bio provided"}
            </Paragraph>

            {/* Stats */}
            <Row gutter={24} className={styles.connectionStats}>
              <Col>
                <Statistic title="Followers" value={followers?.length || 0} />
              </Col>
              <Col>
                <Statistic title="Following" value={following?.length || 0} />
              </Col>
              <Col>
                <Statistic
                  title="Connections"
                  value={(followers?.length || 0) + (following?.length || 0)}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Row gutter={24} className={styles.mainContent}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Interests */}
          <Card title="Interests" className={styles.interestsCard}>
            {interests.length > 0 ? (
              <div className={styles.interestsContainer}>
                {interestRows.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.interestRow}>
                    {row.map((interest, index) => {
                      const globalIndex = rowIndex * 2 + index;
                      const isRanked = globalIndex < 3;

                      return (
                        <div
                          key={index}
                          className={`${styles.interestTag} ${
                            isRanked
                              ? styles.rankedInterestTag
                              : styles.regularInterestTag
                          }`}
                        >
                          {isRanked && (
                            <div className={styles.rankedInterestNumContainer}>
                              <span className={styles.rankedInterestText}>
                                {globalIndex + 1}
                              </span>
                            </div>
                          )}
                          <span className={styles.interestText}>{interest}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary" className={styles.noInterests}>
                No interests specified
              </Text>
            )}
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Info Card */}
          <Card title="Info" className={styles.infoCard}>
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div className={styles.infoItem}>
                <ManOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary" className={styles.infoLabel}>
                    Gender
                  </Text>
                  <div className={styles.infoValue}>
                    {profileData.gender || "Not specified"}
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <CalendarOutlined className={styles.infoIcon} />
                <div>
                  <Text type="secondary" className={styles.infoLabel}>
                    Age
                  </Text>
                  <div className={styles.infoValue}>
                    {getAge(profileData.birthDate)}
                  </div>
                </div>
              </div>
            </Space>
          </Card>

          {/* Badges Card */}
          <Card
            title={
              <Space>
                Badges
                <Tooltip title="Earn badges by completing activities">
                  <QuestionCircleOutlined className={styles.helpIcon} />
                </Tooltip>
              </Space>
            }
            className={styles.badgesCard}
          >
            <Text type="secondary" className={styles.noBadges}>
              No badges earned yet
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width={500}
        className={styles.editModal}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          className={styles.form}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input placeholder="Enter your first name" className={styles.input} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Enter your last name" className={styles.input} />
          </Form.Item>

          <Form.Item label="Interests" name="interests">
            <Input
              placeholder="Enter interests separated by commas"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item label="Birth Date" name="birthDate">
            <DatePicker style={{ width: "100%" }} className={styles.input} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setShowEditModal(false)} className={styles.cancelButton}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateLoading}
                className={styles.saveButton}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* App Download Modal */}
      <Modal
        title="Welcome to Upin!"
        open={showAppModal}
        onCancel={() => setShowAppModal(false)}
        footer={
          <Button
            type="primary"
            onClick={() => setShowAppModal(false)}
            className={styles.popupButton}
          >
            Close
          </Button>
        }
        width={500}
        className={styles.appModal}
      >
        <div className={styles.appModalContent}>
          <Paragraph className={styles.popupText}>
            For the best experience, we recommend downloading our app!
          </Paragraph>

          <Space direction="vertical" size={16} className={styles.appLinks}>
            <Link href="https://play.google.com/store/apps/details?id=com.benhavis.upinjtyc832ezysr5qkcjpax">
              <Image src={googleImg} height={60} width={180} alt="Google Play" />
            </Link>
            <Link href="https://apps.apple.com/us/app/upin/id1341978328">
              <Image src={appleImg} height={60} width={180} alt="App Store" />
            </Link>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileSection;
