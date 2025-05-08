import { useEffect, useState } from "react";
import { Badge, Card, Carousel, Image, Rate, Tooltip, Row, Col, } from "antd";
import shoe from "../../../assets/images/products/shoe3.png";
import { useNavigate } from "react-router-dom";
import { getRelatedProduct } from "../../../services/productService";
const RelatedProducts = ({ productId }) => {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getRelatedProduct(productId)
        setRelatedProducts(response);
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
  const handleDetails = (productID) => {
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
                style={{ marginLeft: 18, marginRight: 13, width: '88%' }}
                cover={
                  <Badge.Ribbon
                    text={product.discountPrice !== product.price ? `Sale` : ''}
                    color="red"
                    placement="start"
                  >
                    <Image
                      preview={false}
                      alt={product.productName}
                      src={product.imageURL?.length > 0 ? `${CLOUDINARY_BASE_URL}${product.imageURL[0]}` : ""}
                      style={{ width: "200px", height: "250px", objectFit: "contain" }}
                    />



                  </Badge.Ribbon>
                }
                hoverable
                onClick={() => handleDetails(product.productID)}
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
                      {product.discountPrice !== product.price ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 8 }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </span>
                          <span style={{ fontWeight: 'bold', color: '#fa541c' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discountPrice)}

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
