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
import { getOrderDetailByOrder, updateOrderDetail } from '../../../../services/orderDetailService';
// Import API mới:
import { getOrderById, updateOrderUser, updateOrderShipping } from '../../../../services/orderService';
import EditCustomerModal from '../Modals/EditCustomerModal';
import EditShippingModal from '../Modals/EditShippingModal';
import EditOrderItemModal from '../Modals/EditOrderItemModal';
import useOrderStatus from '../../../../hooks/useOrderStatus';
import { updateCustomerGroup } from '../../../../services/userService';
import { sendOrderStatusEmail } from '../../../../services/emailService';

const OrderDetail = () => {
  const { id: orderID } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [editShippingModalOpen, setEditShippingModalOpen] = useState(false);
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [order, setOrder] = useState(null);
  const { updateOrderStatus, loading } = useOrderStatus();

  // Load order + order detail
  const fetchData = async () => {
    try {
      const response = await getOrderDetailByOrder(orderID);
      const orderData = await getOrderById(orderID);
      console.log('Order data from API:', orderData.data);
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

  if (!orderDetails.length || !order) return null;

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

  // Calculate subtotal based on current order details
  const calculatedSubtotal = orderDetails.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 0);
  }, 0);

  // Map lại items để giữ id
  const mappedOrderData = {
    orderNumber: order.code,
    date: order.orderDate,
    status: [{ label: order.status, color: getStatusColor(order.status) }],
    items: orderDetails.map((item, idx) => ({
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
      subtotal: currencyFormat(calculatedSubtotal),
      feeShip: currencyFormat(order.feeShip),
      discount: currencyFormat(order.voucherDiscount),
      total: currencyFormat(calculatedSubtotal + (order.feeShip || 0) - (order.voucherDiscount || 0)),
    },
    customer: {
      customerAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Unknown')}&size=150`,
      customerName: user?.name || '',
      customerId: user?.userID || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
    },
    shipping: {
      shippingAddress: order.shippingAddress,
      shippingMethod: order.shippingMethod,
      trackingNumber: order.trackingNumber,
    },
    timeline: buildTimeline(order),
  };


  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handleOrderAction = async (nextStatus, additionalData = {}) => {
    try {
      // Chỉ gửi mail trước khi confirm hoặc cancel
      if (['CONFIRMED', 'CANCELED'].includes(nextStatus)) {
        // Gửi mail trước, nếu lỗi sẽ nhảy catch dừng luôn
        await sendOrderStatusEmail(orderID, nextStatus);
        message.success('Notification email sent successfully');
      }
  
      // Cập nhật trạng thái đơn hàng
      const updatedOrder = await updateOrderStatus(orderID, {
        status: nextStatus,
        trackingNumber: additionalData.trackingNumber || null,
        cancelReason: additionalData.cancelReason || null,
        userId: additionalData.userID || null,
      });
  
      if (updatedOrder) {
        const orderData = await getOrderById(orderID);
        setOrder(orderData.data);
  
        message.success('Order status updated successfully');
  
        // Nếu đơn đã giao hàng thì update customer group
        if (nextStatus === 'DELIVERED' && orderData.data?.user?.userID) {
          try {
            await updateCustomerGroup(orderData.data.user.userID);
            message.success('Customer group updated successfully');
          } catch (err) {
            message.error('Failed to update customer group');
          }
        }
      }
    } catch (err) {
      // Lỗi gửi mail hoặc lỗi update đơn đều sẽ nhảy vào đây
      message.error(err.message || 'Failed to complete operation');
    }
  };
  



  // Xử lý mở modal edit item, set đúng object và giữ id
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditItemModalOpen(true);
  };

  // Cập nhật customer info - gọi API updateOrderUser
  const handleUpdateCustomer = async (updated) => {
    try {
      const userDTO = {
        userID: order.user.userID,
        name: updated.customerName,
        email: updated.email,
        phoneNumber: updated.phone,
      };
      await updateOrderUser(orderID, userDTO);
      message.success('Customer info updated successfully');
      setCustomerModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update customer info');
    }
  };

  // Cập nhật shipping info - gọi API updateOrderShipping
  const handleUpdateShipping = async (newShipping) => {
    try {
      const shippingDTO = {
        shippingAddress: newShipping.shippingAddress,
        shippingMethod: newShipping.shippingMethod,
        trackingNumber: newShipping.trackingNumber,
      };
      await updateOrderShipping(orderID, shippingDTO);
      message.success('Shipping info updated successfully');
      setEditShippingModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update shipping info');
    }
  };

  // Xử lý update item (giữ nguyên như trước)
  const handleUpdateOrderItem = async (updatedItem) => {
    try {
      await updateOrderDetail(editingItem.orderDetailId, {
        color: updatedItem.color,
        size: updatedItem.size,
        quantity: updatedItem.qty,
      });
      message.success('Order item updated successfully');
      setEditItemModalOpen(false);
      await fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update order item');
    }
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
              editable={isPending && order.status !== 'DELIVERED' && order.status !== 'SHIPPED'}
            />
          </Col>

          <Col xs={24} lg={8}>
            <CustomerInfo
              {...mappedOrderData.customer}
              order={order}
              orderID={orderID}
              onOrderUpdated={fetchData}
              disabled={order.status === 'DELIVERED' || order.status === 'SHIPPED'}
              onEdit={() => setCustomerModalOpen(true)}
              editable={isPending && order.status !== 'DELIVERED' && order.status !== 'SHIPPED'}
            />
            <ShippingInfo
              {...mappedOrderData.shipping}
              onEdit={() => setEditShippingModalOpen(true)}
              editable={isPending && order.status !== 'DELIVERED' && order.status !== 'SHIPPED'}
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
        onSubmit={handleUpdateCustomer}
        initialValues={{
          customerName: mappedOrderData.customer.customerName,
        }}
        disabled={order.status === 'DELIVERED' || order.status === 'SHIPPED'}
      />

      <EditShippingModal
        open={editShippingModalOpen}
        onCancel={() => setEditShippingModalOpen(false)}
        onSubmit={handleUpdateShipping}
        initialValues={{
          shippingAddress: mappedOrderData.shipping.shippingAddress,
          shippingMethod: mappedOrderData.shipping.shippingMethod,
          trackingNumber: mappedOrderData.shipping.trackingNumber
        }}
        disabled={order.status === 'DELIVERED' || order.status === 'SHIPPED'}
      />

      <EditOrderItemModal
        open={editItemModalOpen}
        onCancel={() => setEditItemModalOpen(false)}
        onSubmit={handleUpdateOrderItem}
        initialValues={editingItem}
        colorOptions={COLOR_OPTIONS.map(opt => opt.value)}
        sizeOptions={SIZE_OPTIONS.map(opt => opt.value)}
        disabled={order.status === 'DELIVERED' || order.status === 'SHIPPED'}
        orderDetailId={editingItem?.orderDetailId}
        reloadOrderDetail={fetchData}
      />
    </div>
  );
};

export default OrderDetail;
