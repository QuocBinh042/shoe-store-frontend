import React from 'react';
import { Card, Row, Col, Pagination, Empty, Tooltip, Badge, Rate } from 'antd';
import { HeartOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ProductGrid = ({ products, totalProducts, currentPage, onPageChange }) => {
  const navigate = useNavigate();

  const handleAddCart = (productID) => {
    navigate(`/product-detail/${productID}`);
  };

  return (
    <>
      {products.length === 0 ? (
        <Empty />
      ) : (
        <Row gutter={[16, 16]} style={{ minHeight: "800px" }}>
          {products.map((product) => {
            const formattedPrice = product.price.toLocaleString('vi-VN') + "₫";
            const formattedDiscountPrice = product.discountPrice
              ? product.discountPrice.toLocaleString('vi-VN') + "₫"
              : null;

            return (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <Badge.Ribbon
                  text={product.discountPrice ? "Sale" : ""}
                  color="red"
                  placement="start"
                >
                  <Card
                    cover={
                      product.image ? (
                        <img alt={product.productName} src={product.image} />
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
                    onClick={() => handleAddCart(product.productID)}
                  >
                    <Rate disabled allowHalf defaultValue={2.5} style={{ marginBottom: 10 }} />
                    <Card.Meta
                      title={product.productName}
                      description={
                        <>
                          {formattedDiscountPrice ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 8 }}>
                                {formattedPrice}
                              </span>
                              <span style={{ fontWeight: 'bold', color: '#fa541c' }}>
                                {formattedDiscountPrice}
                              </span>
                            </>
                          ) : (
                            <span style={{ }}>{formattedPrice}</span>
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
      <Pagination
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
