import { useState } from 'react';
import {
  Card,
  Typography,
  Select,
  DatePicker,
  Row,
  Col,
  Table,
  Statistic,
  Button,
  Space,
  Tabs,
  message,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Promotion.scss';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PromotionAnalytics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('revenue');
  // Use native Date objects instead of moment
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date()
  ]);
  const [selectedPromotion, setSelectedPromotion] = useState('all');
  const [loading, setLoading] = useState(false);

  // Helper function to format dates for display
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Mock data for promotions
  const promotions = [
    { id: 'all', name: 'All Promotions' },
    { id: '1', name: 'Summer Sale 2023' },
    { id: '2', name: 'New Customer Discount' },
    { id: '3', name: 'Back to School' },
    { id: '4', name: 'Holiday Gift' },
    { id: '5', name: 'Black Friday' },
  ];

  // Mock data for analytics
  const analyticsData = {
    overview: {
      totalRevenue: 23503,
      totalOrders: 985,
      totalCustomers: 752,
      conversionRate: 15.4,
      averageOrderValue: 23.86,
    },
    dailyData: Array.from({ length: 30 }, (_, i) => ({
      date: formatDate(new Date(new Date().setDate(new Date().getDate() - 29 + i))),
      revenue: Math.floor(Math.random() * 1000) + 200,
      orders: Math.floor(Math.random() * 50) + 10,
      customers: Math.floor(Math.random() * 40) + 5,
    })),
    promotionPerformance: [
      {
        promotion: 'Summer Sale 2023',
        revenue: 5243,
        orders: 328,
        customers: 305,
        conversionRate: 18.2,
      },
      {
        promotion: 'New Customer Discount',
        revenue: 2900,
        orders: 145,
        customers: 145,
        conversionRate: 22.5,
      },
      {
        promotion: 'Black Friday',
        revenue: 15360,
        orders: 512,
        customers: 302,
        conversionRate: 35.6,
      },
    ],
    channelBreakdown: [
      { channel: 'Direct Website', value: 45 },
      { channel: 'Email Marketing', value: 25 },
      { channel: 'Social Media', value: 15 },
      { channel: 'Referral', value: 10 },
      { channel: 'Others', value: 5 },
    ],
    productPerformance: [
      { product: 'Running Shoes X1', sales: 125, revenue: 6250 },
      { product: 'Casual Sneakers C3', sales: 98, revenue: 3920 },
      { product: 'Hiking Boots H2', sales: 87, revenue: 5220 },
      { product: 'Sport Sandals S5', sales: 76, revenue: 2280 },
      { product: 'Basketball Shoes B7', sales: 65, revenue: 3900 },
    ],
    customerSegmentation: [
      { segment: 'New Customers', value: 35 },
      { segment: 'Returning Customers', value: 45 },
      { segment: 'VIP Customers', value: 20 },
    ],
  };

  // Function to refresh data
  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Function to export data
  const exportData = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  // Simplified implementation - chartable component
  const SimpleChart = ({ title, description }) => (
    <Card bordered={false} className="chart-card" title={title}>
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Text type="secondary" style={{ marginBottom: 16 }}>
          {description || 'Chart visualization would appear here'}
        </Text>
        <Space>
          <Button type="primary" onClick={() => message.info('Chart data can be exported')}>
            Export Data
          </Button>
        </Space>
      </div>
    </Card>
  );

  // Product performance table columns
  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Sales Quantity',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
  ];

  // Customer behavior table columns
  const customerColumns = [
    {
      title: 'Customer Segment',
      dataIndex: 'segment',
      key: 'segment',
    },
    {
      title: 'Coupon Usage',
      dataIndex: 'usage',
      key: 'usage',
      sorter: (a, b) => a.usage - b.usage,
    },
    {
      title: 'Avg. Order Value',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.avgOrderValue - b.avgOrderValue,
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (value) => `${value}%`,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
    },
  ];

  // Mock customer data
  const customerData = [
    { key: '1', segment: 'New Customers', usage: 145, avgOrderValue: 78, conversionRate: 3.2 },
    { key: '2', segment: 'Returning Customers', usage: 238, avgOrderValue: 125, conversionRate: 8.7 },
    { key: '3', segment: 'VIP Customers', usage: 89, avgOrderValue: 210, conversionRate: 15.4 },
    { key: '4', segment: 'Abandoned Cart Users', usage: 76, avgOrderValue: 95, conversionRate: 2.8 },
    { key: '5', segment: 'Social Media Referrals', usage: 112, avgOrderValue: 85, conversionRate: 5.6 },
  ];

  // Define tab items for the Ant Design v5 Tabs component
  const tabItems = [
    {
      key: "revenue",
      label: <span><LineChartOutlined /> Revenue Trends</span>,
      children: <SimpleChart title="Daily Revenue" description="Line chart showing daily revenue trends" />
    },
    {
      key: "performance",
      label: <span><BarChartOutlined /> Promotion Performance</span>,
      children: <SimpleChart title="Promotion Performance" description="Bar chart comparing performance across different promotions" />
    },
    {
      key: "conversion",
      label: <span><PieChartOutlined /> Conversion Rates</span>,
      children: <SimpleChart title="Conversion Rates" description="Pie chart showing coupon view to redemption rates" />
    },
    {
      key: "customers",
      label: <span><UserOutlined /> Customer Behavior</span>,
      children: (
        <Table
          columns={customerColumns}
          dataSource={customerData}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      )
    }
  ];

  return (
    <div className="promotion-analytics">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/promotions')}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>

      <Card
        title={
          <Space>
            <Title level={4}>Promotion Analytics</Title>
          </Space>
        }
        className="analytics-card"
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={refreshData}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportData}
            >
              Export
            </Button>
          </Space>
        }
      >


        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="stat-card"
              bordered={false}
              style={{
                backgroundColor: '#f6ffed',
                borderLeft: '4px solid #52c41a',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
              }}
            >
              <Statistic
                title={<Text strong>Revenue Generated</Text>}
                value={analyticsData.overview.totalRevenue}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="stat-card"
              bordered={false}
              style={{
                backgroundColor: '#e6f7ff',
                borderLeft: '4px solid #1890ff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
              }}
            >
              <Statistic
                title={<Text strong>Orders with Promotions</Text>}
                value={analyticsData.overview.totalOrders}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="stat-card"
              bordered={false}
              style={{
                backgroundColor: '#fff7e6',
                borderLeft: '4px solid #fa8c16',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
              }}
            >
              <Statistic
                title={<Text strong>Customers Reached</Text>}
                value={analyticsData.overview.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="stat-card"
              bordered={false}
              style={{
                backgroundColor: '#f9f0ff',
                borderLeft: '4px solid #722ed1',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
              }}
            >
              <Statistic
                title={<Text strong>Conversion Rate</Text>}
                value={analyticsData.overview.conversionRate}
                prefix={<TagOutlined />}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
        {/* Filters */}
        <Row gutter={[16, 16]} className="filters-row">
          <Col xs={24} sm={12} md={12} lg={8}>
            <Text strong>Date Range:</Text>
            <RangePicker
              style={{ width: '100%', marginTop: '8px' }}
              value={null}
              onChange={(dates) => {
                if (dates) {
                  setDateRange(dates);
                }
              }}
              allowClear={false}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Text strong>Promotion:</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              value={selectedPromotion}
              onChange={setSelectedPromotion}
            >
              {promotions.map(promo => (
                <Option key={promo.id} value={promo.id}>{promo.name}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        {/* Tabs for different reports */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: '24px' }}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default PromotionAnalytics; 