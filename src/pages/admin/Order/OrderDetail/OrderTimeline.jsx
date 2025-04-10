import React from 'react';
import { Typography, Timeline, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderTimeline = ({ items, currentStatus, onAction }) => {
  const actionButtons = {
    PENDING: { label: 'Confirm Order', next: 'CONFIRMED' },
    CONFIRMED: { label: 'Start Processing', next: 'PROCESSING' },
    PROCESSING: { label: 'Ship Order', next: 'SHIPPED' },
    SHIPPED: { label: 'Mark as Delivered', next: 'DELIVERED' },
  };

  const cancelableStatuses = ['PENDING', 'CONFIRMED'];

  const action = actionButtons[currentStatus];

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
        items={items.map((item, index) => ({
          color: index === items.length - 1 ? 'gray' : 'blue',
          dot: index === items.length - 1
            ? <ClockCircleOutlined style={{ fontSize: 16 }} />
            : undefined,
          children: (
            <div style={{ paddingBottom: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 4,
                  gap: 8,
                }}
              >
                <Text strong style={{ fontSize: 15 }}>{item.title}</Text>
                {item.time && (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {item.time}
                  </Text>
                )}
              </div>
              <Text type="secondary" style={{ fontSize: 14 }}>{item.description}</Text>
            </div>
          )
        }))}
      />

      {(action || cancelableStatuses.includes(currentStatus)) && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {action && (
            <Button type="primary" onClick={() => onAction(action.next)}>
              {action.label}
            </Button>
          )}
          {cancelableStatuses.includes(currentStatus) && (
            <Button danger style={{ marginLeft: 16 }} onClick={() => onAction('CANCELLED')}>
              Cancel Order
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
