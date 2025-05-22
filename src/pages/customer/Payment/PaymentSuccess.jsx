import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Button, Result, Typography, Spin } from "antd";
import { motion } from "framer-motion";
import "./PaymentSuccess.scss"
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white px-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="shadow-xl rounded-xl p-6 bg-white/90 backdrop-blur-sm border border-gray-200">
          {paymentStatus === "success" ? (
            <>
              <Result
                status="success"
                icon={<span className="text-5xl text-green-500">✔</span>}
                title={<span className="text-3xl font-semibold text-gray-800">🎉 Payment Successful!</span>}
                subTitle={<span className="text-lg text-gray-600">Order Code: {orderDetails?.orderCode}</span>}
                extra={[
                  <Button type="primary" key="home" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/">Return to Home</Link>
                  </Button>,
                  <Button key="account" className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                    <Link to="/account">Go to my order</Link>
                  </Button>,
                ]}
              />
              <Card className="mt-6 bg-gray-50 p-5 rounded-lg shadow-md">
                <Title level={4} className="text-gray-800">Order Information</Title>
                <Text strong className="text-gray-700">Total Amount: </Text>
                <Text className="text-gray-600">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(orderDetails?.totalAmount / 100)}
                </Text>
                <br />
                <Text strong className="text-gray-700">Payment Method: </Text>
                <Text className="text-gray-600">VNPay</Text>
                <br />
                <Text strong className="text-gray-700">Transaction Code: </Text>
                <Text className="text-gray-600">{orderDetails?.vnpTmnCode}</Text>
              </Card>
            </>
          ) : paymentStatus === "failed" ? (
            <Result
              status="error"
              icon={<span className="text-5xl text-red-500">❌</span>}
              title={<span className="text-3xl font-semibold text-gray-800">❌ Payment Failed!</span>}
              subTitle={<span className="text-lg text-gray-600">Please try again later.</span>}
              extra={[
                <Button type="primary" key="home" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/">Return to Home</Link>
                </Button>,
                <Button key="account" className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                  <Link to="/account">Go to my order</Link>
                </Button>,
              ]}
            />
          ) : (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentResult;