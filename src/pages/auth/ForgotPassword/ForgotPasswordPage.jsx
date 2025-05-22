import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message, Modal } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../../../services/authService";
import "./ForgotPasswordPage.scss";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.checkEmail(values.email);
      const { statusCode, data } = response;

      if (statusCode === 200 && data) {
        if (values.password !== values.confirmPassword) {
          throw new Error("Passwords do not match!");
        }
        localStorage.setItem("verifyForgotEmail", values.email);
        localStorage.setItem("verifyForgotPassword", values.password);

        const otpResponse = await authService.sendOTPForgotPassword(values.email);
        if (otpResponse.data.statusCode === 200) {
          message.success({
            content: "🎉 OTP sent successfully! Please check your email.",
            duration: 3,
            style: { fontSize: "16px" },
          });
          setTimeout(() => navigate("/verify-otp-forgot-pasword"), 2000);
        } else if (otpResponse.data.statusCode === 400) {
          Modal.confirm({
            title: "Account not activated",
            content: "Your account has not been activated yet. Do you want to verify it now?",
            okText: "Verify Now",
            cancelText: "Cancel",
            async onOk() {
              try {
                await authService.resendOtp(values.email);
                message.success("OTP has been resent. Please check your email.");
                navigate("/verify-otp");
              } catch (e) {
                message.error("Failed to resend OTP.");
              }
            },
          });
        } else {
          throw new Error(otpResponse.message || "Failed to send OTP.");
        }
      } else {
        throw new Error("This email is not registered!");
      }
    } catch (error) {
      message.error(error.message || "Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)" }}>
      <Col xs={22} sm={18} md={12} lg={6}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card bordered={false} className="forgot-password-card">
            <Title level={3} className="forgot-password-title">
              Forgot Password
            </Title>
            <Text className="forgot-password-text">
              Enter your email, new password, and confirm password to receive an OTP.
            </Text>
            <Form
              name="forgot-password"
              onFinish={onFinish}
              layout="vertical"
              className="forgot-password-form"
            // initialValues={{ email: localStorage.getItem("verifyEmail") || "" }}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  size="large"
                  className="forgot-password-input"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your new password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New Password"
                  size="large"
                  className="forgot-password-input"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                rules={[{ required: true, message: "Please confirm your password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  size="large"
                  className="forgot-password-input"
                />
              </Form.Item>

              <Button
                type="primary"
                block
                htmlType="submit"
                loading={loading}
                className="forgot-password-button"
              >
                Send OTP
              </Button>

              <Button
                type="default"
                block
                className="back-button"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </Form>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;