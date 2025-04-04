import { useState, useEffect } from 'react';
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
  TruckOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  MailOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // Thêm moment để định dạng ngày
import './Promotion.scss';
import { getAllPromotions, deletePromotion } from '../../../services/promotionService'; // Thêm deletePromotion

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const PromotionDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const data = await getAllPromotions(currentPage, pageSize);
        setPromotions(data.data.items);
        setTotalItems(data.data.totalElements);
        console.log('Promotions:', data.data);
      } catch (error) {
        message.error('Failed to load promotions');
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, [currentPage]);

  const getTypeInfo = (type) => {
    switch (type.toLowerCase()) {
      case 'percentage':
        return { icon: <PercentageOutlined />, label: 'Percentage Discount' };
      case 'fixed':
        return { icon: <DollarOutlined />, label: 'Fixed Amount' };
      case 'buyx':
        return { icon: <TagOutlined />, label: 'Buy X Get Y' };
      case 'gift':
        return { icon: <GiftOutlined />, label: 'Free Gift' };
      case 'shipping':
        return { icon: <TruckOutlined />, label: 'Free Shipping' };
      default:
        return { icon: <TagOutlined />, label: type || 'Unknown' };
    }
  };

  const stats = [
    {
      title: 'Active Promotions',
      value: promotions.filter(p => p.status.toLowerCase() === 'active').length,
      icon: <TagOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#f6ffed',
      borderColor: '#b7eb8f',
    },
    {
      title: 'Upcoming Promotions',
      value: promotions.filter(p => p.status.toLowerCase() === 'upcoming').length,
      icon: <FilterOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    {
      title: 'Total Orders with Promotions',
      value: 985, // Sample value
      icon: <BarChartOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
      borderColor: '#d3adf7',
    },
    {
      title: 'Revenue from Promotions',
      value: '$23,503.00', // Sample value
      icon: <DollarOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fff7e6',
      borderColor: '#ffd591',
    },
  ];

  const handleDeletePromotion = (id) => {
    confirm({
      title: 'Are you sure you want to delete this promotion?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All related data will be permanently removed.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePromotion(id);
          message.success('Promotion deleted successfully');
          const data = await getAllPromotions(currentPage, pageSize);
          setPromotions(data.data.items);
          setTotalItems(data.data.totalElements);
        } catch (error) {
          message.error('Failed to delete promotion');
          console.error('Error deleting promotion:', error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Promotion Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => {
        const { icon, label } = getTypeInfo(record.type);
        return (
          <Space>
            {icon}
            <Text>{label}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_, record) => (
        <Text>
          {moment(record.startDate).format('DD/MM/YYYY')} to {moment(record.endDate).format('DD/MM/YYYY')}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status.toLowerCase() === 'upcoming') color = 'blue';
        else if (status.toLowerCase() === 'expired') color = 'gray';
        return (
          <Tag color={color} style={{ textTransform: 'capitalize', fontWeight: 'bold', padding: '4px 8px' }}>
            {status.toLowerCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Usage Count',
      dataIndex: 'usageCount',
      key: 'usage',
      render: (text) => <Text>{text || 0}</Text>,
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
              e.stopPropagation();
              navigate(`/admin/promotions/${record.promotionID}`);
            }}
            tooltip="View details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/promotions/${record.promotionID}/edit`);
            }}
            tooltip="Edit promotion"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePromotion(record.promotionID);
            }}
            tooltip="Delete promotion"
          />
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'active', label: 'Active Promotions' },
    { key: 'upcoming', label: 'Upcoming Promotions' },
    { key: 'expired', label: 'Expired Promotions' },
    { key: 'all', label: 'All Promotions' },
  ];

  return (
    <div className="promotion-dashboard">
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
                  style={{ borderRadius: '6px', fontWeight: 'bold' }}
                >
                  Analytics
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />

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

        <Table
          columns={columns}
          dataSource={promotions.filter(
            (p) => activeTab === 'all' || p.status.toLowerCase() === activeTab
          )}
          rowKey="promotionID"
          loading={loading}
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          style={{ 
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/admin/promotions/${record.promotionID}`),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>
    </div>
  );
};

export default PromotionDashboard;