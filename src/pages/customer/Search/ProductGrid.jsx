import React from 'react';
import { Card, Row, Col, Pagination, Empty, Badge, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ProductGrid.scss';

const ProductGrid = ({ products, totalProducts, currentPage, onPageChange }) => {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const navigate = useNavigate();

  const handleDetails = (productID) => {
    navigate(`/product-detail/${productID}`);
  };

  const getPromotionLabel = (promotion) => {
    if (!promotion || !promotion.type) return "";

    switch (promotion.type) {
      case "PERCENTAGE": {
        const value = promotion.discountValue;
        return value ? `Sale ${value}%` : "Sale";
      }
      case "FIXED": {
        const value = promotion.discountValue;
        return value
          ? `- ${Number(value).toLocaleString("vi-VN")}₫`
          : "Fixed Discount";
      }
      case "BUYX": {
        const buy = promotion.buyQuantity;
        return buy ? `🎁 Free 1 when buying ${buy}+ items` : "🎁";
      }
      case "GIFT": {
        return "🎁 Free gift";
      }
      default:
        return "";
    }
  };

  return (
    <>
      {products.length === 0 ? (
        <Empty />
      ) : (
        <Row gutter={[24, 24]} className="product-grid">
          {products.map((product) => {
            const formattedPrice = product.price.toLocaleString('vi-VN') + "₫";
            const formattedDiscountPrice = product.discountPrice.toLocaleString('vi-VN') + "₫";
            const promotionText = getPromotionLabel(product.promotion);

            return (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <div className="product-card">
                  {promotionText ? (
                    <Badge.Ribbon
                      text={<span className="promotion-label">{promotionText}</span>}
                      color="red"
                      placement="start"
                    >
                      <Card
                        cover={
                          product.image?.length > 0 ? (
                            <img
                              alt={product.productName}
                              src={`${CLOUDINARY_BASE_URL}${product.image}`}
                              className="product-image"
                            />
                          ) : (
                            <div className="no-image">No image</div>
                          )
                        }
                        hoverable
                        onClick={() => handleDetails(product.productID)}
                      >
                        <div className="rating-section">
                          {product.rating > 0 ? (
                            <Rate disabled allowHalf value={product.rating} />
                          ) : (
                            <p className="no-reviews">No reviews yet</p>
                          )}
                        </div>
                        <Card.Meta
                          title={<h3 className="product-name">{product.productName}</h3>}
                          description={
                            <div className="price-section">
                              {product.discountPrice !== product.price ? (
                                <>
                                  <span className="original-price">{formattedPrice}</span>
                                  <span className="discount-price">{formattedDiscountPrice}</span>
                                </>
                              ) : (
                                <span className="price">{formattedPrice}</span>
                              )}
                            </div>
                          }
                        />
                      </Card>
                    </Badge.Ribbon>
                  ) : (
                    <Card
                      cover={
                        product.image?.length > 0 ? (
                          <img
                            alt={product.productName}
                            src={`${CLOUDINARY_BASE_URL}${product.image}`}
                            className="product-image"
                          />
                        ) : (
                          <div className="no-image">No image</div>
                        )
                      }
                      hoverable
                      onClick={() => handleDetails(product.productID)}
                    >
                      <div className="rating-section">
                        {product.rating > 0 ? (
                          <Rate disabled allowHalf value={product.rating} />
                        ) : (
                          <p className="no-reviews">No reviews yet</p>
                        )}
                      </div>
                      <Card.Meta
                        title={<h3 className="product-name">{product.productName}</h3>}
                        description={
                          <div className="price-section">
                            {product.discountPrice !== product.price ? (
                              <>
                                <span className="original-price">{formattedPrice}</span>
                                <span className="discount-price">{formattedDiscountPrice}</span>
                              </>
                            ) : (
                              <span className="price">{formattedPrice}</span>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      )}
      <Pagination
        className="pagination"
        current={currentPage}
        total={totalProducts}
        pageSize={12}
        onChange={onPageChange}
        align="end"
      />
    </>
  );
};

export default ProductGrid;