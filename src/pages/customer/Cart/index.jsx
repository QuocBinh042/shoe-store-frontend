import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { InputNumber, Button, Checkbox, Row, Col, Modal, Tag } from "antd";
import './Cart.scss';
import { ArrowLeftOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { fetchCartItemByCartId, updateCartItem, deleteCartItem } from "../../../services/cartItemService";
import { useSelector } from "react-redux";

const Cart = () => {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckout = location.pathname.includes("/cart/checkout");
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const user = useSelector((state) => state.account.user);
  const debounceTimer = useRef(null);
  const DEBOUNCE_DELAY = 500;

  useEffect(() => {
    if (user?.userID) {
      loadCartItemByUser();
    } else {
      setCartItems([]);
    }
  }, [user, location.pathname]);

  const loadCartItemByUser = async (page = 1, size = 3) => {
    const data = await fetchCartItemByCartId(page, size);
    console.log(data)
    if (data && Array.isArray(data.items)) {
      const enrichedCartItems = data.items.map((cartItem) => {
        let promotionText = '';
        const promotion = cartItem.promotion;
        if (promotion) {
          switch (promotion.type) {
            case 'PERCENTAGE':
              promotionText = `Sale ${promotion.discountValue}%`;
              break;
            case 'FIXED':
              promotionText = `Save ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promotion.discountValue)}`;
              break;
            case 'BUYX':
              promotionText = `Free ${promotion.getQuantity} buy ${promotion.buyQuantity}+`;
              break;
            case 'GIFT':
              promotionText = `Free Gift`;
              break;
            default:
              promotionText = promotion.description || 'No Promotion';
          }
        }
        return {
          key: cartItem.productDetailDTO.productDetailID,
          name: cartItem.productDTO.productName,
          size: cartItem.productDetailDTO.size,
          colors: cartItem.productDetailDTO.color,
          quantity: cartItem.cartItemDTO.quantity,
          price: cartItem.productDTO.price,
          image: cartItem.productDetailDTO.image,
          stockQuantity: cartItem.productDetailDTO.stockQuantity,
          isChecked: false,
          discountPrice: cartItem.discountPrice,
          promotionText: promotionText,
          promotion: promotion,
          productID: cartItem.productDTO.productID,
          cartItemID: cartItem.cartItemDTO.cartItemID
        };
      });
      setCartItems(enrichedCartItems);
      setTotalItems(data.totalElements);
    } else {
      console.log('No products received or invalid data format');
    }
  };

  const handleQuantityChange = (value, product) => {
    if (value > product.stockQuantity) {
      Modal.error({ content: `Cannot exceed stock of ${product.stockQuantity}.` });
      value = product.stockQuantity;
    }

    setCartItems(prevItems => prevItems.map(item =>
      item.key === product.key ? { ...item, quantity: value } : item
    ));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateCartAPI(product.cartItemID, value);
    }, DEBOUNCE_DELAY);
  };

  const updateCartAPI = async (cartItemID, quantity) => {
    try {
      await updateCartItem(cartItemID, quantity);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.isChecked);
    if (selectedItems.length === 0) {
      Modal.warning({
        title: "No items selected",
        content: "Please select at least one item before proceeding to checkout."
      });
      return;
    }

    const invalidItems = selectedItems.filter(item => item.quantity > item.stockQuantity);
    if (invalidItems.length > 0) {
      Modal.error({
        title: "Quantity exceeds stock",
        content: "Some items exceed available stock. Please adjust quantity before checkout."
      });
      return;
    }

    navigate("/checkout", { state: { selectedItems } });
  };

  const handleCheckboxChange = (checked, productKey) => {
    setCartItems(cartItems.map(item =>
      item.key === productKey ? { ...item, isChecked: checked } : item
    ));
  };

  const handleSelectAll = (checked) => {
    setCartItems(cartItems.map(item => ({ ...item, isChecked: checked })));
  };

  const handleRemove = (id) => {
    deleteCartItem(id)
      .then((response) => {
        if (response.statusCode === 200) {
          loadCartItemByUser(currentPage, pageSize);
          Modal.success({ content: 'Item removed successfully!' });
        } else {
          Modal.error({ content: 'Unexpected error occurred while removing item.' });
        }
      })
      .catch((error) => {
        console.error('Error removing cart item:', error);
        Modal.error({ content: 'Error removing item!' });
      });
  };

  const subtotal = cartItems
    .filter(item => item.isChecked)
    .reduce((total, item) => total + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <>
      {!isCheckout && (
        <div className="cart-container">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <div className="cart-header">
                <h2>
                  <ShoppingCartOutlined style={{ marginRight: 8 }} />
                  Your Cart
                </h2>
                <Checkbox
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={cartItems.length > 0 && cartItems.every((item) => item.isChecked)}
                  indeterminate={cartItems.some((item) => item.isChecked) && !cartItems.every((item) => item.isChecked)}
                >
                  Select All
                </Checkbox>
              </div>
              <div className="cart-items">
                {cartItems.length === 0 ? (
                  <p className="empty-cart">Your cart is empty.</p>
                ) : (
                  cartItems.map((product) => {
                    const hasDiscount = product.discountPrice && product.discountPrice !== product.price;
                    const promotionText = product.promotionText;
                    let promoColor = "#52c41a";
                    let promoIcon = "💸";

                    if (promotionText.includes("Save") || promotionText.includes("Sale")) {
                      promoColor = "#fa541c";
                      promoIcon = "💰";
                    } else if (promotionText.includes("Free Gift")) {
                      promoColor = "#722ed1";
                      promoIcon = "🎁";
                    } else if (promotionText.includes("Buy")) {
                      promoColor = "#13c2c2";
                      promoIcon = "🛍️";
                    }

                    return (
                      <div key={product.key} className="cart-item">
                        <div className="cart-item-checkbox">
                          <Checkbox
                            checked={product.isChecked}
                            onChange={(e) => handleCheckboxChange(e.target.checked, product.key)}
                          />
                        </div>
                        <div className="cart-item-image">
                          <img
                            src={CLOUDINARY_BASE_URL + product.image}
                          />
                        </div>
                        <div className="cart-item-details">
                          <h3
                            className="product-name-link"
                            style={{ cursor: 'pointer'}}
                            onClick={() => navigate(`/product-detail/${product.productID}`)}
                          >
                            {product.name}
                          </h3>

                          <div className="cart-item-info">
                            <div className="cart-item-color">
                              <span
                                style={{
                                  backgroundColor: product.colors?.toLowerCase() || "#ddd",
                                  border: "1px solid #ddd",
                                }}
                              ></span>
                              <span>{product.colors || "N/A"}</span>
                            </div>
                            <span className="cart-item-size">
                              {product.size ? parseInt(product.size.replace('SIZE_', '')) : 'N/A'}
                            </span>
                            <span className="cart-item-stock">
                              Stock: {product.stockQuantity}
                            </span>
                          </div>
                          {promotionText ? (
                            <Tag
                              className="cart-item-promo"
                              style={{
                                backgroundColor: `${promoColor}20`,
                                border: `1px solid ${promoColor}`,
                                color: promoColor,
                              }}
                            >
                              <span className="promo-icon">{promoIcon}</span>
                              {promotionText}
                            </Tag>
                          ) : (
                            <span className="cart-item-no-promo">No Promotion</span>
                          )}
                        </div>
                        <div className="cart-item-quantity">
                          <InputNumber
                            min={1}
                            max={product.stockQuantity}
                            value={product.quantity}
                            onChange={(value) => handleQuantityChange(value, product)}
                            controls
                            parser={(value) => value.replace(/[^0-9]/g, '') || product.quantity}
                            stringMode
                            disabled={false}
                          />
                        </div>
                        <div className="cart-item-price">
                          {hasDiscount && (
                            <span className="original-price">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </span>
                          )}
                          <span className={hasDiscount ? "discounted-price" : ""}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              hasDiscount ? product.discountPrice : product.price
                            )}
                          </span>
                        </div>
                        <div className="cart-item-actions">
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemove(product.cartItemID)}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="cart-pagination">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      loadCartItemByUser(currentPage - 1, pageSize);
                    }}
                  >
                    Previous
                  </Button>
                  <span>Page {currentPage} of {Math.ceil(totalItems / pageSize)}</span>
                  <Button
                    disabled={currentPage === Math.ceil(totalItems / pageSize)}
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      loadCartItemByUser(currentPage + 1, pageSize);
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Col>
            <Col xs={24} lg={8}>
              <div className="cart-summary">
                <h2>Order Summary</h2>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                </div>
                <Button type="primary" block onClick={handleCheckout}>
                  Checkout Now
                </Button>
                <Button type="default" block onClick={() => navigate("/search")}>
                  <ArrowLeftOutlined /> Continue Shopping
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Cart;