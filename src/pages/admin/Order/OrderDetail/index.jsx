import React from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import OrderHeader from './OrderHeader';
import OrderItems from './OrderItems';
import CustomerInfo from './CustomerInfo';
import ShippingInfo from './ShippingInfo';
import OrderTimeline from './OrderTimeline';

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, you would fetch this from an API based on orderId
  const orderData = {
    orderNumber: '32543',
    date: 'Aug 17, 2025, 5:48 (ET)',
    status: [
      { label: 'Paid', color: 'green' },
      { label: 'Ready to Pickup', color: 'blue' }
    ],
    items: [
      {
        key: '1',
        productImage:
          'https://storage.googleapis.com/a1aa/image/lW0QpQxTCiKiMlyLmHBVnVSvg2QkI9X3DB5FE9XSx6U.jpg',
        productName: 'Wooden Chair',
        productDesc: 'Material: Wooden',
        price: '$841',
        qty: 2,
        total: '$1682',
      },
      {
        key: '2',
        productImage:
          'https://storage.googleapis.com/a1aa/image/ALCCmlRvSgCVv4TNt9nOf0w22F91j-7Eyp8p1sFZXuU.jpg',
        productName: 'Oneplus 10',
        productDesc: 'Storage:128gb',
        price: '$896',
        qty: 3,
        total: '$2688',
      },
    ],
    totals: {
      subtotal: '$5000.25',
      discount: '$0.00',
      total: '$5000.25'
    },
    customer: {
      customerAvatar: 'https://storage.googleapis.com/a1aa/image/qxDiJ96drN_4I6CjKzDsawHUBzj_lYUqmTQ2n2uAFC4.jpg',
      customerName: 'Shamus Tuttle',
      customerId: '58909',
      email: 'Shamus889@yahoo.com',
      phone: '+1 (609) 972-22-22'
    },
    shipping: {
      address: {
        line1: '2715 Ash Dr',
        line2: 'Suite #3',
        city: 'San Jose',
        state: 'CA',
        zip: '95148',
        country: 'United States'
      },
      method: 'Express Delivery - Free',
      trackingNumber: 'SH38900178'
    },
    billing: {
      address: {
        line1: '2715 Ash Dr',
        line2: 'Suite #3',
        city: 'San Jose',
        state: 'CA',
        zip: '95148',
        country: 'United States'
      },
      paymentMethod: 'Credit Card ****4242'
    },
    timeline: [
      {
        time: 'Tuesday 11:29 AM',
        title: 'Order was placed (Order ID: #32543)',
        description: 'Your order has been placed successfully',
      },
      {
        time: 'Wednesday 11:29 AM',
        title: 'Pick-up',
        description: 'Pick-up scheduled with courier',
      },
      {
        time: 'Thursday 11:29 AM',
        title: 'Dispatched',
        description: 'Item has been picked up by courier',
      },
      {
        time: 'Saturday 15:20 AM',
        title: 'Package arrived',
        description: 'Package arrived at an Amazon facility, NY',
      },
      {
        time: 'Today 14:12 PM',
        title: 'Dispatched for delivery',
        description: 'Package has left an Amazon facility, NY',
      },
      {
        time: '',
        title: 'Delivery',
        description: 'Package will be delivered by tomorrow',
      },
    ]
  };

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting order:', orderId);
    // After deletion, navigate back to orders list
    navigate('/admin/orders');
  };

  return (
    <div style={{ background: '#f0f2f5', padding: 8 }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
          marginBottom: 24
        }}
      >
        {/* Header Section */}
        <OrderHeader 
          orderNumber={orderData.orderNumber}
          date={orderData.date}
          status={orderData.status}
          onBack={handleBack}
          onDelete={handleDelete}
        />

        {/* Two-column layout */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {/* Left Column - Order Items */}
          <Col xs={24} lg={16}>
            <OrderItems 
              items={orderData.items}
              subtotal={orderData.totals.subtotal}
              discount={orderData.totals.discount}
              tax={orderData.totals.tax}
              total={orderData.totals.total}
            />
          </Col>
          
          {/* Right Column - Customer & Shipping Info */}
          <Col xs={24} lg={8}>
            <div className="customer-details-container">
              {/* Customer Details */}
              <CustomerInfo 
                customerAvatar={orderData.customer.customerAvatar}
                customerName={orderData.customer.customerName}
                customerId={orderData.customer.customerId}
                email={orderData.customer.email}
                phone={orderData.customer.phone}
              />
              
              {/* Shipping Address */}
              <div style={{ marginTop: 20 }}>
                <ShippingInfo 
                  address={orderData.shipping.address}
                  method={orderData.shipping.method}
                  trackingNumber={orderData.shipping.trackingNumber}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Order Timeline */}
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <OrderTimeline items={orderData.timeline} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetail;
