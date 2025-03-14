import { useState } from 'react';
import { 
  Typography, 
  Card, 
  Tabs, 
  Button, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Space, 
  Input, 
  Select,
  DatePicker,
  Statistic,
  Modal,
  message,
  Dropdown
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  BarChartOutlined,
  TagOutlined,
  GiftOutlined,
  DollarOutlined,
  PercentageOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  MailOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Promotion.scss';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const PromotionDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  // Mock data for promotions
  const [promotions] = useState([
    {
      id: '1',
      name: 'Summer Sale 2023',
      type: 'percentage',
      typeLabel: 'Percentage (10%)',
      typeIcon: <PercentageOutlined />,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      status: 'active',
      conditions: 'All products',
      usageCount: 328,
      revenue: '$5,243.00',
    },
    {
      id: '2',
      name: 'New Customer Discount',
      type: 'fixed',
      typeLabel: 'Fixed Amount ($20)',
      typeIcon: <DollarOutlined />,
      startDate: '2023-05-15',
      endDate: '2023-12-31',
      status: 'active',
      conditions: 'First purchase only',
      usageCount: 145,
      revenue: '$2,900.00',
    },
    {
      id: '3',
      name: 'Back to School',
      type: 'buyx',
      typeLabel: 'Buy 2 Get 1 Free',
      typeIcon: <TagOutlined />,
      startDate: '2023-08-01',
      endDate: '2023-09-15',
      status: 'upcoming',
      conditions: 'School supplies category',
      usageCount: 0,
      revenue: '$0.00',
    },
    {
      id: '4',
      name: 'Holiday Gift',
      type: 'gift',
      typeLabel: 'Free Gift',
      typeIcon: <GiftOutlined />,
      startDate: '2023-12-01',
      endDate: '2023-12-25',
      status: 'upcoming',
      conditions: 'Orders over $100',
      usageCount: 0,
      revenue: '$0.00',
    },
    {
      id: '5',
      name: 'Black Friday',
      type: 'percentage',
      typeLabel: 'Percentage (30%)',
      typeIcon: <PercentageOutlined />,
      startDate: '2022-11-24',
      endDate: '2022-11-28',
      status: 'expired',
      conditions: 'All products',
      usageCount: 512,
      revenue: '$15,360.00',
    },
  ]);

  const stats = [
    {
      title: 'Active Promotions',
      value: 2,
      icon: <TagOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#f6ffed',
      borderColor: '#b7eb8f',
    },
    {
      title: 'Upcoming Promotions',
      value: 2,
      icon: <FilterOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    {
      title: 'Total Orders with Promotions',
      value: 985,
      icon: <BarChartOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
      borderColor: '#d3adf7',
    },
    {
      title: 'Revenue from Promotions',
      value: '$23,503.00',
      icon: <DollarOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fff7e6',
      borderColor: '#ffd591',
    },
  ];

  // Handle delete promotion
  const handleDeletePromotion = (id) => {
    confirm({
      title: 'Are you sure you want to delete this promotion?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All data related to this promotion will be permanently removed.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // Call API to delete promotion
        console.log('Deleting promotion:', id);
        // Simulating successful deletion
        message.success('Promotion deleted successfully');
        // In a real app, you would update the state or refetch the data
      },
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'typeLabel',
      key: 'type',
      render: (text, record) => (
        <Space>
          {record.typeIcon}
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_, record) => (
        <Text>{`${record.startDate} to ${record.endDate}`}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'upcoming') {
          color = 'blue';
        } else if (status === 'expired') {
          color = 'gray';
        }
        return (
          <Tag color={color} style={{ textTransform: 'capitalize', fontWeight: 'bold', padding: '4px 8px' }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Usage',
      dataIndex: 'usageCount',
      key: 'usage',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              navigate(`/admin/promotions/${record.id}`);
            }}
            tooltip="View details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              navigate(`/admin/promotions/${record.id}/edit`);
            }}
            tooltip="Edit promotion"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleDeletePromotion(record.id);
            }}
            tooltip="Delete promotion"
          />
        </Space>
      ),
    },
  ];

  // Define items for Tabs component
  const tabItems = [
    { key: 'active', label: 'Active Promotions' },
    { key: 'upcoming', label: 'Upcoming Promotions' },
    { key: 'expired', label: 'Expired Promotions' },
    { key: 'all', label: 'All Promotions' }
  ];

  return (
    <div className="promotion-dashboard">
      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="stats-row">
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

      {/* Main Content Card */}
      <Card 
        className="content-card"
        style={{ 
          marginTop: '16px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
        }}
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>Promotion Management</Title>
            </Col>
            <Col>
              <Space>
                <Dropdown menu={{
                  items: [
                    {
                      key: "create",
                      icon: <PlusOutlined />,
                      label: "Create Promotion",
                      onClick: () => navigate('/admin/promotions/create')
                    },
                    {
                      key: "coupons",
                      icon: <TagOutlined />,
                      label: "Generate Coupons",
                      onClick: () => navigate('/admin/promotions/coupons')
                    },
                    {
                      key: "marketing",
                      icon: <MailOutlined />,
                      label: "Marketing Campaigns",
                      onClick: () => navigate('/admin/promotions/marketing')
                    }
                  ]
                }}>
                  <Button type="primary" style={{ borderRadius: '6px', fontWeight: 'bold' }}>
                    Actions <DownOutlined />
                  </Button>
                </Dropdown>

                <Button 
                  icon={<LineChartOutlined />}
                  onClick={() => navigate('/admin/promotions/analytics')}
                  style={{ 
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  Analytics
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        {/* Tabs for promotion status */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />

        {/* Search and Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Input.Search 
              placeholder="Search promotions..." 
              prefix={<SearchOutlined />} 
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select 
              placeholder="Filter by type" 
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="percentage">Percentage Discount</Option>
              <Option value="fixed">Fixed Amount</Option>
              <Option value="buyx">Buy X Get Y</Option>
              <Option value="gift">Free Gift</Option>
              <Option value="shipping">Free Shipping</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} lg={10}>
            <RangePicker 
              style={{ width: '100%' }} 
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
        </Row>

        {/* Promotions Table */}
        <Table
          columns={columns}
          dataSource={promotions.filter(
            p => activeTab === 'all' || p.status === activeTab
          )}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          style={{ 
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/admin/promotions/${record.id}`),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>
    </div>
  );
};

export default PromotionDashboard;