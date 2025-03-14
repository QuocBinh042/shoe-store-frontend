import React, { useEffect, useState } from "react";
import { Button, Result, Space, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Title } = Typography;

const PaymentResult = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("vnp_ResponseCode");
    const txnRef = queryParams.get("vnp_TxnRef");
    const vnp_TmnCode = queryParams.get("vnp_TmnCode");
    // Check status from URL
    if (status === "00") {
      setPaymentStatus("success");
      setOrderDetails({
        orderCode: txnRef,
        totalAmount: queryParams.get("vnp_Amount"),
        vnp_TmnCode:vnp_TmnCode
      });
    } else {
      setPaymentStatus("failed");
    }
  }, [location.search]);

  return (
    <div className="payment-result-container" style={{ textAlign: "center", padding: "50px" }}>
      {paymentStatus === "success" ? (
        <>
          <Result
            status="success"
            title="Payment Successful!"
            subTitle={`Order Code: ${orderDetails?.orderCode}`}
            extra={[
              <Button type="primary" key="home">
                <Link to="/">Return to Home</Link>
              </Button>,
              <Button key="cart">
                <Link to="/cart">Return to Cart</Link>
              </Button>
            ]}
          />
          <div style={{ marginTop: "30px" }}>
            <Title level={3}>Order Information</Title>
            <Space direction="vertical" size="middle">
              <p><strong>Total Amount: </strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(orderDetails?.totalAmount / 100)}</p>
              <p><strong>Payment Method: </strong>VNPay</p>
              <p><strong>Transaction Code: </strong>{orderDetails.vnp_TmnCode}</p>
            </Space>
          </div>
        </>
      ) : paymentStatus === "failed" ? (
        <Result
          status="error"
          title="Payment Failed!"
          subTitle="Please try again later."
          extra={[
            <Button type="primary" key="home">
              <Link to="/">Return to Home</Link>
            </Button>,
            <Button key="cart">
              <Link to="/cart">Return to Cart</Link>
            </Button>
          ]}
        />
      ) : (
        <div>Processing...</div>
      )}
    </div>
  );
};

export default PaymentResult;
