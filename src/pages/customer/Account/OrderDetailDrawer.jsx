import { Modal, Button, Rate, Tag, Image, Tooltip, Divider, Drawer, message } from "antd";
import { EditOutlined, GiftOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useCallback } from "react";
import { fetchReviewByOrderDetail, addReview } from "../../../services/reviewService";
import { useSelector } from "react-redux";

function OrderDetailDrawer({ isOpen, onClose, order }) {
  const [reviews, setReviews] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ visible: false, detailId: null, rating: 0, comment: "" });
  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    if (!order?.details?.length) return;
    loadReviews();
  }, [order]);

  const loadReviews = async () => {
    const reviewMap = {};
    await Promise.all(order.details.map(async (detail) => {
      const reviewData = await fetchReviewByOrderDetail(detail.id);
      reviewMap[detail.id] = reviewData || null;
    }));
    setReviews(reviewMap);
  };

  const openViewReviewModal = (review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const openAddReviewModal = (detailId) => {
    setNewReview({ visible: true, detailId, rating: 0, comment: "" });
  };

  const handleReviewSubmit = async () => {
    if (!newReview.rating) {
      message.warning("Please provide rating");
      return;
    }
    const submittedReview = {
      orderDetail: { orderDetailID: newReview.detailId },
      rating: newReview.rating,
      comment: newReview.comment,
      user: { userID: user.userID },
      product: { productID: null }
    };

    try {
      const response = await addReview(submittedReview);
      if (response) {
        message.success("Review submitted successfully!");
        setNewReview({ visible: false, detailId: null, rating: 0, comment: "" });
        loadReviews();
      } else {
        message.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred while submitting the review.");
      console.error("Error submitting review:", error);
    }
  };

  const calculateTotal = useCallback(() => {
    return order?.details?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  }, [order]);

  if (!order) return null;

  return (
    <Drawer
      title={<span style={{ fontSize: "20px", fontWeight: "bold", color: "#1890ff" }}>{`Order #${order.code}`}</span>}
      open={isOpen}
      onClose={onClose}
      width={500}
      bodyStyle={{ padding: "20px", backgroundColor: "#f9f9f9" }}
    >
      <div style={{ marginBottom: 30 }}>
        <h4 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>Shipping Address</h4>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>{order.name}</p>
          <p style={{ fontSize: "14px", color: "#666" }}>{order.shippingAddress}</p>
          <p style={{ fontSize: "14px", color: "#666" }}>{order.phone}</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "15px", borderBottom: "2px solid #1890ff", paddingBottom: "5px", display: "inline-block" }}>
          Shipping Details
        </h3>
        {order.details.map((detail, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Image
                src={detail.image}
                width={120}
                style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
              />
              <div style={{ marginLeft: 20, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Tag
                      color="red"
                      style={{ fontSize: "14px", padding: "5px 10px", borderRadius: "12px", fontWeight: "bold" }}
                    >
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}
                    </Tag>
                    <div style={{ marginTop: 8, fontSize: "14px", color: "#555" }}>
                      {detail.color} - {detail.size.replace('SIZE_', '')}
                    </div>
                    <div style={{ marginTop: 5, fontSize: "14px", color: "#555" }}>
                      x {detail.quantity}
                    </div>
                  </div>
                  <div>
                    {order.status === "DELIVERED" && (
                      reviews[detail.id] ? (
                        <Tooltip title="View Review">
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#1890ff", fontSize: "14px" }}
                            onClick={() => openViewReviewModal(reviews[detail.id])}
                          >
                            View Review
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Write a Review">
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            style={{ color: "#1890ff", fontSize: "14px" }}
                            onClick={() => openAddReviewModal(detail.id)}
                          >
                            Write Review
                          </Button>
                        </Tooltip>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            {detail.gift && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 60,
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: "#f0f9ff",
                  padding: "10px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #69c0ff",
                }}
              >
                <GiftOutlined style={{ color: "#69c0ff", fontSize: "20px", marginRight: "10px" }} />
                <Image
                  src={detail.gift.giftImageURL}
                  width={80}
                  style={{ borderRadius: "6px", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)" }}
                />
                <div style={{ marginLeft: 15, fontSize: "13px", color: "#666" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                    <Tag color="green" style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "10px" }}>
                      Gift
                    </Tag>
                    <span style={{ marginLeft: 5, fontWeight: "bold" }}>{detail.gift.giftProductName}</span>
                  </div>
                  <div style={{ marginTop: 5 }}>
                    {detail.gift.giftColor} - {detail.gift.giftSize.replace('SIZE_', '')}
                  </div>
                  <div style={{ marginTop: 5 }}>x {detail.gift.giftQuantity}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        <h5 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", textAlign: "right" }}>
          Total Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
        </h5>
      </div>

      <Divider style={{ borderColor: "#e8e8e8" }} />
      <div>
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "15px", borderBottom: "2px solid #1890ff", paddingBottom: "5px", display: "inline-block" }}>
          Payment Summary
        </h3>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: "14px", color: "#666" }}>Payment Method:</p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{order.paymentMethod}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: "14px", color: "#666" }}>Payment Status:</p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: order.paymentStatus === "PAID" ? "#52c41a" : "#ff4d4f" }}>
              {order.paymentStatus}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: "14px", color: "#666" }}>Shipping:</p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.feeShip)}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: "14px", color: "#666" }}>Discount:</p>
            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#ff4d4f" }}>
              - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}
            </p>
          </div>
          <Divider style={{ borderColor: "#e8e8e8", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <p style={{ fontSize: "18px", color: "#333" }}>Total:</p>
            <p style={{ fontSize: "18px", color: "#1890ff" }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Modal xem review */}
      <Modal
        title={<span style={{ fontSize: "16px", color: "#333" }}>View Review</span>}
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        footer={null}
      >
        <h4 style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Rate this product:</h4>
        <Rate value={selectedReview?.rating} disabled style={{ marginBottom: "15px" }} />
        <div>
          <h4 style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Comment:</h4>
          <p style={{ fontSize: "14px", color: "#333", backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "6px" }}>
            {selectedReview?.comment}
          </p>
        </div>
      </Modal>

      {/* Modal thêm review */}
      <Modal
        title={<span style={{ fontSize: "16px", color: "#333" }}>Write a Review</span>}
        open={newReview.visible}
        onCancel={() => setNewReview({ visible: false, detailId: null, rating: 0, comment: "" })}
        footer={null}
      >
        <div>
          <h4 style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Rate this product:</h4>
          <Rate
            value={newReview.rating}
            onChange={(value) => setNewReview((prev) => ({ ...prev, rating: value }))}
            style={{ marginBottom: "15px" }}
          />
          <div>
            <h4 style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Comment:</h4>
            <textarea
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #d9d9d9",
                fontSize: "14px",
                color: "#333",
                resize: "none",
              }}
              placeholder="Enter your review here..."
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </div>
          <Button
            type="primary"
            onClick={handleReviewSubmit}
            style={{ marginTop: 15, borderRadius: "6px", padding: "5px 20px" }}
          >
            Submit Review
          </Button>
        </div>
      </Modal>
    </Drawer>
  );
}

export default OrderDetailDrawer;