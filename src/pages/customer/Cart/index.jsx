import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, UNSAFE_NavigationContext as NavigationContext, Outlet } from "react-router-dom";
import { Table, InputNumber, Button, Card, Checkbox, Row, Col, Select, Input, Modal } from "antd";
import './Cart.scss'
import { ArrowLeftOutlined, CheckCircleOutlined, DeleteOutlined, DownCircleFilled, EditOutlined } from "@ant-design/icons";
import { fetchCartItemByCartId, updateCartItem, deleteCartItem } from "../../../services/cartItemService";
import { useSelector } from "react-redux";
const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const isCheckout = location.pathname.includes("/cart/checkout");
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const user = useSelector((state) => state.account.user);
  useEffect(() => {
    if (user?.userID) {
      loadCartItemByUser(user.userID);
    } else {
      setCartItems([]);
    }
  }, [user, location.pathname]);

  const loadCartItemByUser = async (id, page = 1, size = 3) => {
    const data = await fetchCartItemByCartId(id, page, size);
    if (data && Array.isArray(data.items)) {
      const enrichedCartItems = data.items.map((cartItem) => {
        const productDetail = cartItem.productDetailDTO;
        const productName = cartItem.productName;
        return {
          key: cartItem.cartItemDTO.cartItemID,
          name: productName,
          size: productDetail.size,
          colors: productDetail.color,
          quantity: cartItem.cartItemDTO.quantity,
          initialQuantity: cartItem.cartItemDTO.quantity,
          price: cartItem.productPrice,
          image: productDetail.imageURL,
          stockQuantity: productDetail.stockQuantity,
          isChecked: false,
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

    setIsChanged(true);
  };


  useEffect(() => {
    const previousPath = prevPath.current;
    prevPath.current = location.pathname;

    if (isChanged && previousPath.includes("/cart") && !location.pathname.includes("/cart")) {
      console.log("🚀 Gọi API khi rời khỏi trang giỏ hàng...");
      updateCartAPI(cartItems);
    }
  }, [location.pathname]);





  const updateCartAPI = async (cartItems) => {
    try {
      const updatedItems = cartItems
        .filter(item => item.quantity !== item.initialQuantity)
        .map(item => ({
          cartItemID: item.key,
          quantity: item.quantity,
        }));

      if (updatedItems.length > 0) {
        await Promise.all(updatedItems.map(item =>
          updateCartItem(item.cartItemID, item.quantity)
        ));
      }
    } catch (error) {
      console.error(error);
    }
  };


  //To checkout form
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.isChecked);
    if (selectedItems.length === 0) {
      Modal.warning({ title: "No items selected", content: "Please select at least one item before proceeding to checkout." });
      return;
    }

    if (isChanged) {
      updateCartAPI(cartItems).then(() => {
        navigate("/checkout", { state: { selectedItems } });
      });
    } else {
      navigate("/checkout", { state: { selectedItems } });
    }
  };

  //Check item
  const handleCheckboxChange = (checked, productKey) => {
    const updatedItems = cartItems.map((item) =>
      item.key === productKey ? { ...item, isChecked: checked } : item
    );
    setCartItems(updatedItems);
  };
  //Select all item
  const handleSelectAll = (checked) => {
    const updatedItems = cartItems.map((item) => ({
      ...item,
      isChecked: checked,
    }));
    setCartItems(updatedItems);
  };
  //Delete cartItem
  const handleRemove = (id) => {
    const cartId = user.userID;
    deleteCartItem(id)
      .then((response) => {
        if (response.statusCode === 200) {
          loadCartItemByUser(cartId, currentPage, pageSize);
          Modal.success({
            content: 'Item removed successfully!',
          });
        } else {
          Modal.error({
            content: 'Unexpected error occurred while removing item.',
          });
        }
      })
      .catch((error) => {
        console.error('Error removing cart item:', error);
        Modal.error({
          content: 'Error removing item!',
        });
      });
  };
  const subtotal = cartItems
    .filter(item => item.isChecked)
    .reduce((total, item) => total + item.price * item.quantity, 0);


  const columns = [
    {
      dataIndex: "checkbox",
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={cartItems.length > 0 && cartItems.every((item) => item.isChecked)}
          indeterminate={cartItems.some((item) => item.isChecked) && !cartItems.every((item) => item.isChecked)}
        >
          Select All
        </Checkbox>
      ),
      render: (_, product) => (
        <Checkbox
          checked={product.isChecked}
          onChange={(e) => handleCheckboxChange(e.target.checked, product.key)}
        />
      ),
    },
    {
      title: "PRODUCT",
      dataIndex: "name",
      render: (_, product) => (
        <Row gutter={[16, 16]} align="middle">
          <Col className="cart-item__image-wrapper">
            <img className="cart-item__image" src={product.image} />
          </Col>
          <Col>
            <div className="cart-item__name">{product.name}</div>
            <div style={{ display: 'flex' }}>
              <span className="size-item">
                {product.size ? parseInt(product.size.replace('SIZE_', '')) : 'N/A'}
              </span>

              <div className="color-item">
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    backgroundColor: product.colors?.toLowerCase() || "#ddd",
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                    marginRight: "3px",
                  }}
                ></span>
                <span>{product.colors || "N/A"}</span>
              </div>
              <span className="stock-item">
                Stock: {product.stockQuantity}
              </span>
            </div>
          </Col>
        </Row>
      ),
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      render: (_, product) => (
        <InputNumber
          min={1}
          value={product.quantity}
          onChange={(value) => handleQuantityChange(value, product)}
        />
      ),
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "ACTIONS",
      dataIndex: "actions",
      render: (_, product) => (
        <Row gutter={8} align="middle">
          <Col>
            <Button
              type="text"
              danger
              onClick={() => handleRemove(product.key)}
            >
              <DeleteOutlined /> Remove
            </Button>
          </Col>
        </Row>
      ),
    }

  ];

  return (
    <>
      {!isCheckout && (
        <Row gutter={[16, 16]} className="cart">
          {/* Bảng giỏ hàng */}
          <Col xs={24} lg={16}>
            <Table
              dataSource={cartItems}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                  loadCartItemByUser(1, page, pageSize);
                },
              }}
              bordered={false}
            />

          </Col>

          {/* Tổng tiền */}
          <Col xs={24} lg={8}>
            <Card>
              <Row justify="space-between" className="cart-item__total-price" style={{ marginBottom: 24, fontWeight: 700 }}>
                <Col>Total</Col>
                <Col>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</Col>
              </Row>
              <Button type="primary" block
                onClick={handleCheckout}
              >
                Checkout now
              </Button>
              <Button className='cart-summary__continue' block onClick={() => navigate("/search")}>
                <ArrowLeftOutlined /> Continue shopping
              </Button>
            </Card>
          </Col>

        </Row>)}<Outlet />
    </>
  );
};

export default Cart;