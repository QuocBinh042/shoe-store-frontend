import { Modal, Button, Rate, Tag, Image, Tooltip, Divider, Drawer,message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useCallback } from "react";
import { fetchReviewByOrderDetail,addReview } from "../../../services/reviewService";
import { useSelector } from "react-redux";
function OrderDetailDrawer({ isOpen, onClose, order }) {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const [reviews, setReviews] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ visible: false, detailId: null, rating: 0, comment: "" });
  const user = useSelector((state) => state.account.user);
  console.log(order)
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
      orderDetail:{orderDetailID: newReview.detailId},
      rating: newReview.rating,
      comment: newReview.comment,
      user:{userID:user.userID},
      product:{productID:null}
    };
  
    try {
      const response = await addReview(submittedReview);
      if (response) {
        message.success("Review submitted successfully!");
        setNewReview({ visible: false, detailId: null, rating: 0, comment: "" });
        loadReviews()
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
    <Drawer title={`Order #${order.code}`} open={isOpen} onClose={onClose} width={500}>
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
              {order.status === "Delivered" && (
                reviews[detail.id] ? (
                  <Tooltip title="View Review">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openViewReviewModal(reviews[detail.id])} />
                  </Tooltip>
                ) : (
                  <Tooltip title="Write a Review">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openAddReviewModal(detail.id)} />
                  </Tooltip>
                )
              )}
            </div>
          </div>
        ))}
        <h5 style={{ fontSize: 18 }}>Total price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}</h5>
      </div>

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
      {/* Modal xem review */}
      <Modal title="View Review" open={isReviewModalOpen} onCancel={() => setIsReviewModalOpen(false)} footer={null}>



        <h4>Rate this product:</h4>
        <Rate value={selectedReview?.rating} disabled />
        <div style={{ marginTop: 10 }}>
          <h4>Comment:</h4>
          <p>{selectedReview?.comment}</p>
        </div>
      </Modal>

      {/* Modal thêm review */}
      <Modal title="Write a Review" open={newReview.visible} onCancel={() => setNewReview({ visible: false, detailId: null, rating: 0, comment: "" })} footer={null}>


        <div>
          <h4>Rate this product:</h4>
          <Rate value={newReview.rating} onChange={(value) => setNewReview((prev) => ({ ...prev, rating: value }))} />
          <div style={{ marginTop: 10 }}>
            <h4>Comment:</h4>
            <textarea style={{ width: "100%", height: "100px" }} placeholder="Enter your review here..." value={newReview.comment} onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))} />
          </div>

          <Button type="primary" onClick={handleReviewSubmit} style={{ marginTop: 10 }}>Submit Review</Button>
        </div>
      </Modal>
    </Drawer>
  );
}

export default OrderDetailDrawer;
