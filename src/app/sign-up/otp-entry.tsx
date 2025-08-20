"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions";
import { motion } from "framer-motion";
import {
  Input,
  Button,
  Typography,
  Card,
  message,
  Space,
} from "antd";
import type { InputRef } from "antd";
import styles from "../signup/SignUp.module.css";

const { Title, Text } = Typography;

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

export default function OtpEntryScreen() {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState<SignUpFormData | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const router = useRouter();
  const otpRefs = useRef<(InputRef | null)[]>([]);

  useEffect(() => {
    // Get stored data from localStorage
    const storedFormData = localStorage.getItem('signupFormData');
    const storedOtp = localStorage.getItem('generatedOtp');
    
    if (!storedFormData || !storedOtp) {
      message.error("Session expired. Please start over.");
      router.push("/signup");
      return;
    }
    
    setFormData(JSON.parse(storedFormData));
    setGeneratedOtp(storedOtp);
  }, [router]);

  const handleOTPChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otpCode.join('');
    
    if (enteredOtp.length !== 6) {
      message.error("Please enter the complete 6-digit code.");
      return;
    }
    
    if (enteredOtp !== generatedOtp) {
      message.error("Invalid verification code. Please try again.");
      return;
    }

    if (!formData) {
      message.error("Form data not found. Please start over.");
      router.push("/signup");
      return;
    }

    setLoading(true);
    
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "interests" && Array.isArray(value)) {
        value.forEach((interest: string) => submissionData.append("interests", interest));
      } else if (key === "birthdate") {
        submissionData.append(key, value?.format?.("YYYY-MM-DD") || value || "");
      } else if (key === "gender") {
        const genderValue = value === "Other" && formData.customGender 
          ? formData.customGender 
          : String(value || "");
        submissionData.append(key, genderValue);
      } else if (key !== "customGender") {
        submissionData.append(key, String(value || ""));
      }
    });

    try {
      const result = await signup(submissionData);
      if (result.success) {
        // Clear localStorage
        localStorage.removeItem('signupFormData');
        localStorage.removeItem('generatedOtp');
        
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

  const resendOTP = async () => {
    if (!formData) return;

    setResendLoading(true);
    const fullPhoneNumber = `+${formData.countryCode}${formData.phone}`;
    const newOtpCode = Math.floor(100000 + Math.random() * 900000);

    try {
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
        setGeneratedOtp(newOtpCode.toString());
        localStorage.setItem('generatedOtp', newOtpCode.toString());
        setOtpCode(['', '', '', '', '', '']);
        message.success("New verification code sent!");
      } else {
        message.error("Failed to resend code. Please try again.");
      }
    } catch (error) {
      message.error("Error resending code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const goBack = () => {
    localStorage.removeItem('signupFormData');
    localStorage.removeItem('generatedOtp');
    router.push("/signup");
  };

  if (!formData) {
    return null; // Will redirect in useEffect
  }

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
            style={{ textAlign: 'center' }}
          >
            <Title level={1} className={styles.title}>
              Verify Your Phone
            </Title>
            <Text className={styles.subtitle}>
              We sent a 6-digit code to +{formData.countryCode} {formData.phone}
            </Text>
          </motion.div>

          <div style={{ margin: '40px 0', textAlign: 'center' }}>
            <Space size="small">
              {otpCode.map((digit, index) => (
                <Input
                  key={index}
                  ref={(ref) => {
                    otpRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChange={(e) => handleOTPChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  style={{
                    width: 50,
                    height: 50,
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    borderRadius: 8,
                    border: '2px solid #e8e8e8'
                  }}
                />
              ))}
            </Space>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className={styles.submitButton}
              size="large"
              block
            >
              Verify & Create Account
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#666' }}>
                Didn't receive the code?{' '}
              </Text>
              <Button 
                type="link" 
                onClick={resendOTP}
                loading={resendLoading}
                style={{ padding: 0, color: '#667eea' }}
              >
                Resend Code
              </Button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="link" 
                onClick={goBack}
                style={{ padding: 0, color: '#667eea' }}
              >
                Back to Sign Up
              </Button>
            </div>
          </Space>
        </Card>
      </motion.div>
    </div>
  );
}