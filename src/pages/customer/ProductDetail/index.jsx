import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button, InputNumber, Image, Tag, Spin, Modal } from "antd";
import { ShoppingCartOutlined, ShoppingOutlined, GiftOutlined } from "@ant-design/icons";
import "./ProductDetail.scss";
import RelatedProducts from "./RelatedProducts";
import Review from "./Review";
import { useSelector } from "react-redux";
import { fetchProductDetailByProductId } from "../../../services/productDetailService";
import { addCartItem } from "../../../services/cartItemService";

const ProductDetails = () => {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const navigate = useNavigate();
  const { productID } = useParams();
  const [product, setProduct] = useState([]);
  const [mainImage, setMainImage] = useState();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [promotion, setPromotion] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [giftProduct, setGiftProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueImagesByColor, setUniqueImagesByColor] = useState({});
  const [allUniqueImages, setAllUniqueImages] = useState([]); 
  const user = useSelector((state) => state.account.user);
  const location = useLocation();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const details = await fetchProductDetailByProductId(productID);
        if (details) {
          setProduct({
            productName: details.productName || "No name",
            categoryName: details.categoryName || "No category",
            brandName: details.brandName || "No brand",
            description: details.description || "No description",
            price: details.price || 0,
            discount: details.discountPrice,
          });
          setPromotion(details.promotion);
          setProductDetails(details.productDetails || []);

          
          const imagesByColor = {};
          const allImagesSet = new Set();
          details.productDetails.forEach((detail) => {
            if (!imagesByColor[detail.color]) {
              imagesByColor[detail.color] = new Set();
            }
            imagesByColor[detail.color].add(detail.image);
            allImagesSet.add(detail.image);
          });
          const uniqueImages = {};
          Object.keys(imagesByColor).forEach((color) => {
            uniqueImages[color] = Array.from(imagesByColor[color]);
          });
          setUniqueImagesByColor(uniqueImages);
          setAllUniqueImages(Array.from(allImagesSet));

          if (details.productDetails.length > 0) {
            setMainImage(details.productDetails[0].image);
          }

          if (details.promotion?.type === "GIFT" && details.promotion.giftProductID) {
            try {
              const giftDetails = await fetchProductDetailByProductId(details.promotion.giftProductID);
              setGiftProduct(giftDetails);
            } catch (giftError) {
              console.error("Error fetching gift product:", giftError);
              setGiftProduct(null);
            }
          }

          const colors = [...new Set(details.productDetails?.map(d => d.color))] || [];
          setAvailableColors(colors);
          if (colors.length > 0) {
            const firstColor = colors[0];
            setSelectedColor(firstColor);
            const sizesForColor = details.productDetails
              .filter((detail) => detail.color === firstColor && detail.stockQuantity > 0)
              .map((detail) => detail.size);
            const uniqueSizes = [...new Set(sizesForColor)];
            setFilteredSizes(uniqueSizes);
            if (uniqueSizes.length > 0) {
              const firstSize = uniqueSizes[0];
              setSelectedSize(firstSize);
              const stock = details.productDetails.find(
                (detail) => detail.color === firstColor && detail.size === firstSize
              )?.stockQuantity;
              setSelectedStock(stock ?? 0);
              setMainImage(uniqueImages[firstColor][0]); 
            }
          }
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
      price: product.discount,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      image: selectedDetail.image, 
      stockQuantity: selectedDetail.stockQuantity,
      promotion: promotion,
      productID: productID
    };

    const itemsToCheckout = [formattedItem];
    navigate("/checkout", { state: { selectedItems: itemsToCheckout } });
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
    const stock = productDetails.find(
      (detail) => detail.color === selectedColor && detail.size === size
    )?.stockQuantity;
    setSelectedStock(stock ?? 0);
    const detail = productDetails.find(
      (detail) => detail.color === selectedColor && detail.size === size
    );
    setMainImage(detail?.image);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setQuantity(1);
    const sizesForColor = productDetails
      .filter((detail) => detail.color === color && detail.stockQuantity > 0)
      .map((detail) => detail.size);
    const uniqueSizes = [...new Set(sizesForColor)];
    setFilteredSizes(uniqueSizes);
    setSelectedSize(null);
    setSelectedStock(0);
   
    if (uniqueImagesByColor[color] && uniqueImagesByColor[color].length > 0) {
      setMainImage(uniqueImagesByColor[color][0]);
    }
    if (uniqueSizes.length > 0) {
      const firstSize = uniqueSizes[0];
      setSelectedSize(firstSize);
      const detail = productDetails.find(
        (detail) => detail.color === color && detail.size === firstSize
      );
      setSelectedStock(detail?.stockQuantity ?? 0);
      setMainImage(detail?.image);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      Modal.confirm({
        title: "Please log in to continue shopping",
        content: "You need to login to activate shopping cart",
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
      addCartItem(cartItem);
      Modal.success({ content: "Added to cart successfully!" });
    } catch (error) {
      Modal.error({
        content: "Failed add to cart. Please try again.",
      });
    }
  };

  const handleQuantityChange = (value) => {
    if (value > selectedStock && selectedStock > 0) {
      Modal.warning({
        content: `Only ${selectedStock} product stock.`,
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
    <div className="product-detail-container">
      <Row gutter={40} className="product-details">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8} className="image-gallery">
              <Image
                src={CLOUDINARY_BASE_URL + mainImage}
                alt={product.productName}
                className="main-image"
                preview={true}
                
              />
              <div className="thumbnail-container">
                {allUniqueImages.map((image, index) => (
                  <div className="thumbnail-wrapper" key={index}>
                    <Image
                      src={CLOUDINARY_BASE_URL + image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${mainImage === image ? "active" : ""}`}
                      onClick={() => setMainImage(image)}
                      preview={false}
                    />
                  </div>
                ))}
              </div>
            </Col>
            <Col span={16} className="product-info">
              <div className="info-header">
                <h3>{product.brandName} / {product.categoryName}</h3>
                <h1>{product.productName}</h1>
              </div>
              {promotion && (
                <div className="promotion-box">
                  <Tag icon={<GiftOutlined />} color="orange">
                    Special Promotion
                  </Tag>
                  {promotion.type === "PERCENTAGE" && (
                    <span>
                      Save {promotion.discountValue}% 
                      {promotion.maxDiscount != null ? ` (Max ${(promotion.maxDiscount).toLocaleString()}₫)` : ""}
                    </span>
                  )}
                  {promotion.type === "FIXED" && (
                    <span>
                      Save {(promotion.discountValue)?.toLocaleString() || "0"}₫
                    </span>
                  )}
                  {promotion.type === "BUYX" && (
                    <span>Get 1 free when buying {(promotion.buyQuantity)?.toLocaleString() || "0"}+ items</span>
                  )}
                  {promotion.type === "GIFT" && giftProduct && (
                    <span>Free {giftProduct.productName}</span>
                  )}
                </div>
              )}
              <p className="description">{product.description}</p>
              <div className="pricing">
                <span className="discounted-price">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discount)}
                </span>
                {product.discount !== product.price && (
                  <span className="original-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price )}
                  </span>
                )}
              </div>
              <div className="variant-selection">
                <div className="color-section">
                  <h3>Color</h3>
                  <div className="color-options">
                    {availableColors.map((color) => (
                      <Button
                        key={color}
                        className={`color-btn ${selectedColor === color ? "active" : ""}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <span
                          className="color-swatch"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="size-section">
                  <h3>Size</h3>
                  {selectedColor ? (
                    filteredSizes.length > 0 ? (
                      <div className="size-options">
                        {filteredSizes.map((size) => {
                          const stock = productDetails.find(
                            (detail) => detail.color === selectedColor && detail.size === size
                          )?.stockQuantity;
                          return (
                            <Button
                              key={size}
                              className={`size-btn ${selectedSize === size ? "active" : ""}`}
                              onClick={() => handleSizeSelect(size)}
                              disabled={stock === 0}
                            >
                              {size.replace("SIZE_", "")}
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No sizes available for this color.</p>
                    )
                  ) : (
                    <p>Please select a color first.</p>
                  )}
                  {selectedSize && (
                    <p className="stock-info">Stock for size {selectedSize.replace("SIZE_", "")}: {selectedStock}</p>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8} className="order-summary">
          <h3>Order Details</h3>
          <div className="order-item">
            <span>Quantity</span>
            <InputNumber
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input"
            />
          </div>
          <div className="order-item">
            <span>Size</span>
            <span>{selectedSize ? selectedSize.replace("SIZE_", "") : "N/A"}</span>
          </div>
          <div className="order-item">
            <span>Color</span>
            <span>{selectedColor || "N/A"}</span>
          </div>
          <div className="order-item">
            <span>Price</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * quantity)}</span>
          </div>
          <div className="order-item">
            <span>Discount</span>
            <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((product.price - product.discount) * quantity)}</span>
          </div>
          <div className="order-total">
            <span>Sub Total</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.discount * quantity)}</span>
          </div>
          <div className="order-actions">
            <Button icon={<ShoppingCartOutlined />} className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </Button>
            <Button icon={<ShoppingOutlined />} className="add-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
      <Review productID={productID} />
      <RelatedProducts productId={productID} />
    </div>
  );
};

export default ProductDetails;