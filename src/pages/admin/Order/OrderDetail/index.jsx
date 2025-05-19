import React, { useState, useEffect } from 'react';
import { Card, Row, Col, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import OrderHeader from './OrderHeader';
import OrderItems from './OrderItems';
import CustomerInfo from './CustomerInfo';
import ShippingInfo from './ShippingInfo';
import OrderTimeline from './OrderTimeline';
import { ORDER_STATUSES, ORDER_STATUS_DETAILS, getStatusColor } from '../../../../constants/orderConstant';
import { SIZE_OPTIONS, COLOR_OPTIONS } from '../../../../constants/productConstant';
import { currencyFormat } from '../../../../utils/helper';
import { getOrderDetailByOrder, updateOrderDetail } from '../../../../services/orderDetailService'; // thêm updateOrderDetail
import EditCustomerModal from '../Modals/EditCustomerModal';
import EditShippingModal from '../Modals/EditShippingModal';
import EditOrderItemModal from '../Modals/EditOrderItemModal';
import { getOrderById } from '../../../../services/orderService';
import useOrderStatus from '../../../../hooks/useOrderStatus';

const OrderDetail = () => {
  const { id: orderID } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [editShippingModalOpen, setEditShippingModalOpen] = useState(false);
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [order, setOrder] = useState(null);
  const { updateOrderStatus, loading, error } = useOrderStatus();

  // Load order + order detail
  const fetchData = async () => {
    try {
      const response = await getOrderDetailByOrder(orderID);
      const orderData = await getOrderById(orderID);
      setOrder(orderData.data);
      if (response.statusCode === 200) {
        setOrderDetails(response.data);
      } else {
        console.error('Failed to fetch order detail:', response);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [orderID]);

  if (!orderDetails.length) return null;

  const user = order?.user;
  const isPending = order.status === 'PENDING';
  const isDelivered = order.status === 'DELIVERED';

  const buildTimeline = (order) => {
    const result = [];

    for (let i = 0; i < ORDER_STATUSES.length; i++) {
      const status = ORDER_STATUSES[i];
      const meta = ORDER_STATUS_DETAILS[status] || {};
      result.push({
        title: meta.title || status,
        description: meta.description || '',
        time: i === 0 ? order.orderDate : '',
      });

      if (status === order.status) {
        break;
      }
    }

    return result;
  };

  // Map lại items để giữ id
  const mappedOrderData = {
    orderNumber: order.code,
    date: order.orderDate,
    status: [{ label: order.status, color: getStatusColor(order.status) }],
    items: orderDetails.map((item, idx) => (
      {
      key: idx.toString(),
      orderDetailId: item.orderDetailId,
      productImage: item.productDetails?.image || 'https://dummyimage.com/100x100/cccccc/000000&text=No+Image',
      color: item.productDetails?.color || '',
      size: item.productDetails?.size || '',
      price: currencyFormat(item.price),
      qty: item.quantity,
      total: currencyFormat((item.price || 0) * (item.quantity || 0)),
    })),
    totals: {
      subtotal: currencyFormat(order.total),
      feeShip: currencyFormat(order.feeShip),
      discount: currencyFormat(order.voucherDiscount),
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

  const handleOrderAction = async (nextStatus, additionalData = {}) => {
    try {
      const statusUpdateData = {
        status: nextStatus,
        trackingNumber: additionalData.trackingNumber || null,
        cancelReason: additionalData.cancelReason || null,
        userId: additionalData.userID || null
      };
      const updatedOrder = await updateOrderStatus(orderID, statusUpdateData);
      if (updatedOrder) {
        const orderData = await getOrderById(orderID);
        setOrder(orderData.data);
        message.success('Order status updated successfully');
      }
    } catch (err) {
      message.error(err.message || 'Failed to update order status');
    }
  };

  // Xử lý mở modal edit item, set đúng object và giữ id
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditItemModalOpen(true);
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
              onEditItem={handleEditItem}
              editable={isPending && !isDelivered}
            />
          </Col>

          <Col xs={24} lg={8}>
            <CustomerInfo
              {...mappedOrderData.customer}
              onEdit={() => setCustomerModalOpen(true)}
              editable={isPending && !isDelivered}
            />
            <ShippingInfo
              {...mappedOrderData.shipping}
              onEdit={() => setEditShippingModalOpen(true)}
              editable={isPending && !isDelivered}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <OrderTimeline
              orderId={order.orderID}
              currentStatus={order.status}
              onAction={handleOrderAction}
              loading={loading}
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
        disabled={isDelivered}
      />

      <EditShippingModal
        open={editShippingModalOpen}
        onCancel={() => setEditShippingModalOpen(false)}
        onSubmit={(newShipping) => {
          console.log('Shipping updated:', newShipping);
          setEditShippingModalOpen(false);
        }}
        initialValues={mappedOrderData.shipping}
        disabled={isDelivered}
      />

      <EditOrderItemModal
        open={editItemModalOpen}
        onCancel={() => setEditItemModalOpen(false)}
        initialValues={editingItem}
        colorOptions={COLOR_OPTIONS.map(opt => opt.value)}
        sizeOptions={SIZE_OPTIONS.map(opt => opt.value)}
        disabled={isDelivered}
        orderDetailId={editingItem?.orderDetailId}
        reloadOrderDetail={fetchData}
      />
    </div>
  );
};

export default OrderDetail;
