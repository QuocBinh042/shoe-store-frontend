import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import OrderHeader from './OrderHeader';
import OrderItems from './OrderItems';
import CustomerInfo from './CustomerInfo';
import ShippingInfo from './ShippingInfo';
import OrderTimeline from './OrderTimeline';
import { ORDER_STATUSES, ORDER_STATUS_DETAILS, getStatusColor } from '../../../../constants/orderConstant';
import { SIZE_OPTIONS, COLOR_OPTIONS } from '../../../../constants/productConstant';
import { currencyFormat } from '../../../../utils/helper';
import { getOrderDetailByOrder } from '../../../../services/orderDetailService';
import EditCustomerModal from '../Modals/EditCustomerModal';
import EditShippingModal from '../Modals/EditShippingModal';
import EditOrderItemModal from '../Modals/EditOrderItemModal';
import { getOrderById } from '../../../../services/orderService';

const OrderDetail = () => {
  const { id: orderID } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [editShippingModalOpen, setEditShippingModalOpen] = useState(false);
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderDetailByOrder(orderID);
        const orderData = await getOrderById(orderID);
        console.log(orderID)
        setOrder(orderData.data);
        console.log('Order data:', orderData);
        console.log('Order details response:', response);
        if (response.statusCode === 200) {
          setOrderDetails(response.data);
        } else {
          console.error('Failed to fetch order detail:', response);
        }
      } catch (error) {
        console.error('Error fetching order detail:', error);
      }
    };
    fetchData();
  }, [orderID]);

  if (!orderDetails.length) return null;

  console.log('Order:', order);
  const user = order?.user;
  const isPending = order.status === 'PENDING';

  const buildTimeline = (order) => {
    const currentIndex = ORDER_STATUSES.indexOf(order.status);
    if (currentIndex === -1) return [];

    return ORDER_STATUSES.slice(0, currentIndex + 1).map((status, index) => ({
      time: index === 0 ? order.orderDate : '',
      title: ORDER_STATUS_DETAILS[status].title,
      description: ORDER_STATUS_DETAILS[status].description,
    }));
  };

  const mappedOrderData = {
    orderNumber: order.code,
    date: order.orderDate,
    status: [{ label: order.status, color: getStatusColor(order.status) }],
    items: orderDetails.map((item, idx) => ({
      key: idx.toString(),
      productImage: item.productDetail?.image || 'https://dummyimage.com/100x100/cccccc/000000&text=No+Image',
      color: item.productDetail?.color || '',
      size: item.productDetail?.size || '',
      price: currencyFormat(item.price),
      qty: item.quantity,
      total: currencyFormat((item.price || 0) * (item.quantity || 0)),
    })),
    totals: {
      subtotal: currencyFormat(order.total),
      feeShip: currencyFormat(order.feeShip),
      discount: currencyFormat(order.discount),
      total: currencyFormat(order.total),
    },
    customer: {
      customerAvatar: 'https://via.placeholder.com/150',
      customerName: user?.name || '',
      customerId: user?.userID || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
    },
    shipping: {
      address: order.shippingAddress,
      method: order.feeShip === 0 ? 'Free Shipping' : 'Standard Shipping',
      trackingNumber: order.code,
    },
    timeline: buildTimeline(order),
  };

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handleOrderAction = (nextStatus) => {
    console.log('Update order to:', nextStatus);
    // TODO: call update API here
  };

  return (
    <div style={{ background: '#f0f2f5', padding: 8 }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
          marginBottom: 24,
        }}
      >
        <OrderHeader
          orderNumber={mappedOrderData.orderNumber}
          date={mappedOrderData.date}
          status={mappedOrderData.status}
          onBack={handleBack}
        />

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <OrderItems
              items={mappedOrderData.items}
              subtotal={mappedOrderData.totals.subtotal}
              discount={mappedOrderData.totals.discount}
              feeShip={mappedOrderData.totals.feeShip}
              total={mappedOrderData.totals.total}
              onEditItem={(item) => {
                setEditingItem(item);
                setEditItemModalOpen(true);
              }}
              editable={isPending}
            />
          </Col>

          <Col xs={24} lg={8}>
            <CustomerInfo {...mappedOrderData.customer} onEdit={() => setCustomerModalOpen(true)} editable={isPending} />
            <ShippingInfo {...mappedOrderData.shipping} onEdit={() => setEditShippingModalOpen(true)} editable={isPending} />
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <OrderTimeline
              items={mappedOrderData.timeline}
              currentStatus={order.status}
              onAction={handleOrderAction}
            />
          </Col>
        </Row>
      </Card>

      <EditCustomerModal
        open={isCustomerModalOpen}
        onCancel={() => setCustomerModalOpen(false)}
        onSubmit={(updated) => {
          console.log('Updated customer:', updated);
          setCustomerModalOpen(false);
        }}
        initialValues={{
          name: mappedOrderData.customer.customerName,
          email: mappedOrderData.customer.email,
          phone: mappedOrderData.customer.phone,
        }}
      />

      <EditShippingModal
        open={editShippingModalOpen}
        onCancel={() => setEditShippingModalOpen(false)}
        onSubmit={(newShipping) => {
          console.log('Shipping updated:', newShipping);
          setEditShippingModalOpen(false);
        }}
        initialValues={mappedOrderData.shipping}
      />

      <EditOrderItemModal
        open={editItemModalOpen}
        onCancel={() => setEditItemModalOpen(false)}
        onSubmit={(updatedItem) => {
          console.log('Item updated:', updatedItem);
          setEditItemModalOpen(false);
        }}
        initialValues={editingItem}
        colorOptions={COLOR_OPTIONS.map(opt => opt.value)}
        sizeOptions={SIZE_OPTIONS.map(opt => opt.value)}
      />
    </div>
  );
};

export default OrderDetail;
