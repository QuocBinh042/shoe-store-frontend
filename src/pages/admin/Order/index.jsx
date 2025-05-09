import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Tabs,
  Input,
  Table,
  Tag,
  Typography,
  Select,
  DatePicker,
  Statistic,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import './Order.scss';
import {
  getAllOrdersPaged,
  getCanceledOrders,
  getCanceledOrdersByDay,
  getCanceledOrdersByMonth,
  getCanceledOrdersByYear,
  getCompletedOrders,
  getCompletedOrdersByDay,
  getCompletedOrdersByMonth,
  getCompletedOrdersByYear,
  getOrdersByDay,
  getOrdersByMonth,
  getOrdersByYear,
  getTotalOrderAmount,
  getTotalOrderAmountByDay,
  getTotalOrderAmountByMonth,
  getTotalOrderAmountByYear,
  getTotalOrders,
  getTotalOrdersByDay,
  getTotalOrdersByMonth,
  getTotalOrdersByYear,
  filterOrders,
} from '../../../services/orderService';
import { currencyFormat } from '../../../utils/helper';
import { getStatusColor, STATUS_OPTION } from '../../../constants/orderConstant';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const OrderDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailView = location.pathname.includes('/admin/orders/');

  const [activeTimeTab, setActiveTimeTab] = useState('all');
  const [activeStatusOption, setActiveStatusOption] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [canceledOrders, setCanceledOrders] = useState(0);
  const [isActiveSearch, setIsActiveSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#f6ffed',
      borderColor: '#b7eb8f',
    },
    {
      title: 'Total Order Amount',
      value: currencyFormat(totalOrderAmount),
      icon: <BarsOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
      borderColor: '#d3adf7',
    },
    {
      title: 'Canceled Orders',
      value: canceledOrders,
      icon: <CloseCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fff7e6',
      borderColor: '#ffd591',
    },
  ];

  const fetchOrders = async () => {
    try {
      if (isActiveSearch || dateRange[0] || activeStatusOption !== 'ALL') {
        const from = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null;
        const to = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null;
        const status = activeStatusOption !== 'ALL' ? activeStatusOption : null;

        const result = await filterOrders({
          mode: activeTimeTab,
          status: status,
          q: searchText,
          from: from,
          to: to,
          sort: sortOption,
          page: currentPage,
          pageSize: pageSize,
        });
        console.log('Filtered Orders:', result);
        console.log(activeTimeTab, status, searchText, from, to, sortOption);
        if (result && result.data.items) {
          const rows = result.data.items.map((order) => ({
            key: order.orderID,
            ...order,
          }));
          setOrders(rows);
          setTotalOrdersCount(result.total || rows.length);
        } else {
          message.error('Không thể tải danh sách đơn hàng');
        }
      } else {
        let orderData;
        switch (activeTimeTab) {
          case 'day':
            orderData = await getOrdersByDay(currentPage, pageSize);
            break;
          case 'month':
            orderData = await getOrdersByMonth(currentPage, pageSize);
            break;
          case 'year':
            orderData = await getOrdersByYear(currentPage, pageSize);
            break;
          case 'all':
          default:
            orderData = await getAllOrdersPaged(currentPage, pageSize);
            break;
        }
        if (orderData.statusCode === 200) {
          const rows = orderData.data.items.map((order) => ({
            key: order.orderID,
            ...order,
          }));
          setOrders(rows);
          setTotalOrdersCount(orderData.total || rows.length);
        } else {
          message.error('Không thể tải danh sách đơn hàng');
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      message.error('Lỗi khi tải danh sách đơn hàng');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTimeTab, currentPage, pageSize, isActiveSearch, dateRange, activeStatusOption, sortOption]);

  // Giữ nguyên useEffect cho các thống kê
  useEffect(() => {
    const fetchStats = async () => {
      try {
        let total, amount, completed, canceled;
        switch (activeTimeTab) {
          case 'day':
            [total, amount, completed, canceled] = await Promise.all([
              getTotalOrdersByDay(),
              getTotalOrderAmountByDay(),
              getCompletedOrdersByDay(),
              getCanceledOrdersByDay(),
            ]);
            break;
          case 'month':
            [total, amount, completed, canceled] = await Promise.all([
              getTotalOrdersByMonth(),
              getTotalOrderAmountByMonth(),
              getCompletedOrdersByMonth(),
              getCanceledOrdersByMonth(),
            ]);
            break;
          case 'year':
            [total, amount, completed, canceled] = await Promise.all([
              getTotalOrdersByYear(),
              getTotalOrderAmountByYear(),
              getCompletedOrdersByYear(),
              getCanceledOrdersByYear(),
            ]);
            break;
          case 'all':
            [total, amount, completed, canceled] = await Promise.all([
              getTotalOrders(),
              getTotalOrderAmount(),
              getCompletedOrders(),
              getCanceledOrders(),
            ]);
            break;
          default:
            total = amount = completed = canceled = 0;
        }
        setTotalOrders(total || 0);
        setTotalOrderAmount(amount || 0);
        setCompletedOrders(completed || 0);
        setCanceledOrders(canceled || 0);
      } catch (error) {
        console.error('Lỗi khi tải số liệu thống kê:', error);
        message.error('Lỗi khi tải số liệu thống kê');
      }
    };
    fetchStats();
  }, [activeTimeTab]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'code',
      key: 'code',
      render: (code) => `#${code}`,
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (user?.name ? user.name : 'N/A'),
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <Text strong>{currencyFormat(total)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 'bold', padding: '4px 8px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Shipping Address',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      render: (addr) => addr || 'N/A',
    },
  ];

  if (isDetailView) {
    return <Outlet />;
  }

  const timeTabs = [
    { key: 'all', label: 'All' },
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highestTotal', label: 'Highest Total' },
    { value: 'lowestTotal', label: 'Lowest Total' },
  ];

  const handleTimeTabChange = (key) => {
    setActiveTimeTab(key);
    setCurrentPage(1);
  };

  const handleStatusOptionChange = (key) => {
    setActiveStatusOption(key);
    setCurrentPage(1);
  };

  const handleSearch = async (value) => {
    setSearchText(value);
    setCurrentPage(1);
    
    if (!value) {
      setIsActiveSearch(false);
    } else {
      setIsActiveSearch(true);
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  return (
    <div className="order-dashboard">
      <Card className="order-dashboard__content-card">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Tabs
              activeKey={activeTimeTab}
              onChange={handleTimeTabChange}
              items={timeTabs}
            />
          </Col>
          <Col>
            <Text type="secondary">
              {activeTimeTab === 'day'
                ? `Today: ${new Date().toLocaleDateString()}`
                : activeTimeTab === 'month'
                  ? `This Month: ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`
                  : activeTimeTab === 'year'
                    ? `This Year: ${new Date().getFullYear()}`
                    : activeTimeTab === 'all'
                      ? 'All Time'
                      : ''}
            </Text>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: '16px' }}>
          {stats.map((stat) => (
            <Col xs={24} sm={12} lg={6} key={stat.title}>
              <Card
                className="stat-card"
                bordered={false}
                style={{
                  backgroundColor: stat.color,
                  borderLeft: `4px solid ${stat.borderColor}`,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
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

        <div style={{ padding: '0 0px' }}>
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Search
              </Text>
              <Input.Search
                placeholder="Order ID or Customer Name"
                allowClear
                onSearch={handleSearch}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Sort
              </Text>
              <Select
                placeholder="Sort Orders"
                style={{ width: '100%' }}
                value={sortOption}
                onChange={handleSortChange}
              >
                {sortOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Date Range
              </Text>
              <RangePicker 
                style={{ width: '100%' }} 
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Status
              </Text>
              <Select
                value={activeStatusOption}
                onChange={handleStatusOptionChange}
                style={{ width: '100%' }}
              >
                {STATUS_OPTION.map((tab) => (
                  <Select.Option key={tab.key} value={tab.key}>
                    {tab.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Table
            onRow={(record) => ({
              onClick: () => navigate(`/admin/orders/${record.orderID}`),
              style: { cursor: 'pointer' },
            })}
            columns={columns}
            dataSource={orders}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalOrdersCount,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderDashboard;