import React, { useState, useEffect } from "react";
import { Rate, List, Drawer, Progress, Button } from "antd";
import { fetchReviewByProduct } from "../../../services/reviewService";

const ReviewSummary = ({ averageRating, totalReviews, ratingsCount }) => (
  <div style={{ borderRadius: "8px", padding: "10px" }}>
    <h2>Reviews</h2>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "48px", fontWeight: "bold" }}>{averageRating.toFixed(1)}</span>
      <Rate disabled value={averageRating} />
      <span>{totalReviews} reviews</span>
    </div>
    <div>
      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{star}</span>
          <Progress
            percent={totalReviews ? (ratingsCount[star] / totalReviews) * 100 : 0}
            showInfo={false}
            strokeColor="#1890ff"
            style={{ flex: 1 }}
          />
        </div>
      ))}
    </div>
  </div>
);

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p>No reviews for this product</p>;
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={reviews}
      renderItem={(item) => (
        <List.Item style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div>
                <h4 style={{ margin: 0 }}>{item.user.name}</h4>
                <p style={{ margin: 0, color: "#888" }}>
                  Color: {item.productDetail.color} / Size: {item.productDetail.size.replace('SIZE_', '')}
                </p>
                <Rate disabled value={item.rating} style={{ fontSize: "16px" }} />
              </div>
            </div>
            <p style={{ margin: 0, color: "#888" }}>
              {item.createdAt.split("T")[0]}
            </p>
          </div>
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontWeight: "bold", margin: 0 }}>{item.comment}</p>
          </div>
        </List.Item>
      )}
    />
  );
};

const Review = ({ productID }) => {
  const [reviews, setReviews] = useState([]);
  const [drawer, setDrawerVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingsCount, setRatingsCount] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  useEffect(() => {
    const getReviews = async () => {
      if (productID) {
        try {
          const response = await fetchReviewByProduct(productID);
          setReviews(response);
          calculateSummary(response);
        } catch (error) {
          console.error("Lỗi khi lấy đánh giá:", error);
        }
      }
    };

    getReviews();
  }, [productID]);

  const calculateSummary = (reviews) => {
    if (reviews.length > 0) {
      const total = reviews.length;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      setAverageRating(sum / total);
      setTotalReviews(total);

      const count = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(review => {
        count[review.rating]++;
      });
      setRatingsCount(count);
    } else {
      setAverageRating(0);
      setTotalReviews(0);
      setRatingsCount({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    }
  };

  return (
    <div className="review-tab">
      <div style={{ display: "flex", gap: "20px", padding: '1rem', borderRadius: '0.5rem', marginTop: 20, background: 'white' }}>
        <div>
          <ReviewSummary averageRating={averageRating} totalReviews={totalReviews} ratingsCount={ratingsCount} />
        </div>
        <div style={{ flex: 2 }}>
          <ReviewList reviews={reviews.slice(0, 2)} />
          {totalReviews > 0 && (
            <Button type="link" onClick={() => setDrawerVisible(true)}>
              See all reviews
            </Button>
          )}
        </div>
      </div>

      <Drawer
        title="All reviews"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawer}
        width={500} // Điều chỉnh độ rộng theo nhu cầu
      >
        <ReviewList reviews={reviews} />
      </Drawer>
    </div>
  );
};

export default Review;
