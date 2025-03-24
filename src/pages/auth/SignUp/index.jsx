import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { addCart} from "../../../services/cartService";
const { Title, Text } = Typography;

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.signup(values);
      const userID= response.data.userID
      await addCart({ user:{userID:userID}});
      message.success({
        content: "🎉 Registration Successful! Redirecting to login...",
        duration: 2,
        style: { fontSize: "16px" },
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage = error.response.error || "An error occurred. Please try again.";
      message.error(errorMessage);
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
                <Form.Item name="email" rules={[{ required: true, type: "email", message: "Invalid email!" }]}>
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phoneNumber" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "Invalid phone!" }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="Phone" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="CI" rules={[{ required: true, pattern: /^[0-9]{12}$/, message: "CI must be 12 digits!" }]}>
              <Input prefix={<IdcardOutlined />} placeholder="Citizen ID" />
            </Form.Item>

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
