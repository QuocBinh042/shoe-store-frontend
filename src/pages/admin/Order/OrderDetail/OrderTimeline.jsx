import React, { useState, useEffect } from 'react';
import { Typography, Timeline, Button, Tag } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getOrderStatusHistory } from '../../../../services/orderService';
import CancelOrderModal from './CancelOrderModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const getStatusColor = (status) => {
  const colors = {
    PENDING: 'gold',
    CONFIRMED: 'blue',
    PROCESSING: 'cyan',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELED: 'red',
  };
  return colors[status] || 'default';
};

const OrderTimeline = ({ orderId, currentStatus, onAction }) => {
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
      setStatusHistory(response.data || []);
    } catch (error) {
      console.error('Failed to fetch status history:', error);
    }
  };

  const handleAction = (nextStatus) => {
    if (nextStatus === 'CANCELED') {
      setShowCancelModal(true);
    } else {
      onAction(nextStatus);
    }
  };

  const handleCancelConfirm = async (reason) => {
    setLoading(true);
    try {
      await onAction('CANCELED', { cancelReason: reason });
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
              <Tag color={getStatusColor(item.status)} style={{ marginBottom: 4 }}>
                {item.status}
              </Tag>
              {item.changedBy && (
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    Changed by: {item.changedBy}
                  </Text>
                </div>
              )}
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
