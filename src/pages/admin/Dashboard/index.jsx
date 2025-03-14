import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Progress, 
  Tabs, 
  Select,
  Button,
  List,
  Badge,
  notification,
  Typography,
  Divider,
  Alert,
  Tag
} from 'antd';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined, 
  UserOutlined, 
  AlertOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
// import { getBestSellersProducts } from '../../../services/productService';

const { Title, Text } = Typography;
const { Option } = Select;
const mockRevenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 2000, orders: 180 },
  { name: 'Apr', revenue: 2780, orders: 210 },
  { name: 'May', revenue: 1890, orders: 160 },
  { name: 'Jun', revenue: 2390, orders: 175 },
  { name: 'Jul', revenue: 3490, orders: 220 },
  { name: 'Aug', revenue: 4000, orders: 250 },
  { name: 'Sep', revenue: 5000, orders: 320 },
  { name: 'Oct', revenue: 4500, orders: 290 },
  { name: 'Nov', revenue: 4700, orders: 310 },
  { name: 'Dec', revenue: 6000, orders: 390 },
];

const mockOrderStatusData = [
  { name: 'Processing', value: 40 },
  { name: 'Shipped', value: 30 },
  { name: 'Delivered', value: 25 },
  { name: 'Returned', value: 5 },
];

const mockCustomerData = [
  { name: 'Jan', new: 120, returning: 80 },
  { name: 'Feb', new: 100, returning: 90 },
  { name: 'Mar', new: 80, returning: 100 },
  { name: 'Apr', new: 90, returning: 110 },
  { name: 'May', new: 95, returning: 120 },
  { name: 'Jun', new: 110, returning: 125 },
];

const mockMarketingData = [
  { name: 'Social Media', value: 35 },
  { name: 'Email', value: 25 },
  { name: 'Organic Search', value: 20 },
  { name: 'Direct', value: 15 },
  { name: 'Referral', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: '10 products are low in stock' },
    { id: 2, type: 'info', message: '5 new orders require review' },
    { id: 3, type: 'error', message: '3 orders have shipping delays' }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch best sellers
        const bestSellersData = [
          { id: 1, name: 'Running Shoe X1', sold: 120, price: 89.99, revenue: 10798.80 }];
        setBestSellers(bestSellersData.slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Error fetching dashboard data',
          description: error.message,
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getFilteredData = (data) => {
    return data;
  };
  
  const renderKPIOverview = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Revenue"
            value={240560}
            prefix={<DollarOutlined />}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 8.2%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Orders"
            value={2543}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 4.7%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Avg. Order Value"
            value={94.6}
            prefix={<DollarOutlined />}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 3.1%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="New Customers"
            value={368}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 12.4%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
  
  // Alerts Section
  const renderAlerts = () => (
    <Card title="Notifications" style={{ marginBottom: '16px' }}>
      <List
        dataSource={alerts}
        renderItem={item => (
          <List.Item
            actions={[<Button size="small" type="link">View Details</Button>]}
          >
            <List.Item.Meta
              avatar={
                item.type === 'warning' ? <AlertOutlined style={{ color: '#faad14' }} /> :
                item.type === 'error' ? <AlertOutlined style={{ color: '#f5222d' }} /> :
                <AlertOutlined style={{ color: '#1890ff' }} />
              }
              title={item.message}
              description={`${new Date().toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
  
  // Revenue and Orders Section
  const renderRevenueAndOrders = () => (
    <Card 
      title="Revenue & Orders" 
      style={{ marginBottom: '16px' }}
      extra={
        <Select 
          defaultValue={timeFrame} 
          style={{ width: 120 }} 
          onChange={setTimeFrame}
        >
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
      }
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={getFilteredData(mockRevenueData)}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      
      <Divider>Order Status</Divider>
      
      <Row gutter={16}>
        <Col span={12}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mockOrderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockOrderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col span={12}>
          <List
            dataSource={mockOrderStatusData}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={COLORS[index % COLORS.length]} />}
                  title={item.name}
                />
                <div>{item.value} orders</div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
  
  // Products Section
  const renderProducts = () => (
    <Card title="Products" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Best Sellers",
          children: (
            <List
              loading={loading}
              dataSource={bestSellers}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">View Details</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.sold} sold • $${item.price}`}
                  />
                  <div>${item.revenue.toLocaleString()}</div>
                </List.Item>
              )}
            />
          )
        },
        {
          key: "2",
          label: "Stock Alerts",
          children: (
            <List
              loading={loading}
              dataSource={bestSellers.map(item => ({ ...item, stock: Math.floor(Math.random() * 10) }))}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" ghost>Restock</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.stock} units remaining`}
                  />
                  <Tag color={item.stock < 10 ? "error" : "warning"}>
                    {item.stock < 10 ? "Low Stock" : "Getting Low"}
                  </Tag>
                </List.Item>
              )}
            />
          )
        },
        {
          key: "3",
          label: "Performance",
          children: (
            <List
              loading={loading}
              dataSource={bestSellers.map(item => ({ 
                ...item, 
                views: Math.floor(Math.random() * 1000) + 500,
                conversion: (Math.random() * 5 + 2).toFixed(1)
              }))}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.views} views • ${item.conversion}% conversion`}
                  />
                  <Progress 
                    percent={parseFloat(item.conversion) * 10} 
                    size="small" 
                    status={parseFloat(item.conversion) > 4 ? "success" : "normal"} 
                  />
                </List.Item>
              )}
            />
          )
        }
      ]} />
    </Card>
  );
  
  // Customers Section
  const renderCustomers = () => (
    <Card title="Customers" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Customer Growth",
          children: (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={mockCustomerData}
                margin={{
                  top: 10, right: 30, left: 0, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="new" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="returning" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          )
        },
        {
          key: "2",
          label: "Retention",
          children: (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Customer Retention Rate"
                    value={68.5}
                    suffix="%"
                    precision={1}
                  />
                  <Progress percent={68.5} status="active" />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Avg. Customer Lifetime Value"
                    value={427}
                    prefix="$"
                    precision={2}
                  />
                  <Text type="secondary">+12% since last quarter</Text>
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Cart Abandonment Rate"
                    value={23.4}
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: '#cf1322' }}
                  />
                  <Progress percent={23.4} status="exception" />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Repeat Purchase Rate"
                    value={42.8}
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: '#3f8600' }}
                  />
                  <Progress percent={42.8} status="success" />
                </Col>
              </Row>
            </>
          )
        }
      ]} />
    </Card>
  );
  
  // Marketing Section
  const renderMarketing = () => (
    <Card title="Marketing" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Traffic Sources",
          children: (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockMarketingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockMarketingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )
        },
        {
          key: "2",
          label: "Campaigns",
          children: (
            <Table
              dataSource={[
                {
                  key: '1',
                  name: 'Summer Sale',
                  impressions: 45000,
                  clicks: 3200,
                  conversions: 320,
                  revenue: 28640,
                  roi: 574,
                },
                {
                  key: '2',
                  name: 'Back to School',
                  impressions: 32000,
                  clicks: 2100,
                  conversions: 180,
                  revenue: 14400,
                  roi: 380,
                },
                {
                  key: '3',
                  name: 'New Collection',
                  impressions: 28000,
                  clicks: 1800,
                  conversions: 200,
                  revenue: 18000,
                  roi: 450,
                },
              ]}
              columns={[
                {
                  title: 'Campaign',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Impressions',
                  dataIndex: 'impressions',
                  key: 'impressions',
                  render: val => val.toLocaleString(),
                },
                {
                  title: 'Clicks',
                  dataIndex: 'clicks',
                  key: 'clicks',
                  render: val => val.toLocaleString(),
                },
                {
                  title: 'Conversions',
                  dataIndex: 'conversions',
                  key: 'conversions',
                  render: val => val.toLocaleString(),
                },
                {
                  title: 'Revenue',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  render: val => `$${val.toLocaleString()}`,
                },
                {
                  title: 'ROI',
                  dataIndex: 'roi',
                  key: 'roi',
                  render: val => `${val}%`,
                },
              ]}
              pagination={false}
              size="small"
            />
          )
        }
      ]} />
    </Card>
  );
  
  // Shipping & Inventory Section
  const renderShippingAndInventory = () => (
    <Card title="Shipping & Inventory" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Shipping Performance",
          children: (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Average Shipping Times (Days)">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={[
                          { name: 'FedEx', value: 2.3 },
                          { name: 'UPS', value: 2.5 },
                          { name: 'USPS', value: 3.1 },
                          { name: 'DHL', value: 3.8 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Order Fulfillment Rate">
                    <Statistic
                      value={94.8}
                      suffix="%"
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<CheckCircleOutlined />}
                    />
                    <Progress percent={94.8} status="success" />
                    <div style={{ marginTop: 10 }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic
                            title="On Time"
                            value={98.2}
                            suffix="%"
                            valueStyle={{ fontSize: 16 }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Complete"
                            value={96.5}
                            suffix="%"
                            valueStyle={{ fontSize: 16 }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <List
                    header={<div><strong>Recent Shipping Issues</strong></div>}
                    bordered
                    dataSource={[
                      { id: 1, order: '#ORD-5678', issue: 'Delayed in transit', date: '2023-10-14', carrier: 'FedEx' },
                      { id: 2, order: '#ORD-6789', issue: 'Incorrect address', date: '2023-10-13', carrier: 'UPS' },
                      { id: 3, order: '#ORD-7890', issue: 'Package damaged', date: '2023-10-12', carrier: 'USPS' },
                    ]}
                    renderItem={item => (
                      <List.Item
                        actions={[<Button size="small" type="link">Resolve</Button>]}
                      >
                        <List.Item.Meta
                          avatar={<ClockCircleOutlined style={{ color: '#f5222d' }} />}
                          title={`${item.order} - ${item.issue}`}
                          description={`${item.date} • ${item.carrier}`}
                        />
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </>
          )
        },
        {
          key: "2",
          label: "Inventory Forecast",
          children: (
            <>
              <Alert
                message="Inventory Forecast"
                description="Based on current sales trends, the following products may need restocking in the next 30 days."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Table
                dataSource={[
                  {
                    key: '1',
                    product: 'Running Shoe X1',
                    currentStock: 15,
                    projectedDemand: 40,
                    daysUntilStockout: 12,
                    priority: 'High',
                  },
                  {
                    key: '2',
                    product: 'Basketball Shoe Pro',
                    currentStock: 22,
                    projectedDemand: 35,
                    daysUntilStockout: 18,
                    priority: 'Medium',
                  },
                  {
                    key: '3',
                    product: 'Hiking Boot Extreme',
                    currentStock: 8,
                    projectedDemand: 20,
                    daysUntilStockout: 8,
                    priority: 'Critical',
                  },
                  {
                    key: '4',
                    product: 'Casual Sneaker Lite',
                    currentStock: 30,
                    projectedDemand: 45,
                    daysUntilStockout: 22,
                    priority: 'Low',
                  },
                ]}
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'product',
                    key: 'product',
                  },
                  {
                    title: 'Current Stock',
                    dataIndex: 'currentStock',
                    key: 'currentStock',
                  },
                  {
                    title: 'Projected Demand',
                    dataIndex: 'projectedDemand',
                    key: 'projectedDemand',
                  },
                  {
                    title: 'Days Until Stockout',
                    dataIndex: 'daysUntilStockout',
                    key: 'daysUntilStockout',
                  },
                  {
                    title: 'Priority',
                    dataIndex: 'priority',
                    key: 'priority',
                    render: priority => {
                      let color = 'green';
                      if (priority === 'High') {
                        color = 'orange';
                      } else if (priority === 'Critical') {
                        color = 'red';
                      } else if (priority === 'Medium') {
                        color = 'blue';
                      }
                      return <Tag color={color}>{priority}</Tag>;
                    },
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: () => <Button size="small">Reorder</Button>,
                  },
                ]}
                pagination={false}
                size="small"
              />
            </>
          )
        }
      ]} />
    </Card>
  );
  
  return (
    <div style={{ padding: '8px' }}>
      {/* <Title level={2}>Dashboard</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        Welcome to your store dashboard. Here's an overview of your business performance.
      </Text> */}
      
      {renderKPIOverview()}
      
      <div style={{ height: '16px' }} />
      
      {renderAlerts()}
      
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Revenue & Orders",
          children: renderRevenueAndOrders()
        },
        {
          key: "2",
          label: "Products",
          children: renderProducts()
        },
        {
          key: "3",
          label: "Customers",
          children: renderCustomers()
        },
        {
          key: "4",
          label: "Marketing",
          children: renderMarketing()
        },
        {
          key: "5",
          label: "Shipping & Inventory",
          children: renderShippingAndInventory()
        }
      ]} />
    </div>
  );
};

export default Dashboard;