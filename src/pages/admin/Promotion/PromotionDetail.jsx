import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Typography, 
  Tag, 
  Descriptions, 
  Statistic, 
  Space, 
  Table,
  Divider,
  List,
  Avatar,
  Progress
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  CalendarOutlined,
  TagOutlined,
  GiftOutlined,
  PercentageOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Line } from '@ant-design/plots';
import './Promotion.scss';

const { Title, Text } = Typography;

const PromotionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for the promotion
  const promotion = {
    id,
    name: 'Summer Sale 2023',
    description: 'Get 10% off on all summer products!',
    type: 'percentage',
    discountValue: 10,
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    status: 'active',
    minOrderValue: 0,
    code: 'SUMMER10',
    applicableTo: 'All Products',
    customerGroup: 'All Customers',
    usageCount: 328,
    usageLimit: null,
    revenue: '$5,243.00',
    createdAt: '2023-05-15',
    createdBy: 'Admin User',
  };

  // Mock data for usage stats by date
  const usageData = [
    { date: '2023-06-01', orders: 5, revenue: 250 },
    { date: '2023-06-02', orders: 7, revenue: 320 },
    { date: '2023-06-03', orders: 10, revenue: 480 },
    { date: '2023-06-04', orders: 12, revenue: 520 },
    { date: '2023-06-05', orders: 8, revenue: 350 },
    { date: '2023-06-06', orders: 15, revenue: 620 },
    { date: '2023-06-07', orders: 18, revenue: 730 },
    { date: '2023-06-08', orders: 20, revenue: 810 },
    { date: '2023-06-09', orders: 22, revenue: 920 },
    { date: '2023-06-10', orders: 25, revenue: 1000 },
    { date: '2023-06-11', orders: 18, revenue: 780 },
    { date: '2023-06-12', orders: 15, revenue: 650 },
    { date: '2023-06-13', orders: 20, revenue: 850 },
    { date: '2023-06-14', orders: 23, revenue: 980 },
  ];

  // Mock data for recent orders
  const recentOrders = [
    {
      id: 'ORD123456',
      customer: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      date: '2023-06-14 15:32',
      amount: '$125.00',
      discount: '$12.50',
    },
    {
      id: 'ORD123455',
      customer: 'Sarah Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      date: '2023-06-14 14:21',
      amount: '$89.00',
      discount: '$8.90',
    },
    {
      id: 'ORD123454',
      customer: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      date: '2023-06-14 13:10',
      amount: '$210.00',
      discount: '$21.00',
    },
    {
      id: 'ORD123453',
      customer: 'Emma Williams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      date: '2023-06-14 12:45',
      amount: '$65.00',
      discount: '$6.50',
    },
    {
      id: 'ORD123452',
      customer: 'Chris Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
      date: '2023-06-14 11:30',
      amount: '$142.00',
      discount: '$14.20',
    },
  ];

  // Configuration for the chart
  const config = {
    data: usageData,
    xField: 'date',
    yField: 'revenue',
    seriesField: 'type',
    smooth: true,
    meta: {
      revenue: {
        alias: 'Revenue ($)',
      },
    },
    tooltip: {
      showCrosshairs: true,
      shared: true,
    },
    line: {
      color: '#1890ff',
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
  };

  // Top products with promotion applied
  const topProducts = [
    { name: 'Summer T-Shirt', sales: 45, discount: '$450.00' },
    { name: 'Swim Shorts', sales: 38, discount: '$380.00' },
    { name: 'Sandals', sales: 32, discount: '$320.00' },
    { name: 'Beach Towel', sales: 28, discount: '$280.00' },
    { name: 'Sunscreen', sales: 25, discount: '$250.00' },
  ];

  // Columns for top products table
  const topProductColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sales Count',
      dataIndex: 'sales',
      key: 'sales',
      align: 'right',
    },
    {
      title: 'Total Discount',
      dataIndex: 'discount',
      key: 'discount',
      align: 'right',
    },
  ];

  // Get promotion type icon
  const getTypeIcon = () => {
    switch (promotion.type) {
      case 'percentage':
        return <PercentageOutlined />;
      case 'fixed':
        return <DollarOutlined />;
      case 'gift':
        return <GiftOutlined />;
      default:
        return <TagOutlined />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'blue';
      default:
        return 'default';
    }
  };

  return (
    <div className="promotion-detail" style={{ padding: '16px' }}>
      <Card
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}
        title={
          <Space align="center">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/promotions')}
              style={{ marginRight: '16px' }}
            />
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ margin: 0 }}>
                {promotion.name}
              </Title>
              <Space style={{ marginTop: '4px' }}>
                <Tag color="blue" icon={getTypeIcon()}>
                  {promotion.type === 'percentage' 
                    ? `${promotion.discountValue}% Off` 
                    : promotion.type === 'fixed'
                    ? `$${promotion.discountValue} Off`
                    : promotion.type}
                </Tag>
                <Tag 
                  color={getStatusColor(promotion.status)} 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    padding: '4px 8px', 
                    textTransform: 'capitalize' 
                  }}
                >
                  {promotion.status}
                </Tag>
                {promotion.code && (
                  <Tag color="purple">
                    Code: {promotion.code}
                  </Tag>
                )}
              </Space>
            </Space>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/promotions/${id}/edit`)}
            >
              Edit
            </Button>
            <Button 
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log('Delete promotion:', id);
                navigate('/admin/promotions');
              }}
            >
              Delete
            </Button>
          </Space>
        }
      >
        <Row gutter={[24, 24]}>
          {/* Stats Summary */}
          <Col xs={24} sm={8}>
            <Card bordered={false} className="stat-card" style={{ background: '#f0f5ff', borderRadius: '8px' }}>
              <Statistic
                title={<Text strong>Total Usage</Text>}
                value={promotion.usageCount}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="stat-card" style={{ background: '#f6ffed', borderRadius: '8px' }}>
              <Statistic
                title={<Text strong>Revenue Generated</Text>}
                value={promotion.revenue}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="stat-card" style={{ background: '#f9f0ff', borderRadius: '8px' }}>
              <Statistic
                title={<Text strong>Conversion Rate</Text>}
                value={68.5}
                suffix="%"
                precision={1}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>

          {/* Promotion Details */}
          <Col xs={24} md={12}>
            <Card 
              title={<Title level={5}>Promotion Details</Title>} 
              bordered={false}
              className="detail-card"
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Description" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.description || 'No description provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Date Range" labelStyle={{ fontWeight: 'bold' }}>
                  <Space>
                    <CalendarOutlined />
                    {`${promotion.startDate} to ${promotion.endDate}`}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Applicable To" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.applicableTo}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Group" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.customerGroup}
                </Descriptions.Item>
                <Descriptions.Item label="Minimum Order Value" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.minOrderValue === 0 ? 'No minimum' : `$${promotion.minOrderValue}`}
                </Descriptions.Item>
                <Descriptions.Item label="Usage Limit" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.usageLimit || 'No limit'}
                </Descriptions.Item>
                <Descriptions.Item label="Created On" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label="Created By" labelStyle={{ fontWeight: 'bold' }}>
                  {promotion.createdBy}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          
          {/* Recent Orders with this Promotion */}
          <Col xs={24} md={12}>
            <Card 
              title={<Title level={5}>Recent Orders</Title>} 
              bordered={false}
              className="detail-card"
            >
              <List
                itemLayout="horizontal"
                dataSource={recentOrders}
                renderItem={(item) => (
                  <List.Item 
                    className="order-item"
                    actions={[
                      <a key="view" href={`/admin/orders/${item.id}`}>View</a>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={<Text strong>{item.customer}</Text>}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">{item.date}</Text>
                          <Space>
                            <Text strong>Order: {item.id}</Text>
                            <Tag color="green">
                              <CreditCardOutlined /> {item.amount}
                            </Tag>
                            <Tag color="blue">
                              <TagOutlined /> {item.discount}
                            </Tag>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          {/* Usage Analytics Chart */}
          <Col span={24}>
            <Card 
              title={<Title level={5}>Usage Analytics</Title>} 
              bordered={false}
              className="detail-card"
            >
              <div className="usage-chart">
                <Line {...config} />
              </div>
            </Card>
          </Col>
          
          {/* Top Products */}
          <Col xs={24} md={12}>
            <Card 
              title={<Title level={5}>Top Products with Promotion</Title>} 
              bordered={false}
              className="detail-card"
            >
              <Table
                columns={topProductColumns}
                dataSource={topProducts}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          
          {/* Customer Segments */}
          <Col xs={24} md={12}>
            <Card 
              title={<Title level={5}>Customer Segments</Title>} 
              bordered={false}
              className="detail-card"
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="New Customers" 
                    value={124} 
                    suffix="/328" 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Returning" 
                    value={175} 
                    suffix="/328" 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="VIP Members" 
                    value={29} 
                    suffix="/328" 
                  />
                </Col>
              </Row>
              
              <Divider />
              
              <Row>
                <Col span={24}>
                  <Title level={5}>Conversion Rate by Source</Title>
                  <div style={{ padding: '16px 0' }}>
                    <Row align="middle" style={{ marginBottom: '12px' }}>
                      <Col span={8}>
                        <Text>Website Direct</Text>
                      </Col>
                      <Col span={12}>
                        <Progress percent={75} strokeColor="#1890ff" />
                      </Col>
                      <Col span={4} style={{ textAlign: 'right' }}>
                        <Text strong>75%</Text>
                      </Col>
                    </Row>
                    <Row align="middle" style={{ marginBottom: '12px' }}>
                      <Col span={8}>
                        <Text>Email Campaign</Text>
                      </Col>
                      <Col span={12}>
                        <Progress percent={62} strokeColor="#52c41a" />
                      </Col>
                      <Col span={4} style={{ textAlign: 'right' }}>
                        <Text strong>62%</Text>
                      </Col>
                    </Row>
                    <Row align="middle" style={{ marginBottom: '12px' }}>
                      <Col span={8}>
                        <Text>Social Media</Text>
                      </Col>
                      <Col span={12}>
                        <Progress percent={48} strokeColor="#faad14" />
                      </Col>
                      <Col span={4} style={{ textAlign: 'right' }}>
                        <Text strong>48%</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PromotionDetail; 