import { Modal, Button, Rate, Tag, Image, Steps, Divider, Drawer } from "antd";
import React, { useState, useEffect } from "react";

function OrderDetailDrawer({ isOpen, onClose, order }) {
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  console.log(order)
  if (!order) return null;
  const calculateTotal = () =>
    order.details.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  const handleReviewSubmit = (reviewData) => {
    // Thực hiện gửi dữ liệu đánh giá đến server
    console.log("Submitting review:", reviewData);
    // Đóng modal sau khi gửi đánh giá
    setIsReviewModalVisible(false);
  };
  return (
    <Drawer
      title={`Order #${order.code}`}
      open={isOpen}
      onClose={onClose}
      width={500}
    >
      <div style={{}}>
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4>Shipping Address</h4>
              <p>{order.name}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.phone}</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 20 }}>Shipping Details</h3>
          {order.details.map((detail, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
            >
              <Image
                src={detail.image}
                width={100}
                style={{ borderRadius: "5px" }}
              />
              <div style={{ marginLeft: 20 }}>
                <Tag color={detail.color}>{detail.color}</Tag>
                <Tag color="blue">{detail.size}</Tag>
                <Tag color="red">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}</Tag>
                <div style={{ marginTop: 10 }}>Quantity: {detail.quantity}</div>
                <div style={{ marginTop: 10 }}>
                  Subtotal:<b> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price * detail.quantity)}</b>
                </div>
              </div>
            </div>
          ))}
          <h5 style={{ fontSize: 18 }}>Total price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}</h5>
        </div>
        <Divider />


        <Divider />
        <div>
          <h3 style={{ margin: 0 }}>Payment Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Payment Method:</p>
            <p>{order.paymentMethod}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Payment status:</p>
            <p>{order.paymentStatus}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Shipping:</p>
            <p> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.feeShip)}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Discount:</p>
            <p> - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}</p>
          </div>
          <Divider />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <p style={{ fontSize: 20 }}>Total:</p>
            <p style={{ fontSize: 20 }}> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</p>
          </div>
        </div>
        {order.status === "Delivered" && (
          <div style={{ marginTop: 20 }}>
            <Button type="primary" onClick={() => setIsReviewModalVisible(true)}>
              Write a Review
            </Button>
          </div>
        )}
        <Modal
          title="Write a Review"
          open={isReviewModalVisible}
          onCancel={() => setIsReviewModalVisible(false)}
          footer={null}
          width={400}
        >

          <div>
            <h4>Rate this product:</h4>
            <Rate onChange={(value) => console.log(value)} />
            <div style={{ marginTop: 10 }}>
              <h4>Comment:</h4>
              <textarea
                style={{ width: "100%", height: "100px", padding: "5px", borderRadius: "5px" }}
                placeholder="Enter your review here..."
              />
            </div>
            <Button
              type="primary"
              onClick={handleReviewSubmit}
              style={{ marginTop: 10 }}
            >
              Submit Review
            </Button>
          </div>
        </Modal>
      </div>
    </Drawer>
  );
}

export default OrderDetailDrawer;
