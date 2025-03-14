import { HeartOutlined, ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Badge, Card, Carousel, Image, Rate, Tooltip, Row, Col, } from "antd";
import shoe from "../../../assets/images/products/shoe3.png";
import { useNavigate } from "react-router-dom";
// import '../Home/Home.scss'
function RelatedProducts() {
  const navigate = useNavigate();
  const products = [
    { id: 1, name: 'Nike Air Max', price: 180, discount: 20, image: 'https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/i3p1us11avw3p4ya1g02.png' },
    { id: 2, name: 'Nike Air Max', price: 180, discount: 20, image: 'https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/kxgjis3uuvn3ulvjtluy.png' },
    { id: 3, name: 'Nike Air Max', price: 180, discount: 10, image: 'https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/kxgjis3uuvn3ulvjtluy.png' },
    { id: 4, name: 'Nike Air Max', price: 180, discount: 20, image: 'https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/i3p1us11avw3p4ya1g02.png' },
    { id: 5, name: 'Nike Air Max', price: 180, discount: 20, image: 'https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/i3p1us11avw3p4ya1g02.png' },
    { id: 6, name: 'Adidas UltraBoost', price: 200, discount: 30, image: 'https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/kxgjis3uuvn3ulvjtluy.png' },

  ];
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    console.log(`${action} clicked for product: ${products.name}`);
  };
  return (
    <div >
      <h1>Relatated Product</h1>
      <Carousel arrows slidesToShow={5} dots={false} style={{ margin: 'auto', width: "100%" }}>
        {products.map((product) => {
          const discountedPrice = (
            product.price - (product.price * (product.discount || 0)) / 100
          ).toFixed(2);
          return (
            <Col key={product.id}>

              <Card 
                style={{marginLeft:15, marginRight:10, width:'88%'}}
                cover={
                  <Badge.Ribbon
                    text={product.discount ? `-${product.discount}%` : ''}
                    color="red"
                    placement="start"
                  >
                    <Image preview={false} alt={product.name} src={product.image} />
                  </Badge.Ribbon>
                }
                hoverable
                actions={[
                  <Tooltip title="Add to Cart" key="add-to-cart">
                    <ShoppingOutlined onClick={(e) => handleActionClick(e, 'Add to Cart')} />
                  </Tooltip>,
                  <Tooltip title="Buy now" key="buy-now">
                    <ShoppingCartOutlined onClick={(e) => handleActionClick(e, 'Buy now')} />
                  </Tooltip>,
                  <Tooltip title="Add to Wishlist" key="add-to-wishlist">
                    <HeartOutlined onClick={(e) => handleActionClick(e, 'Add to Wishlist')} />
                  </Tooltip>,
                ]}
                onClick={() => navigate("/product-detail")}
              >
                <Rate disabled allowHalf defaultValue={2.5} style={{ marginBottom: 10, }} />
                <Card.Meta title={product.name} description={
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 8 }}>
                      ${product.price}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#fa541c' }}>
                      ${discountedPrice}
                    </span>
                  </>
                } />
              </Card>
            </Col>
          )
        })}
      </Carousel>
    </div>
  )
}

export default RelatedProducts;
