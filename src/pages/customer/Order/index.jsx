import React from "react";
import { Card, Typography, Row, Col, Button, Divider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderSuccess = ({ data }) => {
  if (!data) return null; 
  const handlePayment = () => {
    if (data.vnPayUrl) {
      window.location.href = data.vnPayUrl;
    }
  };

  const handleLater = () => {
    window.location.href = "/";
  };
  return (
    <div>
      <Card bordered={false}>
        {/* Biểu tượng và thông báo thành công */}
        <Row justify="center" align="middle">
          <CheckCircleOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
        </Row>
        <Row justify="center" align="middle">
          <Title level={3} style={{ textAlign: "center" }}>
            Thanks for your order!
          </Title>
        </Row>
        <Row justify="center">
          <Text type="secondary" style={{ textAlign: "center" }}>
            The order confirmation has been sent to{" "}
            <Text strong>{data.email}</Text>
          </Text>
        </Row>

        <Divider />

        {/* Chi tiết giao dịch */}
        <div style={{ marginBottom: "16px" }}>
          <Text type="secondary">Transaction Date</Text>
          <div>{data.transactionDate}</div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Text type="secondary">Payment Method</Text>
          <div>{data.paymentMethod}</div>
        </div>
        <div>
          <Text type="secondary">Shipping Method</Text>
          <div>{data.shippingMethod}</div>
        </div>

        <Divider />

        <Title level={4}>Your Order</Title>
        {data.products.map((product) => (
          <Row align="middle" key={product.detail.productDetailID}>
            <Col span={6}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </Col>
            <Col span={12}>
              <div>{product.name}</div>
              <Text type="secondary">{`${product.detail.color} / ${product.detail.size}`}</Text>
              <div>x{product.quantity}</div>
            </Col>
            <Col span={6} style={{ textAlign: "right" }}>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                product.quantity * product.price
              )}
            </Col>
          </Row>
        ))}

        <Divider />
        <Row justify="space-between" style={{ marginBottom: "8px" }}>
          <Col>
            <Text>Subtotal</Text>
          </Col>
          <Col>
            <Text>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(data.subtotal)}
            </Text>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginBottom: "8px" }}>
          <Col>
            <Text>Shipping cost</Text>
          </Col>
          <Col>
            <Text>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(data.shippingCost)}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row justify="space-between">
          <Col>
            <Title level={3}>Total</Title>
          </Col>
          <Col>
            <Title level={3} style={{ color: "#1890ff" }}>
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(data.total)}
            </Title>
          </Col>
        </Row>
        {data.paymentMethod === "VNPay" ? (
          <Row justify="space-between" gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                block
              onClick={handlePayment}
              >
                Continue Payment
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="default"
                block
              onClick={handleLater}
              >
                Pay Later
              </Button>
            </Col>
          </Row>
        ) : (
          <Button
            type="primary"
            block
            style={{ marginTop: "16px" }}
          onClick={handleLater}
          >
            Continue Shopping
          </Button>
        )}
      </Card>
    </div>
  );
};

export default OrderSuccess;
