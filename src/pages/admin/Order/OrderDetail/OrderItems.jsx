import React from 'react';
import { Row, Col, Card, Table, Typography, Space, Checkbox, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderItems = ({ items, subtotal, discount, tax, total }) => {
  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: () => <Checkbox />,
    },
    {
      title: 'PRODUCTS',
      dataIndex: 'productName',
      key: 'productName',
      render: (_, record) => (
        <Space size={12}>
          <img
            src={record.productImage}
            alt={record.productName}
            style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }}
          />
          <div>
            <Text strong style={{ fontSize: 15 }}>{record.productName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {record.productDesc}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <Text strong style={{ fontSize: 14 }}>{text}</Text>,
    },
    {
      title: 'QTY',
      dataIndex: 'qty',
      key: 'qty',
      render: (text) => <Text strong style={{ fontSize: 14 }}>{text}</Text>,
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
      render: (text) => <Text strong style={{ fontSize: 14, color: '#1890ff' }}>{text}</Text>,
    },
  ];

  return (
    <Card
      style={{
        background: '#ffffff',
        borderRadius: 8,
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Order Details</Title>
        </Col>
        <Col>
          <a href="#" style={{ color: '#1890ff', display: 'flex', alignItems: 'center' }}>
            <EditOutlined style={{ marginRight: 6 }} /> Edit
          </a>
        </Col>
      </Row>
      
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        bordered
        style={{ marginTop: 20 }}
        rowKey="key"
        size="middle"
      />
      
      <Divider style={{ margin: '20px 0 16px' }} />
      
      <Row justify="end">
        <Col span={12} md={8} lg={7}>
          <div style={{ textAlign: 'right' }}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Row justify="space-between">
                <Col>
                  <Text style={{ fontSize: 14 }}>Subtotal:</Text>
                </Col>
                <Col>
                  <Text strong style={{ fontSize: 14 }}>{subtotal}</Text>
                </Col>
              </Row>
              
              <Row justify="space-between">
                <Col>
                  <Text style={{ fontSize: 14 }}>Discount:</Text>
                </Col>
                <Col>
                  <Text strong style={{ fontSize: 14 }}>{discount}</Text>
                </Col>
              </Row>
              
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Row justify="space-between" align="middle">
                <Col>
                  <Text style={{ fontSize: 16 }}>Total:</Text>
                </Col>
                <Col>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{total}</Text>
                </Col>
              </Row>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderItems; 