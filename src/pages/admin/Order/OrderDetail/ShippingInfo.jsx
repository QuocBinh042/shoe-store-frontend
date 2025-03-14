import React from 'react';
import { Card, Row, Col, Typography, Divider, Space, Tag } from 'antd';
import { EditOutlined, EnvironmentOutlined, CarOutlined, NumberOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ShippingInfo = ({ address, method, trackingNumber }) => {
  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        background: '#ffffff'
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Shipping Details</Title>
        </Col>
        <Col>
          <a href="#" style={{ color: '#1890ff', display: 'flex', alignItems: 'center' }}>
            <EditOutlined style={{ marginRight: 6 }} /> Edit
          </a>
        </Col>
      </Row>
      
      <Divider style={{ margin: '16px 0 12px' }} />
      
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <EnvironmentOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
            <Text style={{ fontSize: 14, color: '#8c8c8c' }}>Shipping Address</Text>
          </div>
          <div style={{ paddingLeft: 24 }}>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{address.line1}</Text>
            {address.line2 && <Text strong style={{ fontSize: 14, display: 'block' }}>{address.line2}</Text>}
            <Text strong style={{ fontSize: 14, display: 'block' }}>
              {address.city}, {address.state} {address.zip}
            </Text>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{address.country}</Text>
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <CarOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
            <Text style={{ fontSize: 14, color: '#8c8c8c' }}>Shipping Method</Text>
          </div>
          <div style={{ paddingLeft: 24 }}>
            <Tag color="blue" style={{ fontSize: 13, padding: '2px 12px' }}>{method}</Tag>
          </div>
        </div>
        
        {trackingNumber && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <NumberOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
              <Text style={{ fontSize: 14, color: '#8c8c8c' }}>Tracking Number</Text>
            </div>
            <div style={{ paddingLeft: 24 }}>
              <Text strong copyable style={{ fontSize: 14 }}>{trackingNumber}</Text>
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ShippingInfo; 