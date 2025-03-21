import { HeartOutlined, ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Badge, Card, Carousel, Image, Rate, Tooltip, Row, Col, } from "antd";
import shoe from "../../../assets/images/products/shoe3.png";
import { useNavigate } from "react-router-dom";
import { getRelatedProduct, getRating } from "../../../services/productService";
import { getDiscountByProduct } from "../../../services/promotionService";
// import '../Home/Home.scss'
const RelatedProducts = ({ productId }) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getRelatedProduct(productId)
        console.log(response)
        const productsWithDiscounts = await Promise.all(
          response.map(async (product) => {
            const discountResponse = await getDiscountByProduct(product.productID)
            const rating = await getRating(product.productID);
            return {
              ...product,
              discount: discountResponse || 0,
              rating
            };
          })
        );
        setRelatedProducts(productsWithDiscounts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);
  // const handleActionClick = (e, action) => {
  //   e.stopPropagation();
  //   console.log(`${action} clicked for product: ${products.name}`);
  // };
  const handleAddCart = (productID) => {
    navigate(`/product-detail/${productID}`);
  };
  return (
    <div >
      <h1>Relatated Product</h1>
      <Carousel arrows slidesToShow={5} dots={false} style={{ margin: 'auto', width: "100%" }}>
        {relatedProducts.map((product) => {
          return (
            <Col key={product.productID}>

              <Card
                style={{ marginLeft: 15, marginRight: 10, width: '88%' }}
                cover={
                  <Badge.Ribbon
                    text={product.discount !== product.price ? `Sale` : ''}
                    color="red"
                    placement="start"
                  >
                    <Image preview={false} alt={product.productName} src="https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/i3p1us11avw3p4ya1g02.png" />
                  </Badge.Ribbon>
                }
                hoverable
                onClick={() => navigate(`/product-detail/${product.productID}`)}
              >
                <div style={{ minHeight: "30px", display: "flex", alignItems: "center", marginBottom: 10 }}>
                  {product.rating > 0 ? (
                    <Rate disabled allowHalf value={product.rating} />
                  ) : (
                    <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>No reviews yet</p>
                  )}
                </div>

                <Card.Meta
                  title={
                    <>
                      {product.productName}
                    </>
                  }
                  description={
                    <>
                      {product.discount !== product.price ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 8 }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </span>
                          <span style={{ fontWeight: 'bold', color: '#fa541c' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discount)}

                          </span>
                        </>
                      ) : (
                        <span style={{ fontWeight: 'bold' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}

                        </span>
                      )}
                    </>
                  }
                />

              </Card>
            </Col>
          )
        })}
      </Carousel>
    </div>
  )
}

export default RelatedProducts;
