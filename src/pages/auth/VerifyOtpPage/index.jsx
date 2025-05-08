import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { data, useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/accountSlice";
const { Title, Text } = Typography;

const VerifyOtpPage = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const email = localStorage.getItem("verifyEmail") || "";
  const password = localStorage.getItem("verifyPassword") || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.verifyOtp({ email, otp: values.otp });
      const { statusCode, message: msg, error } = response.data;
      if (statusCode === 200) {
        message.success({
          content: "🎉 Email verified successfully! Redirecting to login...",
          duration: 2,
          style: { fontSize: "16px" },
        });
        const loginRes = await authService.login({ email, password });
        const { statusCode, data } = loginRes;
        if (statusCode === 200 && data?.access_token) {
          const { user } = data;
          dispatch(setUser({
            userID: user.id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            roles: user.role,
          }));
          localStorage.removeItem("verifyEmail");
          localStorage.removeItem("verifyPassword");
          const redirectTo ="/";
          navigate(redirectTo, { replace: true });
        }
      } else {
        message.error(`${error || msg || "Invalid OTP"}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "An error occurred. Please try again.";
      message.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await authService.resendOtp(email);
      message.success({
        content: "OTP resent successfully! Please check your email.",
        duration: 2,
        style: { fontSize: "16px" },
      });
    } catch (error) {
      const errorMessage = error.response?.data || "Failed to resend OTP. Please try again.";
      message.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card bordered={false} style={{ borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: "12px" }}>Verify Your Email</Title>
          <Text style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>
            Enter the OTP sent to <strong>{email}</strong>
          </Text>
          <Form name="verify-otp" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: "Please enter the OTP!" },
                { pattern: /^[0-9]{6}$/, message: "OTP must be a 6-digit number!" },
              ]}
            >
              <Input prefix={<CodeOutlined />} placeholder="Enter 6-digit OTP" />
            </Form.Item>

            <Button type="primary" block htmlType="submit" loading={loading} style={{ borderRadius: "6px" }}>
              Verify OTP
            </Button>

            <Button
              type="link"
              block
              onClick={handleResendOtp}
              loading={resendLoading}
              style={{ marginTop: "12px" }}
              disabled={!email}
            >
              Resend OTP
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default VerifyOtpPage;