import React from 'react';
import { Row, Col, Typography, Divider, Space, Tag, Button } from 'antd';
import { EditOutlined, EnvironmentOutlined, CarOutlined, NumberOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ShippingInfo = ({ shippingAddress, shippingMethod, trackingNumber, onEdit, editable }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        marginBottom: 24
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>🚚 Shipping Info</Title>
        </Col>
        <Col>
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ color: '#1677ff', fontWeight: 500 }}
            onClick={onEdit}
            disabled={!editable}
          >
            Edit
          </Button>
        </Col>
      </Row>

      <Divider style={{ margin: '16px 0 20px' }} />

      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div>
          <Row align="middle" style={{ marginBottom: 6 }}>
            <EnvironmentOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
            <Text type="secondary">Shipping Address</Text>
          </Row>
          <div style={{ paddingLeft: 24 }}>
            <Text strong style={{ fontSize: 14 }}>{shippingAddress || '-'}</Text>
          </div>
        </div>

        <div>
          <Row align="middle" style={{ marginBottom: 6 }}>
            <CarOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
            <Text type="secondary">Shipping Method</Text>
          </Row>
          <div style={{ paddingLeft: 24 }}>
            {shippingMethod ? (
              <Tag color="blue" style={{ fontSize: 13, padding: '2px 12px', borderRadius: 16 }}>
                {shippingMethod}                
              </Tag>
            ) : (
              <Text type="secondary">-</Text>
            )}
          </div>
        </div>

        <div>
          <Row align="middle" style={{ marginBottom: 6 }}>
            <NumberOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
            <Text type="secondary">Tracking Number</Text>
          </Row>
          <div style={{ paddingLeft: 24 }}>
            {trackingNumber ? (
              <Text strong copyable style={{ fontSize: 14 }}>{trackingNumber}</Text>
            ) : (
              <Text type="secondary">-</Text>
            )}
          </div>
        </div>
      </Space>
    </div>
  );
};

export default ShippingInfo;
