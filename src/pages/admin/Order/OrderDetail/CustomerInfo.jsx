
import React, { useState } from 'react';
import { Card, Row, Col, Typography, Divider, Space, Button } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import EditCustomerModal from '../Modals/EditCustomerModal';

const { Title, Text } = Typography;

const CustomerInfo = ({ customerAvatar, customerName, customerId, email, phone }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditSubmit = (updatedValues) => {
    console.log('Updated customer info:', updatedValues);
    setIsModalOpen(false);
    // TODO: call API to update if needed
  };

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
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Customer Details</Title>
        </Col>
        <Col>
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ color: '#1677ff', fontWeight: 500 }}
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </Button>
        </Col>
      </Row>

      <Row align="middle" gutter={16} style={{ marginTop: 16 }}>
        <Col>
          <img
            src={customerAvatar}
            alt={customerName}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #f0f0f0'
            }}
          />
        </Col>
        <Col>
          <Text strong style={{ fontSize: 16, display: 'block' }}>{customerName}</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Customer ID: #{customerId}
          </Text>
        </Col>
      </Row>

      <Divider style={{ margin: '16px 0 12px' }} />

      <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
        Contact Information
      </Text>

      <Space direction="vertical" size={8}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MailOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
          <Text strong style={{ fontSize: 14 }}>{email}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PhoneOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
          <Text strong style={{ fontSize: 14 }}>{phone}</Text>
        </div>
      </Space>

      <EditCustomerModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialValues={{ customerName, email, phone }}
      />
    </Card>
  );
};

export default CustomerInfo;