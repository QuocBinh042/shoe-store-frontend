import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Tabs,
  Input,
  Table,
  Tag,
  Space,
  Typography,
  Select,
  DatePicker,
  Statistic
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  BarsOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import './Order.scss';
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const OrderDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailView = location.pathname.includes('/admin/orders/');
  const [orders] = useState([
    {
      key: '1',
      orderImage:
        'https://storage.googleapis.com/a1aa/image/1pcuS5eH5RqoVrjS-9E8OoHorkbLvam_C79h0XBUTZo.jpg',
      orderName: 'Shoe1',
      orderId: '#573829',
      customerAvatar:
        'https://storage.googleapis.com/a1aa/image/tdcUgxMEAUB9k6oOVRSFlIB_4HiTLeA2VpbrbVgY23k.jpg',
      customerName: 'Darrell Steward',
      date: 'Apr 19, 08:01 AM',
      total: '$1,099.00',
      paymentStatus: 'Pending',
      paymentStatusColor: 'gold',
      items: '1 item',
      deliveryMethod: 'Free Shipping',
    },
    {
      key: '2',
      orderImage:
        'https://storage.googleapis.com/a1aa/image/K60jBYH69TnK4Q7ru6rFJUQi9kfTDRq5cp8H7gnDHSE.jpg',
      orderName: 'Shoe2',
      orderId: '#920947',
      customerAvatar:
        'https://storage.googleapis.com/a1aa/image/ANsMz3dcfcPAUSxYBh9nYsNylNDY90hrk2RKSCF7SUs.jpg',
      customerName: 'Courtney Henry',
      date: 'Apr 19, 09:15 AM',
      total: '$2,198.00',
      paymentStatus: 'Completed',
      paymentStatusColor: 'green',
      items: '2 items',
      deliveryMethod: 'Free Shipping',
    },
  ]);
  const stats = [
    {
      title: 'Total Orders',
      value: 2,
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#f6ffed',
      borderColor: '#b7eb8f',
    },
    {
      title: 'Ordered Items',
      value: 2,
      icon: <BarsOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    {
      title: 'Completed Orders',
      value: 985,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
      borderColor: '#d3adf7',
    },
    {
      title: 'Failed Orders',
      value: '$23,503.00',
      icon: <CloseCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fff7e6',
      borderColor: '#ffd591',
    },
  ];
  const columns = [
    {
      title: 'Order',
      dataIndex: 'orderName',
      key: 'order',
      render: (text, record) => (
        <Space align="center">
          <img
            src={record.orderImage}
            alt={record.orderName}
            style={{ width: 48, height: 48, borderRadius: '50%' }}
          />
          <div>
            <Text strong>{record.orderName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.orderId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customer',
      render: (text, record) => (
        <Space align="center">
          <img
            src={record.customerAvatar}
            alt={record.customerName}
            style={{ width: 48, height: 48, borderRadius: '50%' }}
          />
          <Text>{record.customerName}</Text>
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text, record) => (
        <Tag color={record.paymentStatusColor} style={{ fontWeight: 'bold', padding: '4px 8px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Delivery Method',
      dataIndex: 'deliveryMethod',
      key: 'deliveryMethod',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate(`/admin/orders/${record.orderId.replace('#', '')}`)}
        >
          <MoreOutlined style={{ color: 'gray' }} />
        </button>
      ),
    },
  ];
  const items = [
    {
      key: 'all',
      label: 'All'
    },
    {
      key: 'completed',
      label: 'Completed'
    },
    {
      key: 'unpaid',
      label: 'Unpaid'
    },
    {
      key: 'need-to-ship',
      label: 'Need to ship'
    },
    {
      key: 'cancellation',
      label: 'Cancellation'
    },
    {
      key: 'returns',
      label: 'Returns'
    }
  ];
  if (isDetailView) {
    return <Outlet />;
  }
  return (
    <div className="order-dashboard" >
      <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: '16px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              className="stat-card"
              bordered={false}
              style={{
                backgroundColor: stat.color,
                borderLeft: `4px solid ${stat.borderColor}`,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
              }}
            >
              <Statistic
                title={<Text strong>{stat.title}</Text>}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Card className="order-dashboard__content-card">
        <div className="order-dashboard__tabs" >
          <Tabs defaultActiveKey="all" items={items} />
        </div>

        <div style={{ padding: '0 0px' }}>
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Search
              </Text>
              <Input.Search placeholder="Search" allowClear />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Sort
              </Text>
              <Select placeholder="New Product" style={{ width: '100%' }}>
                <Select.Option value="new">New Product</Select.Option>
                <Select.Option value="popular">Popular Product</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Date Range
              </Text>
              <RangePicker style={{ width: '100%' }} />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Status
              </Text>
              <Select defaultValue="all" style={{ width: '100%' }}>
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="processing">Processing</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
              </Select>
            </Col>
          </Row>

          <Table 
            columns={columns} 
            dataSource={orders} 
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderDashboard;  