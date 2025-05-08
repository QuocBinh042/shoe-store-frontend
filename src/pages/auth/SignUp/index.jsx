import React, { useState, useCallback } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message ,Spin} from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { addCart } from "../../../services/cartService";
import debounce from "lodash/debounce";
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
    <Row justify="center" align="middle" style={{ height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Col xs={22} sm={16} md={12} lg={10}>
        <Card bordered={false} style={{ borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: "12px" }}>Create Account</Title>
          <Form name="signup" onFinish={onFinish} layout="vertical">
            <Form.Item name="name" rules={[{ required: true, message: "Enter full name!" }]}>
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>

            <Row gutter={12}>
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
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phoneNumber" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "Invalid phone!" }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="Phone" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item name="password" rules={[{ required: true, message: "Enter password!" }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
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
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" block htmlType="submit" loading={loading} style={{ borderRadius: "6px" }}>
              Sign Up
            </Button>

            <Text style={{ display: "block", textAlign: "center", marginTop: "12px" }}>
              Already have an account? <a href="/login">Login</a>
            </Text>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUpPage;