import React, { useState, useCallback } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message, Spin } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { addCart } from "../../../services/cartService";
import debounce from "lodash/debounce";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [emailLoading, setEmailLoading] = useState(false);

  const checkEmailExists = useCallback(
    debounce(async (email, resolve, reject) => {
      setEmailLoading(true);
      try {
        const response = await authService.checkEmail(email);
        const { statusCode, data } = response;
        if (statusCode === 200) {
          data ? reject("This email is already registered!") : resolve();
        } else {
          reject("Cannot check email");
        }
      } catch (error) {
        reject("Cannot check email");
      } finally {
        setEmailLoading(false);
      }
    }, 500),
    []
  );

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.signup(values);
      const { statusCode, data, message: msg, error } = response;
      if (statusCode === 200) {
        const userID = data.userID;
        await addCart({ user: { userID } });

        localStorage.setItem("verifyEmail", values.email);
        localStorage.setItem("verifyPassword", values.password);
        await authService.resendOtp(values.email);

        message.success({
          content: "🎉 Registration Successful! Please check your email for OTP.",
          duration: 3,
          style: { fontSize: "16px" },
        });
        setTimeout(() => navigate("/verify-otp"), 2000);
      } else {
        message.error(`${error || msg || "Registration failed. Please try again."}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "An error occurred. Please try again.";
      message.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)" }}>
      <Col xs={22} sm={20} md={16} lg={10}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card bordered={false} className="signup-card">
            <Title level={3} className="signup-title">Register an account</Title>
            <Form name="signup" onFinish={onFinish} layout="vertical" className="signup-form">
              <Form.Item name="name" rules={[{ required: true, message: "Enter full name!" }]}>
                <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" className="signup-input" />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, type: "email", message: "Invalid email format!" },
                      {
                        validator: (_, value) =>
                          new Promise((resolve, reject) => {
                            if (!value) return resolve();
                            checkEmailExists(value, resolve, reject);
                          }),
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                      suffix={emailLoading ? <Spin size="small" /> : null}
                      size="large"
                      className="signup-input"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="phoneNumber" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "Invalid phone!" }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Phone" size="large" className="signup-input" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <Form.Item name="password" rules={[{ required: true, message: "Enter password!" }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" className="signup-input" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      { required: true, message: "Confirm password!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          return value === getFieldValue("password") ? Promise.resolve() : Promise.reject("Passwords do not match!");
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" className="signup-input" />
                  </Form.Item>
                </Col>
              </Row>

              <Button type="primary" block htmlType="submit" loading={loading} className="signup-button">
                Sign Up
              </Button>

              <Text className="signup-text">
                Already have an account? <a href="/login">Login</a>
              </Text>
            </Form>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default SignUpPage;