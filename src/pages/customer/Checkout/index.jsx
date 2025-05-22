import React, { useState, useEffect, useMemo } from "react";
import { Radio, Button, Image, Steps, Divider, Modal, Card, Tag, Drawer, Space } from "antd";
import { CarOutlined, TagOutlined, GiftOutlined } from "@ant-design/icons";
import "./Checkout.scss";
import OrderSuccess from "../Order";
import AddressAddForm from "../Account/AddressAddForm";
import GiftSelectionForm from "./GiftSelectionForm";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProductDetailById, fetchProductDetailByProductId } from "../../../services/productDetailService";
import { addOrder, addOrderStatusHistory } from "../../../services/orderService";
import { addOrderDetails } from "../../../services/orderDetailService";
import logoVNPAY from '../../../assets/images/logos/vnpay_logo.png';
import { addPayment, getVnPayUrl } from "../../../services/paymentService";
import { fetchVoucherWithPrice } from "../../../services/voucherService";
import { fetchAddressByUser } from "../../../services/addressService";
import { deleteCartItem } from "../../../services/cartItemService";
import { useSelector } from "react-redux";

const Checkout = () => {
  const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);
  const [modals, setModals] = useState({
    orderSuccess: false,
    voucher: false,
    addAddress: false,
    giftSelection: false,
    addressSelection: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [productDetails, setProductDetails] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("Normal");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [giftSelections, setGiftSelections] = useState({});
  const [giftProductVariants, setGiftProductVariants] = useState([]);
  const [currentGiftItem, setCurrentGiftItem] = useState(null);

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const { totalCost, discount, shippingCost, subtotal } = useMemo(() => {
    const subtotal = productDetails.reduce((total, product) => total + product.quantity * product.price, 0);
    const shippingCost = shippingMethod === "Express" ? 30000 : 0;
    let discount = 0;

    if (selectedVoucher) {
      if (selectedVoucher.freeShipping) {
        discount = shippingCost;
      } else if (selectedVoucher.discountType === "PERCENT") {
        discount = (selectedVoucher.discountValue / 100) * subtotal;
      } else if (selectedVoucher.discountType === "FIXED") {
        discount = selectedVoucher.discountValue;
      }
    }

    return {
      totalCost: subtotal + shippingCost - discount,
      discount,
      shippingCost,
      subtotal,
    };
  }, [productDetails, selectedVoucher, shippingMethod]);

  useEffect(() => {
    const recentOrder = localStorage.getItem('recentOrder');
    if (recentOrder) {
      const { orderId, orderCode } = JSON.parse(recentOrder);
      Modal.info({
        title: "Order Already Created",
        content: (
          <div>
            <p>Your order #{orderCode} has been created successfully.</p>
            <p>Please proceed to payment or view your order details.</p>
          </div>
        ),
        okText: "View Order",
        onOk: () => {
          navigate(`/account`);
          localStorage.removeItem('recentOrder');
        },
        onCancel: () => {
          navigate("/");
          localStorage.removeItem('recentOrder');
        },
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.userID) {
      fetchAddresses(user.userID);
    }
  }, [user?.userID]);

  useEffect(() => {
    if (productDetails.length === 0 && selectedItems.length > 0) {
      const fetchProductDetails = async () => {
        const details = await Promise.all(
          selectedItems.map(async (item) => {
            const productDetailId = item.key;
            const detail = await fetchProductDetailById(productDetailId);
            return { ...item, detail };
          })
        );
        setProductDetails(details);
      };
      fetchProductDetails();
    }
  }, [selectedItems]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetchVoucherWithPrice(user.userID, totalCost);
        setVouchers(response || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    if (totalCost > 0) fetchVouchers();
  }, [totalCost]);

  const fetchAddresses = async (userId) => {
    try {
      const response = await fetchAddressByUser(userId);
      setAddresses(response || []);
      if (response.length === 0) {
        setModals(prev => ({ ...prev, addAddress: true }));
      } else {
        const defaultAddress = response.find(addr => addr.default === true || addr.default === "true") || response[0];
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const openGiftSelectionModal = (item) => {
    setCurrentGiftItem(item);
    const giftProductId = item.promotion.type === "BUYX" ? item.productID : item.promotion.giftProductID;
    if (giftProductId) {
      fetchProductDetailByProductId(giftProductId)
        .then(result => {
          setGiftProductVariants(result);
          setModals(prev => ({ ...prev, giftSelection: true }));
        })
        .catch(error => {
          console.error("Error fetching gift product details:", error);
          Modal.error({ content: "Failed to load gift product variants. Please try again." });
          setGiftProductVariants([]);
        });
    }
  };

  const handleGiftSelection = (giftProductId, color, size) => {
    const giftVariant = giftProductVariants.productDetails?.find(v => v.color === color && v.size === size);
    setGiftSelections(prev => ({
      ...prev,
      [currentGiftItem.key]: {
        giftProductId,
        color,
        size,
        name: giftProductVariants?.productName || "Gift Item",
        image: `${CLOUDINARY_BASE_URL}${giftVariant?.image}`,
        giftProductDetailID: giftVariant?.productDetailID,
      },
    }));
    setModals(prev => ({ ...prev, giftSelection: false }));
  };

  const meetsPromotionCriteria = (item) => {
    const promotion = item.promotion;
    if (promotion?.type === "BUYX" && promotion.buyQuantity && item.quantity >= promotion.buyQuantity) {
      return {
        type: "BUYX",
        message: "Free 1 item",
      };
    } else if (promotion?.type === "GIFT") {
      return {
        type: "GIFT",
        message: `Free gift item`,
      };
    }
    return false;
  };

  const createOrder = async () => {
    if (!paymentMethod) {
      Modal.error({ content: "Please select a payment method!" });
      return;
    }
    if (!selectedAddress) {
      Modal.error({ content: "Please add or select a shipping address!" });
      setModals(prev => ({ ...prev, addAddress: true }));
      return;
    }

    const unfulfilledGifts = productDetails.filter(product => meetsPromotionCriteria(product) && !giftSelections[product.key]);
    if (unfulfilledGifts.length > 0) {
      Modal.error({
        content: `Please select size and color for the gift of "${unfulfilledGifts[0].name}".`,
        onOk: () => openGiftSelectionModal(unfulfilledGifts[0]),
      });
      return;
    }

    const date = new Date();
    const orderCode = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

    const order = {
      orderDate: new Date().toISOString().split("T")[0],
      status: "PENDING",
      total: totalCost,
      feeShip: shippingCost,
      shippingAddress: `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`,
      user: { userID: user.userID },
      code: orderCode,
      paymentMethod: paymentMethod === "VNPAY" ? "VNPAY" : "CASH",
      ...(selectedVoucher && { voucher: { voucherID: selectedVoucher.voucherID } }),
      voucherDiscount: discount,
    };

    try {
      const response = await addOrder(order);
      if (response && response.data.orderID) {
        const orderID = response.data.orderID;
        localStorage.setItem('recentOrder', JSON.stringify({
          orderId: orderID,
          orderCode: orderCode,
          createdAt: new Date().toISOString(),
        }));
        await Promise.all(
          productDetails.map(async (product) => {
            const giftSelection = giftSelections[product.key];
            const orderDetail = {
              quantity: product.quantity,
              price: product.price,
              productDetail: { productDetailID: product.key },
              order: { orderID },
              ...(giftSelection && {
                giftProductDetail: { productDetailID: giftSelection.giftProductDetailID },
                giftedQuantity: 1,
              }),
              ...(product.promotion && {
                promotion: { promotionID: product.promotion.promotionID },
              }),
            };
            await addOrderDetails(orderDetail);
          })
        );
        await Promise.all(
          selectedItems
            .filter(item => item.cartItemID)
            .map(async (item) => {
              try {
                await deleteCartItem(item.cartItemID);
              } catch (error) {
                console.error(`Failed to delete cart item ${item.cartItemID}:`, error);
              }
            })
        );
        const payment = { paymentDate: new Date().toISOString(), status: "PENDING", order: { orderID } };
        await addPayment(payment);

        let vnPayUrl = null;
        if (paymentMethod === "VNPAY") {
          const vnPayResponse = await getVnPayUrl(totalCost, orderCode);
          vnPayUrl = vnPayResponse.paymentUrl;
        }
        const orderStatusHistory = {
          order: { orderID: orderID },
          status: "PENDING",
          changeAt: new Date().toISOString().split("T")[0],
          trackingNumber: null,
          cancelReason: null,
          changedBy: { userID: user.userID }
        };
        await addOrderStatusHistory(orderStatusHistory);

        setModalData({
          transactionDate: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
          paymentMethod: paymentMethod === "VNPAY" ? "VNPAY" : "CASH",
          shippingMethod: shippingMethod === "Express" ? "Express delivery (1-3 days)" : "Normal delivery (3-5 days)",
          products: productDetails,
          ...(Object.keys(giftSelections).length > 0 && {
            gifts: Object.values(giftSelections).map(gift => ({
              productKey: Object.keys(giftSelections).find(key => giftSelections[key] === gift),
              name: gift.name,
              color: gift.color,
              size: gift.size,
              quantity: 1,
              image: gift.image,
            }))
          }),
          subtotal,
          shippingCost,
          total: totalCost,
          vnPayUrl,
        });

        setModals(prev => ({ ...prev, orderSuccess: true }));
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Modal.error({ content: "Failed to place the order. Please try again." });
    }
  };

  const handleCloseSuccessDrawer = () => {
    setModals(prev => ({ ...prev, orderSuccess: false }));
    navigate("/");
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setModals(prev => ({ ...prev, addressSelection: false }));
  };

  const handleAddAddressSubmit = async (newAddress) => {
    try {
      const updatedAddresses = await fetchAddressByUser(user.userID);
      setAddresses(updatedAddresses || []);
      setSelectedAddress(newAddress);
      setModals(prev => ({ ...prev, addAddress: false }));
    } catch (error) {
      console.error("Error refreshing addresses:", error);
    }
  };

  const ProductItem = ({ product, index }) => {
    const selectedGift = giftSelections[product.key];
    const promotionInfo = meetsPromotionCriteria(product);

    return (
      <div key={product.detail?.productDetailID || `product-${index}`} className="product-item-container">
        <div className="product-item">
          <Image src={CLOUDINARY_BASE_URL + product.image} className="product-image" width={150} preview={false} />
          <div className="product-details">
            <p className="product-name">{product.name}</p>
            <p className="product-variant">{`${product.detail.color} / ${product.detail.size.replace("SIZE_", "")}`}</p>
            <p className="product-quantity">x {product.quantity}</p>
          </div>
          <p className="product-price">{formatCurrency(product.price * product.quantity)}</p>
        </div>
        {promotionInfo && (
          <div className="promotion-section">
            <Space>
              <Tag icon={<GiftOutlined />} color="green" className="promotion-tag">
                {promotionInfo.message}
              </Tag>
              {!selectedGift && (
                <Button
                  className="select-gift-button"
                  onClick={() => openGiftSelectionModal(product)}
                >
                  Select Gift
                </Button>
              )}
            </Space>
            {selectedGift && (
              <div className="gift-item">
                <Image src={selectedGift.image || ''} className="gift-image" width={80} preview={false} />
                <div className="gift-details">
                  <p className="gift-name">
                    <Tag color="green" className="gift-tag">Gift</Tag>
                    {selectedGift.name}
                  </p>
                  <p className="gift-variant">{`${selectedGift.color} / ${selectedGift.size.replace("SIZE_", "")}`}</p>
                  <p className="gift-quantity">x 1</p>
                </div>
                <p className="gift-price">Free</p>
              </div>
            )}
          </div>
        )}
        <Divider className="product-divider" />
      </div>
    );
  };

  const steps = [
    {
      title: "Shipping Address",
      content: (
        <div className="step-content">
          <div className="info-row">
            <span className="info-label">Contact</span>
            <span className="info-value">{selectedAddress ? `${selectedAddress.fullName} - ${selectedAddress.phone}` : "No address selected"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Address</span>
            <span className="info-value">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}` : "No address selected"}</span>
            <Button
              className="change-button"
              onClick={() => setModals(prev => ({ ...prev, [addresses.length === 0 ? "addAddress" : "addressSelection"]: true }))}
            >
              {addresses.length === 0 ? "Add" : "Change"}
            </Button>
          </div>
          <div className="info-row">
            <span className="info-label">Shipping Method</span>
            <Radio.Group value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} className="shipping-options">
              <Radio value="Normal">Normal</Radio>
              <Radio value="Express">Express</Radio>
            </Radio.Group>
          </div>
          <div className="info-row">
            <span className="info-label">Voucher</span>
            <span className="info-value">
              {selectedVoucher ? (
                <div className="voucher-info">
                  {selectedVoucher.freeShipping ? (
                    <>
                      <CarOutlined className="voucher-icon free-shipping" />
                      <span>{selectedVoucher.code} - Free shipping</span>
                    </>
                  ) : selectedVoucher.discountType === "PERCENT" ? (
                    <>
                      <TagOutlined className="voucher-icon discount" />
                      <span>{selectedVoucher.code} - {selectedVoucher.discountValue}% off</span>
                    </>
                  ) : (
                    <>
                      <TagOutlined className="voucher-icon discount" />
                      <span>{selectedVoucher.code} - {formatCurrency(selectedVoucher.discountValue)} off</span>
                    </>
                  )}
                </div>
              ) : (
                "No voucher selected"
              )}
            </span>
            <Button className="change-button" onClick={() => setModals(prev => ({ ...prev, voucher: true }))}>Change</Button>
          </div>
        </div>
      ),
    },
    {
      title: "Payment Method",
      content: (
        <div className="step-content">
          <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="payment-options">
            <Radio value="VNPAY" className="payment-option">
              <img src={logoVNPAY} className="payment-logo" alt="VNPay" /> VNPay
            </Radio>
            <Radio value="Cod" className="payment-option">Cash on Delivery</Radio>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: "Confirm Order",
      content: (
        <div className="step-content">

          <Button className="pay-now-button" onClick={createOrder}>
            Pay Now
          </Button>
          <Button className="back-button" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="modern-checkout-container">
      <div className="checkout-steps">
        <Steps current={currentStep} direction="vertical" onChange={setCurrentStep}>
          {steps.map((step, index) => (
            <Steps.Step
              key={`step-${index}`}
              title={step.title}
              description={step.content}
            />
          ))}
        </Steps>
      </div>

      <div className="order-summary">
        <h2 className="summary-title">Order Summary</h2>
        <div className="products-list">
          {productDetails.map((product, index) => (
            <ProductItem key={product.key} product={product} index={index} />
          ))}
        </div>
        <div className="summary-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
          </div>
          <div className="total-row">
            <span>Discount</span>
            <span>{discount === 0 ? "0" : `- ${formatCurrency(discount)}`}</span>
          </div>
          <Divider className="totals-divider" />
          <div className="total-row final-total">
            <span>Total</span>
            <span>{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </div>

      <Drawer open={modals.orderSuccess} onClose={handleCloseSuccessDrawer} placement="right" width={400}>
        <OrderSuccess data={modalData} />
      </Drawer>

      <Modal open={modals.voucher} onCancel={() => setModals(prev => ({ ...prev, voucher: false }))} centered footer={null}>
        <h3>Select a Voucher</h3>
        <Radio.Group onChange={(e) => setSelectedVoucher(vouchers.find(v => v.voucherID === e.target.value))}>
          {vouchers.map((voucher) => (
            <Card key={voucher.voucherID} className="voucher-card">
              <Radio value={voucher.voucherID}>
                {voucher.code} - {voucher.freeShipping ? (
                  <>
                    <CarOutlined className="voucher-icon free-shipping" /> Free shipping
                  </>
                ) : voucher.discountType === "PERCENT" ? (
                  <>
                    <TagOutlined className="voucher-icon discount" /> {voucher.discountValue}% off
                  </>
                ) : (
                  <>
                    <TagOutlined className="voucher-icon discount" /> {voucher.discountValue?.toLocaleString() || "0"}₫ off
                  </>
                )}
              </Radio>
            </Card>
          ))}
        </Radio.Group>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setModals(prev => ({ ...prev, voucher: false }))}>Select</Button>
        </div>
      </Modal>

      <Modal open={modals.addressSelection} onCancel={() => setModals(prev => ({ ...prev, addressSelection: false }))} centered footer={null}>
        <h3>Select a Shipping Address</h3>
        <Radio.Group
          onChange={(e) => handleSelectAddress(addresses.find(addr => addr.addressID === e.target.value))}
          value={selectedAddress?.addressID}
        >
          {addresses.map((address) => (
            <Card key={address.addressID} className="address-card">
              <Radio value={address.addressID}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{address.fullName}</strong>
                  {address.default && <Tag color="blue">Default</Tag>}
                </div>
                <div>{address.phone}</div>
                <div>{`${address.street}, ${address.ward}, ${address.district}, ${selectedAddress.city}`}</div>
              </Radio>
            </Card>
          ))}
        </Radio.Group>
        <div style={{ marginTop: 16 }}>
          <Button style={{ marginLeft: 8 }} onClick={() => setModals(prev => ({ ...prev, addressSelection: false, addAddress: true }))}>
            Add New Address
          </Button>
        </div>
      </Modal>

      <Modal
        open={modals.addAddress}
        onCancel={() => {
          setModals(prev => ({ ...prev, addAddress: false, ...(addresses.length > 0 && { addressSelection: true }) }));
          if (addresses.length === 0) navigate(-1);
        }}
        centered
        footer={null}
        title="Add New Address"
      >
        <AddressAddForm onSubmit={handleAddAddressSubmit} />
      </Modal>

      <Modal
        open={modals.giftSelection}
        onCancel={() => setModals(prev => ({ ...prev, giftSelection: false }))}
        centered
        footer={null}
        title="Select Size and Color for Gift"
      >
        <GiftSelectionForm
          variants={giftProductVariants.productDetails}
          onSelect={(color, size) => handleGiftSelection(currentGiftItem.promotion.giftProductID, color, size)}
          productName={giftProductVariants.productName}
          variantsData={giftProductVariants.productDetails}
        />
      </Modal>
    </div>
  );
};

export default Checkout;