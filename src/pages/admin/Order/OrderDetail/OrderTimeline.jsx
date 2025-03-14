import React from 'react';
import { Card, Typography, Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderTimeline = ({ items }) => {
  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        background: '#ffffff' 
      }}
      bodyStyle={{ padding: 20 }}
    >
      <Title level={4} style={{ margin: 0, fontSize: 18, marginBottom: 20 }}>Order Timeline</Title>
      
      <Timeline
        style={{ padding: '0 8px' }}
        items={items.map((item, index) => ({
          color: index === items.length - 1 ? 'gray' : 'blue',
          dot: index === items.length - 1 ? <ClockCircleOutlined style={{ fontSize: 16 }} /> : null,
          children: (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text strong style={{ fontSize: 15 }}>{item.title}</Text>
                {item.time && (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {item.time}
                  </Text>
                )}
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>{item.description}</Text>
              </div>
            </>
          )
        }))}
      />
    </Card>
  );
};

export default OrderTimeline; 