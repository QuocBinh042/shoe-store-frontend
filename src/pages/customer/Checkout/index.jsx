import React, { useState, useEffect, useMemo } from "react";
import { Radio, Button, Image, Table, Steps, Divider, Modal, Card, Tag ,Drawer } from "antd";
import { CarOutlined, TagOutlined } from "@ant-design/icons";
import "./Checkout.scss";
import OrderSuccess from "../Order";
import { useLocation,useNavigate  } from "react-router-dom";
import { fetchProductDetailById } from "../../../services/productDetailService";
import { addOrder } from "../../../services/orderService";
import { addOrderDetails } from "../../../services/orderDetailService";
import logoVNPAY from '../../../assets/images/logos/vnpay_logo.png'
import { addPayment, getVnPayUrl } from "../../../services/paymentService";
import { fetchVoucherWithPrice } from "../../../services/voucherService";
import { fetchAddressByUser } from "../../../services/addressService";
import { useSelector } from "react-redux";
const Checkout = () => {
  console.count("Checkout component renders");
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVoucherVisible, setisModalVoucherVisible] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("Normal");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalAddressVisible, setIsModalAddressVisible] = useState(false);
  const user = useSelector((state) => state.account.user);
  console.log(user)
  useEffect(() => {
    if (user?.userID) {
      fetchAddresses(user.userID);
    }
  }, [user?.userID]);
  const fetchAddresses = async (userId) => {
    try {
      const response = await fetchAddressByUser(userId);
      setAddresses(response || []);

      if (response.length === 0) {
        Modal.info({
          title: "No Address Found",
          content: "You don't have any saved addresses. Please add a new address.",
          onOk: () => {
            window.location.href = '/account';
          }
        });
      } else {
        const defaultAddress = response.find(addr => addr.default === true || addr.default === "true") || response[0];
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };



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


  const { totalCost, discount } = useMemo(() => {
    let subtotal = productDetails.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );

    let shippingCost = shippingMethod === "Express" ? 30000 : 0;
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

    return { totalCost: subtotal + shippingCost - discount, discount };
  }, [productDetails, selectedVoucher, shippingMethod]);

  const shippingCost = shippingMethod === "Express" ? 30000 : 0
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetchVoucherWithPrice(totalCost);
        setVouchers(response || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    if (totalCost > 0) fetchVouchers();
  }, [totalCost]);
  const createOrder = async () => {
    if (!paymentMethod) {
      Modal.error({
        content: "Please select a payment method!",
      });
      return;
    }
    const date = new Date();
    const orderCode = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

    const order = {
      orderDate: new Date().toISOString().split("T")[0],
      status: "Processing",
      total: totalCost,
      feeShip: shippingCost,
      shippingAddress: `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`,
      user: { userID: user.userID },
      code: orderCode,
      typePayment: paymentMethod === "VNPay" ? "VNPay" : "Cash on Delivery",
      ...(selectedVoucher && { voucher: { voucherID: selectedVoucher.voucherID } }),
      discount: discount
    };

    try {
      // const response = await addOrder(order);
      // if (response && response.data.orderID) {
      //   const orderID = response.data.orderID;

      //   // Add order details
      //   await Promise.all(
      //     productDetails.map(async (product) => {
      //       const productDetail = await fetchProductDetailById(product.detail.productDetailID)
      //       const orderDetail = {
      //         quantity: product.quantity,
      //         price: product.price,
      //         productDetail: productDetail,
      //         order: { orderID },
      //       };
      //       await addOrderDetails(orderDetail);
      //     })
      //   );

      //   // Add payment
      //   const payment = {
      //     paymentDate: new Date().toISOString(),
      //     status: "Pending",
      //     order: { orderID },
      //   };
      //   await addPayment(payment);
      let vnPayUrl = null;
      if (paymentMethod === "VNPay") {
        const vnPayResponse = await getVnPayUrl(totalCost, orderCode);
        vnPayUrl = vnPayResponse.paymentUrl;
      }
      // Set modal data
      setModalData({
        transactionDate: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        paymentMethod: paymentMethod === "VNPay" ? "VNPay" : "Cash on Delivery",
        shippingMethod: shippingMethod === "Express" ? "Express delivery (1-3 business days)" : "Normal delivery (3-5 business days)",
        products: productDetails,
        subtotal: productDetails.reduce((total, product) => total + product.quantity * product.price, 0),
        shippingCost: shippingCost,
        total: totalCost,
        vnPayUrl,
      });
      setIsModalVisible(true)
      // }
    } catch (error) {
      console.error("Error creating order, order details, or payment:", error);
      Modal.error({
        content: "Failed to place the order. Please try again.",
      });
    }
  };
  const handleCloseSuccesDrawe = () => {
    setIsModalVisible(false);
    navigate("/"); // Chuyển hướng về trang chủ
  };
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setIsModalAddressVisible(false);
  };
  const dataSource = [
    {
      key: '1',
      title: 'Contact',
      content: selectedAddress
        ? `${selectedAddress.fullName} - ${selectedAddress.phone}`
        : "No address selected",

    },

    {
      key: '2',
      title: 'Shipping address',
      content: selectedAddress
        ? `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`
        : "No address selected",
      action: <Button type="link" onClick={() => setIsModalAddressVisible(true)}>Change</Button>,
    },
    {
      key: '3',
      title: 'Shipping Method',
      content: (
        <Radio.Group
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
        >
          <Radio value="Normal">Normal</Radio>
          <Radio value="Express">Express</Radio>
        </Radio.Group>
      ),
      action: null,
    },
    {
      key: '4',
      title: 'Select a Voucher',
      content: (
        <>
          {selectedVoucher ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {selectedVoucher.freeShipping ? (
                <>
                  <CarOutlined style={{ color: "green" }} />
                  <span>{selectedVoucher.code} - Freeship</span>
                </>
              ) : selectedVoucher.discountType === "PERCENT" ? (
                <>
                  <TagOutlined style={{ color: "red" }} />
                  <span>{selectedVoucher.code} - {selectedVoucher.discountValue}% off coupon</span>
                </>
              ) : (
                <>
                  <TagOutlined style={{ color: "red" }} />
                  <span>{selectedVoucher.code} - {selectedVoucher.discountValue?.toLocaleString() || "0"}₫ off coupon</span>
                </>
              )}
            </div>
          ) : (
            <p>No voucher selected</p>
          )}

        </>
      ),
      action: <Button type="link" onClick={() => setisModalVoucherVisible(true)}>Change</Button>
    },
  ];

  const columns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: '',
      dataIndex: 'content',
      key: 'content',
      width: '60%',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '20%',
      align: 'right',
    },
  ];
  const steps = [
    {
      title: "Shipping address",
      content: (
        <>
          <Table
            style={{ padding: '20px 0' }}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            showHeader={false}
          />
        </>
      ),
    },
    {
      title: "Payment method",
      content: (
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <Radio value="VNPay">
            <img src={logoVNPAY} className="payment-logo" /> VNPay
          </Radio>
          <Radio value="Cod">Cash on Delivery</Radio>
        </Radio.Group>
      ),
    },
    {
      title: "Order confirm",
      content: <Button className="checkout-form__payment-pay-now" onClick={createOrder}>Pay now</Button>,
    },
  ];
  return (
    <>
      <div className="checkout-container">
        <div className="checkout-form">
          <Steps size="small" current={current} direction="vertical" onChange={setCurrent}>
            {steps.map((step, index) => (
              <Steps.Step
                key={`step-${index}`}
                title={<span className="custom-step-title">{step.title}</span>}
                description={step.content}
                onClick={() => setCurrent(index)}
              />
            ))}

          </Steps>
        </div>

        <div className="checkout-summary">
          <div className="checkout-summary__title">
            <span >Order Summary</span>
          </div>
          <div className="scrollable">
            {productDetails.map((product, index) => (
              <div key={product.detail?.productDetailID || `product-${index}`}>
                <div className="checkout-summary__item">
                  <Image src={product.image} className="checkout-summary__image" width={120} />
                  <div className="checkout-summary__details">
                    <p className="checkout-summary__product-name">{product.name}</p>
                    <p>{`${product.detail.color} / ${product.detail.size.replace("SIZE_", "")}`}</p>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                  <p className="checkout-summary__product-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.quantity * product.price)}</p>
                </div>
                <Divider style={{ marginTop: 1, marginBottom: 1 }} ></Divider>
              </div>

            ))}
          </div>
          <div className="checkout-summary__totals">
            <p className="checkout-summary__subtotal">Subtotal
              <span>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  productDetails.reduce((total, product) => total + product.quantity * product.price, 0)
                )}
              </span>
            </p>
            <p className="checkout-summary__shipping">Shipping
              <span>{shippingMethod === "Express" ? "30.000 ₫" : "FREE"}</span>
            </p>
            <p className="checkout-summary__discount">
              Discount
              <span>
                {selectedVoucher ? (
                  selectedVoucher.freeShipping ? (
                    `- ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingCost)} (Freeship) `
                  ) : selectedVoucher.discountType === "PERCENT" ? (
                    ` - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      (selectedVoucher.discountValue / 100) * productDetails.reduce((total, product) => total + product.quantity * product.price, 0)
                    )} (${selectedVoucher.discountValue}%) `
                  ) : (
                    ` (-${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVoucher.discountValue)})`
                  )
                ) : "0"}
              </span>
            </p>



            <Divider style={{ marginTop: 5, marginBottom: 10 }} ></Divider>
            <h4 className="checkout-summary__totals">Total <span>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}
            </span></h4>
          </div>
        </div>
      </div>
      <Drawer
        open={isModalVisible}
        onClose={handleCloseSuccesDrawe}
        placement="right" 
        width={400} 
      >
        <OrderSuccess data={modalData} />
      </Drawer>
      <Modal
        open={isModalVoucherVisible}
        onCancel={() => setisModalVoucherVisible(false)}
        centered
        footer={null}
      >
        <h3>Select a Voucher</h3>
        <Radio.Group onChange={(e) => setSelectedVoucher(vouchers.find(v => v.voucherID === e.target.value))}>
          {vouchers.map((voucher) => (
            <Card key={voucher.voucherID} className="voucher-card">
              <Radio value={voucher.voucherID}>
                {voucher.code} - {voucher.freeShipping ? (

                  <>
                    <CarOutlined style={{ color: "green" }} />  Freeship
                  </>
                ) : voucher.discountType === "PERCENT" ? (
                  <>
                    <TagOutlined style={{ color: "red" }} /> {voucher.discountValue}% off coupon
                  </>
                ) : (
                  <>
                    <TagOutlined style={{ color: "red" }} /> {voucher.discountValue?.toLocaleString() || "0"}₫ off coupon
                  </>
                )}
              </Radio>
            </Card>
          ))}
        </Radio.Group>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setisModalVoucherVisible(false)}>
            Select
          </Button>
        </div>
      </Modal>
      <Modal
        open={isModalAddressVisible}
        onCancel={() => setIsModalAddressVisible(false)}
        centered
        footer={null}
      >
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
                <div>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</div>
              </Radio>
            </Card>
          ))}
        </Radio.Group>
      </Modal>



    </>
  );
};

export default Checkout;
