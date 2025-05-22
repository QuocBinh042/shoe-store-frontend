import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../../../services/authService";
import { setUser } from "../../../redux/accountSlice";
import "./Login.scss"
const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      const { statusCode, data } = response;

      if (statusCode === 200 && data?.access_token) {
        message.success("Login successful");

        const { user } = data;
        dispatch(setUser({
          userID: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          roles: user.roles,
        }));

        const isAdmin = user.roles?.some(role => role.roleType === "SUPER_ADMIN");
        if (isAdmin) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          const redirectTo = location.state?.from || "/";
          navigate(redirectTo, { replace: true }); 
        }
      } else {
        message.error("Login failed");
      }
    } catch (error) {
      const err = error.response?.data;
      const msg = err?.message || "Login error";

      if (err?.statusCode === 409 && msg === "User is not activated") {
        Modal.confirm({
          title: "Account not activated",
          content: "Your account has not been activated yet. Do you want to verify it now?",
          okText: "Verify Now",
          cancelText: "Cancel",
          async onOk() {
            try {
              const email = values.email;
              localStorage.setItem("verifyEmail", email);
              localStorage.setItem("verifyPassword", values.password);
              await authService.resendOtp(email);

              message.success("OTP has been resent. Please check your email.");
              navigate("/verify-otp");
            } catch (e) {
              message.error("Failed to resend OTP.");
            }
          },
        });
      } else {
        message.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)" }}>
      <Col xs={22} sm={18} md={12} lg={6}>
        <Card bordered={false} className="login-card">
          <Title level={2} className="login-title">Login</Title>
          <Form name="login" onFinish={onFinish} layout="vertical" className="login-form">
            <Form.Item
              name="email"
              label="Email address"
              rules={[{ required: true, message: "Please input your email address!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your email address" className="login-input" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" className="login-input" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block htmlType="submit" loading={loading} className="login-button">
                Login
              </Button>
            </Form.Item>
            <Button type="link" block className="forgot-password" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Button>
            <Button type="default" block className="back-button" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Text className="signup-text">
              Don't have an account? <a href="/sign-up">Sign up here</a>
            </Text>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;