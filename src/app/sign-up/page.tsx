"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  DatePicker,
  Typography,
  Card,
  Row,
  Col,
  Space,
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import styles from "./SignUp.module.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  birthdate: string;
  bio: string;
  interests: string[];
}

export default function SignUpPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const interestOptions = [
    "Music",
    "Movies",
    "Gaming",
    "Chilling",
    "Literature",
    "Travel",
    "Sports",
    "Art",
    "Technology",
    "Food",
  ];

  const handleSubmit = async (values: SignUpFormData) => {
    setLoading(true);
    
    const submissionData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "interests" && Array.isArray(value)) {
        value.forEach((interest: string) => submissionData.append("interests", interest));
      } else if (key === "birthdate") {
        submissionData.append(key, value?.format("YYYY-MM-DD") || "");
      } else {
        submissionData.append(key, String(value || ""));
      }
    });

    try {
      const result = await signup(submissionData);
      if (result.success) {
        message.success("Account created successfully!");
        router.push("/private");
      } else {
        message.error(result.message || "An error occurred");
      }
    } catch (error) {
      message.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.formWrapper}
      >
        <Card className={styles.signupCard} bordered={false}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Title level={1} className={styles.title}>
              Create Account
            </Title>
            <Text className={styles.subtitle}>
              Join us and start your journey today
            </Text>
          </motion.div>

          <Divider className={styles.divider} />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
            size="large"
            requiredMark={false}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: "Please enter your first name" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your first name"
                    className={styles.input}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: "Please enter your last name" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your last name"
                    className={styles.input}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                className={styles.input}
              />
            </Form.Item>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className={styles.input}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    validateConfirmPassword,
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className={styles.input}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter your phone number"
                    className={styles.input}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="birthdate"
                  label="Date of Birth"
                  rules={[{ required: true, message: "Please select your date of birth" }]}
                >
                  <DatePicker
                    placeholder="Select your date of birth"
                    className={styles.datePicker}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select your gender" }]}
            >
              <Select placeholder="Select your gender" className={styles.select}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="prefer not to say">Prefer not to say</Option>
              </Select>
            </Form.Item>

            <Form.Item name="interests" label="Interests">
              <Checkbox.Group className={styles.interestGroup}>
                <Row gutter={[8, 8]}>
                  {interestOptions.map((interest) => (
                    <Col xs={12} sm={8} md={6} key={interest}>
                      <Checkbox value={interest} className={styles.interestCheckbox}>
                        {interest}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item name="bio" label="Bio (Optional)">
              <TextArea
                rows={3}
                placeholder="Tell us a bit about yourself..."
                className={styles.textarea}
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item className={styles.submitSection}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.submitButton}
                size="large"
                block
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={styles.loginLink}
          >
            <Text>
              Already have an account?{" "}
              <Link href="/login" className={styles.link}>
                Sign in here
              </Link>
            </Text>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}