import React from 'react';
import { Row, Col, Button, Tag, Typography, Space } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderHeader = ({ orderNumber, date, status, onBack, onDelete }) => {
  return (
    <Row justify="space-between" align="middle" gutter={[16, 16]}>
      <Col>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
      </Col>
      <Col>
        <Title level={2} style={{ marginBottom: 8 }}>Order #{orderNumber}</Title>
        <Space size="middle" style={{ marginBottom: 8 }}>
          {status.map((item, index) => (
            <Tag key={index} color={item.color} style={{ padding: '4px 8px' }}>{item.label}</Tag>
          ))}
        </Space>
        <br />
        <Text type="secondary">{date}</Text>
      </Col>
      <Col>
        <Button type="primary" danger icon={<DeleteOutlined />} onClick={onDelete}>
          Delete Order
        </Button>
      </Col>
    </Row>
  );
};

export default OrderHeader; 