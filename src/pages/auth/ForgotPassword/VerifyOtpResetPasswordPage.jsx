import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import "./VerifyOtpResetPasswordPage.scss";

const { Title, Text } = Typography;

const VerifyOtpResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const email = localStorage.getItem("verifyForgotEmail") || "";
    const password = localStorage.getItem("verifyForgotPassword") || "";
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await authService.resetPassword({ email, otp: values.otp, newPassword:password });
            const { statusCode, message: msg, error } = response
            if (statusCode === 200) {
                message.success({
                    content: "🎉 Password reset successfully! Redirecting to login...",
                    duration: 2,
                    style: { fontSize: "16px" },
                });
                localStorage.removeItem("verifyForgotEmail");
                localStorage.removeItem("verifyForgotPassword");
                setTimeout(() => navigate("/login"), 2000);
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
                    <Title level={3} style={{ textAlign: "center", marginBottom: "12px" }}>
                        Verify OTP reset pasword
                    </Title>
                    <Text style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>
                        Enter the OTP sent to <strong>{email}</strong>
                    </Text>
                    <Form name="verify-otp-reset-password" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="otp"
                            rules={[
                                { required: true, message: "Please enter the OTP!" },
                                { pattern: /^[0-9]{6}$/, message: "OTP must be a 6-digit number!" },
                            ]}
                        >
                            <Input prefix={<CodeOutlined />} placeholder="Enter 6-digit OTP" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block loading={loading} style={{ borderRadius: "6px" }}>
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

export default VerifyOtpResetPasswordPage;