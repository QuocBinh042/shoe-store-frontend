import React from 'react';
import { Row, Col, Table, Typography, Space, Divider, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import CloudinaryImage from '../../../../utils/cloudinaryImage';

const { Title, Text } = Typography;

const OrderItems = ({ items, subtotal, discount, feeShip, total, onEditItem }) => {
  const columns = [
    {
      title: 'PRODUCT',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (_, record) => (
        console.log(record.productImage),
        <CloudinaryImage
          publicId={`project_ShoeStore/ImageProduct/${record.productImage}`}
          alt="product"
          options={{ width: 100, height: 60, crop: 'fill' }}
          style={{
            borderRadius: 8,
            objectFit: 'cover',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
      ),
    },
    {
      title: 'COLOR',
      dataIndex: 'color',
      key: 'color',
      align: 'center',
      render: (color) => (
        <Space size={6} align="center">
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: color,
              border: '1px solid #ccc',
            }}
          />
          <Text>{color}</Text>
        </Space>
      ),
    },
    {
      title: 'SIZE',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
      render: (size) => <Text>{size.replace('SIZE_', '')}</Text>,
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'QTY',
      dataIndex: 'qty',
      key: 'qty',
      align: 'center',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (text) => (
        <Text strong style={{ color: '#1677ff' }}>{text}</Text>
      ),
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEditItem(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

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
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            🧾 Order Items
          </Title>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="key"
        size="middle"
        bordered
        scroll={{ x: '100%' }}
        style={{ marginBottom: 24 }}
      />

      <Divider style={{ margin: '24px 0 16px' }} />

      <Row justify="end">
        <Col xs={24} sm={14} md={10} lg={8}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Row justify="space-between">
              <Text>Subtotal:</Text>
              <Text strong>{subtotal}</Text>
            </Row>
            <Row justify="space-between">
              <Text>FeeShip:</Text>
              <Text strong>{feeShip}</Text>
            </Row>
            <Row justify="space-between">
              <Text>Discount:</Text>
              <Text strong>{discount}</Text>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Row justify="space-between">
              <Text style={{ fontSize: 15 }}>Total:</Text>
              <Text strong style={{ fontSize: 18, color: '#1677ff' }}>{total}</Text>
            </Row>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default OrderItems;