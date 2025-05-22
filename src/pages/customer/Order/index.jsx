import React, { useState } from "react";
import { Card, Typography, Row, Col, Button, Divider, Tag, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderSuccess = ({ data }) => {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data) return null;

  const handlePayment = () => {
    if (data.vnPayUrl) {
      window.location.href = data.vnPayUrl;
    }
  };

  const handleLater = () => {
    if (data.paymentMethod === "VNPAY") {
      setIsModalOpen(true); // Show modal for VNPAY Pay Later
    } else {
      localStorage.removeItem('recentOrder');
      window.location.href = "/";
    }
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    localStorage.removeItem('recentOrder');
    window.location.href = "/";
  };

  // Hàm định dạng giá tiền
  const formatCurrency = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  return (
    <div>
      <Card bordered={false}>
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
            <Text strong>{data.email || "your email"}</Text>
          </Text>
        </Row>

        <Divider />

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
        {data.products.map((product) => {
          const giftForProduct = data.gifts?.find(gift => gift.productKey === String(product.key));

          return (
            <div key={product.detail.productDetailID}>
              <Row align="middle" style={{ marginBottom: giftForProduct ? "8px" : "16px" }}>
                <Col span={6}>
                  <img
                    src={CLOUDINARY_BASE_URL + product.detail.image}
                    sizes={50}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
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
                  {formatCurrency(product.price)}
                </Col>
              </Row>

              {giftForProduct && (
                <Row align="middle" style={{ marginBottom: "16px", marginLeft: "20px" }}>
                  <Col span={6}>
                    <img
                      src={giftForProduct.image || product.image}
                      alt={giftForProduct.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  </Col>
                  <Col span={18}>
                    <div style={{ fontSize: "14px" }}>
                      <Tag color="green" style={{ marginRight: "8px" }}>Gift</Tag>
                      <Text style={{ fontSize: "14px" }}>{giftForProduct.name}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>{`${giftForProduct.color} / ${giftForProduct.size}`}</Text>
                    <div style={{ fontSize: "12px" }}>x{giftForProduct.quantity}</div>
                  </Col>
                </Row>
              )}
            </div>
          );
        })}

        <Divider />

        <Row justify="space-between" style={{ marginBottom: "8px" }}>
          <Col>
            <Text>Subtotal</Text>
          </Col>
          <Col>
            <Text>{formatCurrency(data.subtotal)}</Text>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginBottom: "8px" }}>
          <Col>
            <Text>Shipping cost</Text>
          </Col>
          <Col>
            <Text>{formatCurrency(data.shippingCost)}</Text>
          </Col>
        </Row>

        <Divider />

        <Row justify="space-between">
          <Col>
            <Title level={3}>Total</Title>
          </Col>
          <Col>
            <Title level={3} style={{ color: "#1890ff" }}>
              {formatCurrency(data.total)}
            </Title>
          </Col>
        </Row>

        {data.paymentMethod === "VNPAY" ? (
          <Row justify="space-between" gutter={16}>
            <Col span={12}>
              <Button type="primary" block onClick={handlePayment}>
                Continue Payment
              </Button>
            </Col>
            <Col span={12}>
              <Button type="default" block onClick={handleLater}>
                Pay Later
              </Button>
            </Col>
          </Row>
        ) : (
          <Button type="primary" block style={{ marginTop: "16px" }} onClick={handleLater}>
            Continue Shopping
          </Button>
        )}
      </Card>

      <Modal
        title="Payment Reminder"
        open={isModalOpen}
        onOk={handleModalOk}
        okText="OK"
        footer={(_, { OkBtn }) => <OkBtn />}
      >
        <p>Please complete the payment within 24 hours, or the system will automatically cancel your order.</p>
      </Modal>
    </div>
  );
};

export default OrderSuccess;