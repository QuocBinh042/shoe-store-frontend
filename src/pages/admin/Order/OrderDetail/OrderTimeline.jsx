import React, { useState, useEffect } from 'react';
import { Typography, Timeline, Button, Tag } from 'antd';
import { ClockCircleOutlined, IdcardOutlined, UserOutlined } from '@ant-design/icons';
import { getOrderStatusHistory } from '../../../../services/orderService';
import CancelOrderModal from './CancelOrderModal';
import dayjs from 'dayjs';
import { getStatusColor, ORDER_STATUS_DETAILS } from '../../../../constants/orderConstant';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const OrderTimeline = ({ orderId, currentStatus, onAction }) => {
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { user } = useSelector((state) => state.account);

  const actionButtons = {
    PENDING: { label: 'Confirm Order', next: 'CONFIRMED' },
    CONFIRMED: { label: 'Start Processing', next: 'PROCESSING' },
    PROCESSING: { label: 'Ship Order', next: 'SHIPPED' },
    SHIPPED: { label: 'Mark as Delivered', next: 'DELIVERED' },
  };

  const cancelableStatuses = ['PENDING', 'CONFIRMED'];
  const action = actionButtons[currentStatus];

  useEffect(() => {
    fetchStatusHistory();
  }, [orderId, currentStatus]);

  const fetchStatusHistory = async () => {
    try {
      const response = await getOrderStatusHistory(orderId);
      const sortedHistory = (response.data || []).sort(
        (a, b) => {
          const aIsCanceled = a.status === 'CANCELED';
          const bIsCanceled = b.status === 'CANCELED';

          if (aIsCanceled && !bIsCanceled) {
            return 1;
          }
          if (!aIsCanceled && bIsCanceled) {
            return -1;
          }

          return new Date(b.changedAt) - new Date(a.changedAt);
        }
      );
      setStatusHistory(sortedHistory);
      
    } catch (error) {
      console.error('Failed to fetch status history:', error);
    }
  };
  
  
  

  const handleAction = (nextStatus) => {
    if (nextStatus === 'CANCELED') {
      setShowCancelModal(true);
    } else {
      onAction(nextStatus, { userID: user?.userID });
    }
  };

  const handleCancelConfirm = async (reason) => {
    setLoading(true);
    try {
      await onAction('CANCELED', { 
        cancelReason: reason,
        userID: user?.userID 
      });
      setShowCancelModal(false);
    } finally {
      setLoading(false);
    }
  };

  const getTimelineItems = () => {
    return statusHistory.map((item, index) => ({
      color: getStatusColor(item.status),
      dot: index === statusHistory.length - 1
        ? <ClockCircleOutlined style={{ fontSize: 16 }} />
        : undefined,
      children: (
        <div style={{ paddingBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 4,
              gap: 8,
            }}
          >
            <div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>
                <Tag color={getStatusColor(item.status)} style={{ marginBottom: 4 }}>
                  {item.status}
                </Tag>
                </div>
                
                {typeof ORDER_STATUS_DETAILS[item.status].description === 'function' 
                  ? ORDER_STATUS_DETAILS[item.status].description(item.changedByName)
                  : ORDER_STATUS_DETAILS[item.status].description}
              </div>

            </div>
            {item.changedAt && (
              <Text type="secondary" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                {dayjs(item.changedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            )}
          </div>
          {item.cancelReason && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Reason: {item.cancelReason}
              </Text>
            </div>
          )}
          {item.trackingNumber && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Tracking: {item.trackingNumber}
              </Text>
            </div>
          )}
        </div>
      )
    }));
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        marginBottom: 24,
      }}
    >
      <Title level={4} style={{ marginBottom: 24 }}>
        📦 Order Timeline
      </Title>

      <Timeline
        mode="left"
        items={getTimelineItems()}
      />

      {(action || (cancelableStatuses.includes(currentStatus) && currentStatus !== 'CANCELED')) && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {action && (
            <Button type="primary" onClick={() => handleAction(action.next)}>
              {action.label}
            </Button>
          )}
          {cancelableStatuses.includes(currentStatus) && currentStatus !== 'CANCELED' && (
            <Button danger style={{ marginLeft: 16 }} onClick={() => handleAction('CANCELED')}>
              Cancel Order
            </Button>
          )}
        </div>
      )}

      <CancelOrderModal
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        loading={loading}
      />
    </div>
  );
};

export default OrderTimeline;
