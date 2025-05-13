import React from 'react';
import { Card, Row, Col, Pagination, Empty, Tooltip, Badge, Rate } from 'antd';
import { HeartOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
        if (buy) {
          return `🎁 Free 1 when buying ${buy}+ items`;
        }
        return "🎁";
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
        <Row gutter={[16, 16]} style={{ minHeight: "800px" }}>
          {products.map((product) => {
            const formattedPrice = product.price.toLocaleString('vi-VN') + "₫";
            const formattedDiscountPrice = product.discountPrice.toLocaleString('vi-VN') + "₫"


            return (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <Badge.Ribbon
                  text={<span style={{ fontSize: "13px", fontWeight: 500 }}>{getPromotionLabel(product.promotion)}</span>}
                  color="volcano"
                  placement="start"
                >
                  <Card
                    cover={
                      product.image?.length > 0 ? (
                        (() => {
                          const imageUrl = `${CLOUDINARY_BASE_URL}${product.image}`;
                
                          return (
                            <img
                              alt={product.productName}
                              src={imageUrl}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "contain",
                                backgroundColor: "#fff"
                              }}
                            />
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            height: "200px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f0f0f0",
                            border: "1px dashed #d9d9d9",
                          }}
                        >
                          <span style={{ color: "#999" }}>200x200</span>
                        </div>
                      )
                    }
                    hoverable
                    onClick={() => handleDetails(product.productID)}
                  >

                    <div style={{ minHeight: "30px", display: "flex", alignItems: "center", marginBottom: 10 }}>
                      {product.rating > 0 ? (
                        <Rate disabled allowHalf value={product.rating} style={{ marginBottom: 0 }} />
                      ) : (
                        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>No reviews yet</p>
                      )}
                    </div>

                    <Card.Meta
                      title={product.productName}
                      description={
                        <>
                          {product.discountPrice !== product.price ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 8 }}>
                                {formattedPrice}
                              </span>
                              <span style={{ fontWeight: 'bold', color: '#fa541c' }}>
                                {formattedDiscountPrice}
                              </span>
                            </>
                          ) : (
                            <span style={{}}>{formattedPrice}</span>
                          )}
                        </>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>
      )}
      <Pagination style={{ marginTop: "10px" }}
        current={currentPage}
        total={totalProducts}
        pageSize={12}
        onChange={onPageChange}
        align='end'
      />
    </>
  );
};

export default ProductGrid;
