import { useState } from 'react';
import { Table, Row, Col, Input, Select, Button, Typography, Avatar } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Text } = Typography;

const Customer = () => {
  const location = useLocation();
  const isDetailView = location.pathname.includes('/admin/customers/');
  
  // Sample customer data
  const [data] = useState([
    {
      key: '1',
      customerName: 'Zeke Arton',
      email: 'zarton8@weibo.com',
      customerId: '#895280',
      country: { name: 'Ukraine', flag: 'https://storage.googleapis.com/a1aa/image/36kJw37y-aM9_gk7lRUF5ksamZ0uw4QkyH2DnnX5Gjk.jpg' },
      order: 539,
      phoneNumber:'0123456789',
      totalSpent: '$3430.05',
      avatar: 'https://storage.googleapis.com/a1aa/image/rT3Be6NgRLsRKygLTUGRKZImEOE1-od3kLEuodeicMU.jpg',
    },
    {
      key: '2',
      customerName: 'Zed Rawe',
      email: 'zrawe1t@va.gov',
      customerId: '#343593',
      country: { name: 'Libya', flag: 'https://storage.googleapis.com/a1aa/image/3Nh1VpvYkM-W6JDtguNX3lEXgU_YJKcWovTV1PiNBKA.jpg' },
      order: 473,
      totalSpent: '$5218.22',
      avatar: 'https://storage.googleapis.com/a1aa/image/CbElLF93Nna8_ptMYwmv_-Ln2aWfkuKNksnfZRBYOiQ.jpg',
    },
    {
      key: '3',
      customerName: 'Yank Luddy',
      email: 'yluddy22@fema.gov',
      customerId: '#586615',
      country: { name: 'Portugal', flag: 'https://storage.googleapis.com/a1aa/image/TXUzI667zeYUppAITy6XTPi8VvSFAj23KzWsfW6LgTw.jpg' },
      order: 462,
      totalSpent: '$9157.04',
      phoneNumber:'0123456789',
      initials: 'YL',
    },
    {
      key: '4',
      customerName: 'Valenka Turbill',
      email: 'vturbill2h@nbcnews.com',
      customerId: '#179914',
      country: { name: 'Turkmenistan', flag: 'https://storage.googleapis.com/a1aa/image/63hdqDre6s2-yRtcLbggBHNPn_qHt2ZDAswq7DyX8Zw.jpg' },
      order: 550,
      totalSpent: '$9083.15',
      status:'ACTIVE',
      initials: 'VT',
    },
    {
      key: '5',
      customerName: 'Thomasine Vasentsov',
      email: 'tvasentsov1u@bloglovin.com',
      customerId: '#988015',
      country: { name: 'Argentina', flag: 'https://storage.googleapis.com/a1aa/image/f8qT1FJhrwXRoGvhRTuvdW9BLcBhr6dEQsfDroGNqSo.jpg' },
      order: 752,
      totalSpent: '$5984.53',
      initials: 'TV',
    },
  ]);

  // Table column definitions
  const columns = [
    {
      title: 'CUSTOMER',
      dataIndex: 'customerName',
      key: 'customer',
      render: (__, record) => (
        <Link
          to={`/admin/customers/${record.customerId.replace('#', '')}`}
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          {record.avatar ? (
            <Avatar
              src={record.avatar}
              size={32}
              style={{ marginRight: 8 }}
            />
          ) : (
            <div
              style={{
                backgroundColor: '#ccc',
                color: '#fff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              {record.initials}
            </div>
          )}
          <div>{record.customerName}</div>
        </Link>
      ),
    },
    
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align:'center'
    },
    {
      title: 'ORDER',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'TOTAL SPENT',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
    },
  ];

  if (isDetailView) {
    return <Outlet />;
  }

  return (
    <div style={{ background: '#f7f7f7', padding: 8}}>
      <div
        style={{
          margin: 0,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: 24,
          height: 'calc(100vh - 32px)',
        }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col flex="1">
            <Input.Search placeholder="Search Order" allowClear style={{ width: '100%' }} />
          </Col>
          <Col>
            <Select defaultValue="10" style={{ width: 80 }}>
              <Select.Option value="10">10</Select.Option>
              <Select.Option value="20">20</Select.Option>
              <Select.Option value="30">30</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button style={{ border: '1px solid #d9d9d9' }} icon={<DownloadOutlined />}>
              Export
            </Button>
          </Col>
          <Col>
            <Button type="primary">+ Add Customer</Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            total: data.length,
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />

        <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
          <Col>
            <Text type="secondary">Showing 1 to 10 of 100 entries</Text>
          </Col>
          <Col>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Customer;
