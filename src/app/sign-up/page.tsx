"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, checkEmailExists } from "./actions";
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
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { allCountries } from "country-telephone-data";
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
  countryCode: string;
  phone: string;
  gender: string;
  customGender?: string;
  birthdate: string;
  bio: string;
  interests: string[];
}

export default function SignUpPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCustomGender, setShowCustomGender] = useState(false);
  const router = useRouter();

  // Generate country options from library
  const countryOptions = allCountries.map(country => ({
    value: country.dialCode,
    label: `+${country.dialCode} (${country.name})`
  }));

  const interestOptions = [
     "Building",
  "Cars",
  "Creative Arts",
  "Gaming",
  "Literature",
  "Music",
  "Business",
  "Hiking",
  "Gym",
  "Chilling",
  "Fitness",
  "Health",
  "Real Estate",
  "Travel",
  "Finance",
  "Food",
  ];

  const handleGenderChange = (value: string) => {
    if (value === "Other") {
      setShowCustomGender(true);
    } else {
      setShowCustomGender(false);
      form.setFieldValue("customGender", "");
    }
  };

  const handleSubmit = async (values: SignUpFormData) => {
    setLoading(true);

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(values.email);
      
      if (emailExists) {
        message.error("This email is already registered. Please use a different email or try logging in.");
        setLoading(false);
        return;
      }

      // Generate OTP and send via Textbelt
      const fullPhoneNumber = `+${values.countryCode}${values.phone}`;
      const otpCode = Math.floor(100000 + Math.random() * 900000);

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: fullPhoneNumber,
          message: `Your Upin verification code is ${otpCode}`,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store form data and OTP in localStorage for OTP screen
        localStorage.setItem('signupFormData', JSON.stringify(values));
        localStorage.setItem('generatedOtp', otpCode.toString());
        
        message.success("Verification code sent to your phone!");
        router.push("/sign-up/otp-entry");
      } else {
        message.error("Failed to send verification code. Please check your phone number.");
      }
    } catch (error) {
      message.error("Error processing signup. Please try again.");
      console.error('Error in signup:', error);
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

            <Form.Item
              label="Phone Number"
              required
              className={styles.phoneNumberSection}
            >
              <Input.Group compact>
                <Form.Item
                  name="countryCode"
                  noStyle
                  initialValue="1"
                  rules={[{ required: true, message: "Please select your country code" }]}
                >
                  <Select
                    style={{ width: '120px' }}
                    className={styles.countryCodeSelect}
                    showSearch
                    placeholder="1"
                    options={countryOptions}
                    filterOption={(input, option) =>
                      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  noStyle
                  rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                  <Input
                    style={{ width: 'calc(100% - 120px)' }}
                    placeholder="Enter your phone number"
                    className={styles.phoneInput}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Row gutter={[16, 0]}>
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
              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: "Please select your gender" }]}
                >
                  <Select 
                    placeholder="Select your gender" 
                    className={styles.select}
                    onChange={handleGenderChange}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {showCustomGender && (
              <Form.Item
                name="customGender"
                label="Please specify"
                rules={[{ required: true, message: "Please specify your gender" }]}
              >
                <Input
                  prefix={<EditOutlined />}
                  placeholder="Enter your gender"
                  className={styles.input}
                />
              </Form.Item>
            )}

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