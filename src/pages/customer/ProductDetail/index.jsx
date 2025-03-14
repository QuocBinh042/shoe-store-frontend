import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button, Rate, InputNumber, Image, Tag, Spin, Modal } from "antd";
import "./ProductDetail.scss";
import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import RelatedProducts from "./RelatedProducts";
import Review from "./Review";
import { useSelector } from "react-redux";
import { fetchProductDetailByProductId } from "../../../services/productDetailService";
import { addCartItem } from "../../../services/cartItemService";
import { getDiscountByProduct } from "../../../services/promotionService";
const ProductDetails = () => {
  const navigate = useNavigate();
  const { productID } = useParams();
  const [product, setProduct] = useState([]);
  const [mainImage, setMainImage] = useState("https://res.cloudinary.com/dowsceq4o/image/upload/v1735919650/project_ShoeStore/ImageProduct/1/kxgjis3uuvn3ulvjtluy.png");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [filteredSizes, setFilteredSizes] = useState([]);

  const [availableColors, setAvailableColors] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.account.user);
  const location = useLocation();
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const details = await fetchProductDetailByProductId(productID);
        const discount = await getDiscountByProduct(productID);

        if (details) {
          setProduct({
            productName: details.productName || "No name",
            categoryName: details.categoryName || "No category",
            brandName: details.brandName || "No brand",
            description: details.description || "No description",
            imageURL: details.imageURL || [],
            price: details.price || 0,
          });

          setProductDetails(details.productDetails || []);
          setAvailableColors([...new Set(details.productDetails?.map(d => d.color))] || []);
          setDiscountedPrice(discount ?? details.price);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (productID) fetchProduct();
  }, [productID]);




  const handleBuyNow = () => {
    if (!user) {
      Modal.confirm({
        title: "Please log in to continue shopping",
        content: "You need to log in to proceed with your purchase.",
        okText: "Login",
        cancelText: "Cancel",
        onOk: () => navigate("/login", { state: { from: location.pathname } }),
      });
      return;
    }
    if (!selectedSize) {
      Modal.error({ content: "Please select size!" });
      return;
    }
    if (!selectedColor) {
      Modal.error({ content: "Please select color!" });
      return;
    }
    const selectedDetail = productDetails.find(
      detail => detail.size === selectedSize && detail.color === selectedColor
    );

    if (!selectedDetail) {
      Modal.error({ content: "Selected size and color combination is not available!" });
      return;
    }

    if (quantity > selectedDetail.stockQuantity) {
      Modal.error({ content: `Cannot buy more than ${selectedDetail.stockQuantity} items.` });
      return;
    }

    const formattedItem = {
      key: selectedDetail.productDetailID,
      name: product?.productName || 'Unknown',
      price: discountedPrice || 0,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      image: product?.imageURL?.[0] || '',
      stockQuantity: selectedDetail.stockQuantity,
    };

    const itemsToCheckout = [formattedItem];
    navigate("/checkout", { state: { selectedItems: itemsToCheckout } });
  };



  const changeImage = (image) => {
    setMainImage(image);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const stock = productDetails.find(
      (detail) => detail.color === selectedColor && detail.size === size
    )?.stockQuantity;

    setSelectedStock(stock ?? 0);
  };


  const handleColorSelect = (color) => {
    setSelectedColor(color);

    const sizesForColor = productDetails
      .filter((detail) => detail.color === color && detail.stockQuantity > 0)
      .map((detail) => detail.size);

    setFilteredSizes([...new Set(sizesForColor)]);
    setSelectedSize(null);
  };


  const handleAddToCart = () => {
    if (!selectedSize) {
      Modal.error({ content: "Please select size!" });
      return;
    }
    if (!selectedColor) {
      Modal.error({ content: "Please select color!" });
      return;
    }
    const selectedDetail = productDetails.find(
      detail => detail.size === selectedSize && detail.color === selectedColor
    );
    if (!selectedDetail) {
      Modal.error({ content: "Selected size combination is not available!" });
      return;
    }

    if (quantity > selectedStock) {
      Modal.error({ content: `Cannot add more than ${selectedStock} items to the cart.` });
      return;
    }

    const cartItem = {
      cart: { cartID: user.userID },
      productDetail: { productDetailID: selectedDetail.productDetailID },
      quantity,
    };
    try {
      addCartItem(cartItem)
      Modal.success({ content: "Added to cart successfully!" });
    } catch (error) {
      Modal.error({
        content: "Failed add to cart. Please try again.",
      });
    }

  };

  const handleQuantityChange = (value) => {
    if (value > selectedStock) {
      Modal.warning({
        content: `Chỉ còn ${selectedStock} sản phẩm trong kho.`,
      });
      setQuantity(selectedStock);
    } else {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }
  return (
    <div className="product-details-container">
      <Row gutter={24} className="product-details">
        <Col span={18} className="product-image">
          <Row gutter={24}>
            <Col span={10} className="product-image">
              <Image width={"100%"} src={mainImage} alt="Main Product" className="main-image" />
              <Row gutter={10} className="thumbnail-images">
                {product?.imageURL?.map((image, index) => (
                  <Col key={index}>
                    <Image
                      preview={false}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => changeImage(image)}
                      className={`thumbnail ${mainImage === image ? "active" : ""}`}
                    />
                  </Col>
                )) || <p>No images available</p>}
              </Row>
            </Col>
            <Col span={13} className="product-info">
              <h3>{product?.brandName || "Unknown Brand"} / {product?.categoryName || "Unknown Category"}</h3>


              <h1>{product?.productName}</h1>
              <div className="product-pricing">
                {discountedPrice && discountedPrice < product.price ? (
                  <>
                    <span className="discounted-price">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedPrice)}
                    </span>
                    <span className="original-price" style={{ textDecoration: "line-through", color: "#888" }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="discounted-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                )}
              </div>

              <h3>DESCRIPTION</h3>
              <span>{product?.description}</span>
              <h3>COLOR</h3>
              <Row gutter={10} className="options">
                {availableColors.map((color, index) => (
                  <Col key={index}>
                    <Button
                      className={`box ${selectedColor === color ? "active" : ""}`}
                      onClick={() => handleColorSelect(color)}
                    >
                      <span style={{ display: 'flex', alignItems: "center", gap: "8px" }}>
                        <span style={{
                          width: "16px", height: "16px",
                          backgroundColor: color.toLowerCase(),
                          borderRadius: "20%", border: "1px solid #ddd"
                        }} />
                        {color}
                      </span>
                    </Button>
                  </Col>
                ))}
              </Row>

              <h3>SIZE</h3>
              {selectedColor ? (
                filteredSizes.length > 0 ? (
                  <Row gutter={10} className="options">
                    {filteredSizes.map((size, index) => {
                      const stock = productDetails.find(
                        (detail) => detail.color === selectedColor && detail.size === size
                      )?.stockQuantity;

                      return (
                        <Col key={index}>
                          <Button
                            className={`box ${selectedSize === size ? "active" : ""}`}
                            onClick={() => handleSizeSelect(size)}
                            disabled={stock === 0}
                          >
                            {size.replace("SIZE_", "")}
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                ) : <p>There are no sizes available for this color.</p>
              ) : <p>Please select color first.</p>}


              {selectedSize && (
                <div style={{ marginTop: '10px' }}>
                  <span>Stock for size {selectedSize.replace("SIZE_", "")}: </span>
                  <strong>{selectedStock}</strong>
                </div>
              )}

            </Col>
          </Row>

        </Col>
        <Col span={6}>
          <div className="order-summary">
            <h3>Order Details</h3>
            <div className="order-item">
              <span>Quantity</span>
              <InputNumber
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={!selectedSize}
              />
            </div>
            <div className="order-item">
              <span>Size</span>
              <span>
                {selectedSize ? selectedSize.replace("SIZE_", "") : "No size selected"}
              </span>

            </div>
            <div className="order-item">
              <span>Price</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedPrice)}</span>
            </div>
            <div className="order-total">
              <span>Sub Total</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedPrice * quantity)}</span>
            </div>

            <div className="order-actions">
              <Button icon={<ShoppingCartOutlined />} className="btn-buy-now" onClick={handleBuyNow}>Buy Now</Button>
              <Button icon={<ShoppingOutlined />} className="btn-add-to-cart" onClick={handleAddToCart} >Add To Cart </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Review productID={productID} />

      <RelatedProducts />
    </div>
  );
};

export default ProductDetails;
