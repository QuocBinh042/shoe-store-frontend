import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Table,
  Tag,
  Space,
  Avatar,
  Divider,
} from 'antd';
import {
  DeleteOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import EditDetail from './EditDetail';

const { Title, Text } = Typography;

const ordersData = [
  {
    key: '1',
    order: '#9957',
    date: 'Nov 29, 2022',
    status: 'Out for delivery',
    statusColor: 'purple',
    spent: '$59.28',
  },
  {
    key: '2',
    order: '#9941',
    date: 'Jun 20, 2022',
    status: 'Ready to Pickup',
    statusColor: 'blue',
    spent: '$333.83',
  },
];

const ordersColumns = [
  {
    title: 'ORDER',
    dataIndex: 'order',
    key: 'order',
    render: (text) => <Space>{text}</Space>,
  },
  {
    title: 'DATE',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <Tag color={record.statusColor} style={{ fontWeight: 'bold' }}>
        {text}
      </Tag>
    ),
  },
  {
    title: 'SPENT',
    dataIndex: 'spent',
    key: 'spent',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    render: () => <MoreOutlined style={{ color: 'gray' }} />,
  },
];

const CustomerDetail = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  // Giả sử data khách hàng lấy từ API
  const customerData = {
    id: customerId,
    avatar: 'https://storage.googleapis.com/a1aa/image/bqTO24ZdkOzyMSW6l3Mnil_lpSbu1hnUBlTDUMU2RAU.jpg',
    name: 'Lorine Hischke',
    email: 'vafgot@vultukir.org',
    username: 'lorine.hischke',
    phone: '(123) 456-7890',
    country: 'USA',
    ordersCount: 184,
    totalSpent: 12378,
    status: 'Active',
  };

  const handleBack = () => {
    navigate('/admin/customers');
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = (updatedCustomer) => {
    console.log('Updated customer details:', updatedCustomer);
    // Thực hiện call API hoặc cập nhật state
    setShowModal(false);
  };

  return (
    <div
      style={{
        padding: 8,
        height: 'calc(100vh - 24px)',
        overflow: 'hidden',
        background: '#f7f7f7',
      }}
    >
      <Card style={{ borderRadius: 8 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Customer ID: {customerId}
            </Title>
          </Col>
          <Col>
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete Customer
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {/* Left Column: Customer Details */}
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar src={customerData.avatar} size={80} />
              </div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {customerData.name}
                </Title>
                <Text type="secondary">Customer ID #{customerData.id}</Text>
              </div>

              <Row justify="space-around" style={{ marginBottom: 16 }}>
                <Col style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      padding: 12,
                      background: '#E6F4FF',
                      borderRadius: 10,
                      marginRight: 5,
                    }}
                  >
                    <ShoppingCartOutlined style={{ fontSize: 24, color: '#4096FF' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {customerData.ordersCount}
                    </Title>
                    <Text type="secondary">Orders</Text>
                  </div>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      padding: 12,
                      background: '#E6F4FF',
                      borderRadius: 10,
                      marginRight: 5,
                    }}
                  >
                    <DollarCircleOutlined style={{ fontSize: 24, color: '#4096FF' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {customerData.totalSpent}
                    </Title>
                    <Text type="secondary">Spent</Text>
                  </div>
                </Col>
              </Row>

              <div style={{ padding: '0 16px' }}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Details
                </Title>
                <Divider />
                <p>
                  <strong>Username:</strong> {customerData.username}
                </p>
                <p>
                  <strong>Email:</strong> {customerData.email}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <Text style={{ color: '#52c41a' }}>{customerData.status}</Text>
                </p>
                <p>
                  <strong>Contact:</strong> {customerData.phone}
                </p>
              </div>

              <Button type="primary" block style={{ marginTop: 16 }} onClick={handleEditClick}>
                Edit Details
              </Button>
            </Card>
          </Col>

          {/* Right Column: Orders */}
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4}>Orders placed</Title>
                </Col>
                <Col>
                  <Input.Search placeholder="Search order" style={{ width: 200 }} />
                </Col>
              </Row>
              <Table
                columns={ordersColumns}
                dataSource={ordersData}
                pagination={{ pageSize: 6 }}
                rowSelection={{}}
                bordered
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Edit Detail Modal */}
      <EditDetail
        open={showModal}
        onCancel={handleClose}
        customer={customerData}
        handleSave={handleSave}
      />
    </div>
  );
};

export default CustomerDetail;
