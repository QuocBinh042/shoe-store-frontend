import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Button, Result, Typography, Spin } from "antd";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const PaymentResult = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("vnp_ResponseCode");
    const txnRef = queryParams.get("vnp_TxnRef");
    const amount = queryParams.get("vnp_Amount");
    const vnpTmnCode = queryParams.get("vnp_TmnCode");

    if (status === "00") {
      setPaymentStatus("success");
      setOrderDetails({
        orderCode: txnRef,
        totalAmount: amount,
        vnpTmnCode: vnpTmnCode,
      });
    } else {
      setPaymentStatus("failed");
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        className="max-w-lg w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg rounded-lg" style={{ textAlign: "center", padding: 24 }}>
          {paymentStatus === "success" ? (
            <>
              <Result
                status="success"
                title="🎉 Payment Successful!"
                subTitle={`Order Code: ${orderDetails?.orderCode}`}
                extra={[
                  <Button type="primary" key="home">
                    <Link to="/">Return to Home</Link>
                  </Button>,
                  <Button key="account">
                    <Link to="/account">Go to my order</Link>
                  </Button>,
                ]}
              />
              <Card className="mt-4 bg-gray-50 p-4 rounded-md shadow-sm">
                <Title level={4}>Order Information</Title>
                <Text strong>Total Amount: </Text>
                <Text>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orderDetails?.totalAmount / 100)}
                </Text>
                <br />
                <Text strong>Payment Method: </Text>
                <Text>VNPay</Text>
                <br />
                <Text strong>Transaction Code: </Text>
                <Text>{orderDetails?.vnpTmnCode}</Text>
              </Card>
            </>
          ) : paymentStatus === "failed" ? (
            <Result
              status="error"
              title="❌ Payment Failed!"
              subTitle="Please try again later."
              extra={[
                <Button type="primary" key="home">
                  <Link to="/">Return to Home</Link>
                </Button>,
                <Button key="account">
                  <Link to="/account">Go to my order</Link>
                </Button>,
              ]}
            />
          ) : (
            <Spin size="large" />
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentResult;
