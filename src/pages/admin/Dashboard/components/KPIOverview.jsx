import React from 'react';
import { Row, Col, Card, Statistic, Typography, Select, Skeleton } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const KPI_CONFIG = {
  totalRevenue: { title: 'Total Revenue', icon: <DollarOutlined />, precision: 2 },
  totalOrders: { title: 'Total Orders', icon: <ShoppingCartOutlined />, precision: 0 },
  avgOrderValue: { title: 'Avg. Order Value', icon: <DollarOutlined />, precision: 2 },
  newCustomers: { title: 'New Customers', icon: <UserOutlined />, precision: 0 },
};

const formatChange = (change) => {
  const positive = change >= 0;
  const ArrowIcon = positive ? ArrowUpOutlined : ArrowDownOutlined;
  return (
    <span style={{ marginLeft: 8, fontSize: 14, color: positive ? '#3f8600' : '#cf1322' }}>
      <ArrowIcon /> {Math.abs(change).toFixed(1)}%
    </span>
  );
};

const KPIOverview = ({ items, loading, timeFrame, setTimeFrame }) => {
  const now = new Date();
  const formattedNow = now.toLocaleString();

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8
      }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>KPI Overview</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            As of: {formattedNow}
          </Text>
        </div>
        <Select
          value={timeFrame}
          onChange={setTimeFrame}
          disabled={loading}
          suffixIcon={loading ? <LoadingOutlined spin /> : undefined}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'weekly', label: 'Weekly' }
          ]}
          style={{ width: 120 }}
        />
      </div>

      <Row gutter={[16, 16]}>
        {Object.entries(KPI_CONFIG).map(([key, cfg]) => {
          const itm = items.find(i => i.key === key) || { current: 0, changePercent: 0 };
          return (
            <Col key={key} xs={24} sm={12} lg={6}>
              <Card>
                <Skeleton loading={loading} active paragraph={false}>
                  <Statistic
                    title={cfg.title}
                    value={itm.current}
                    prefix={cfg.icon}
                    precision={cfg.precision}
                    valueStyle={{ color: itm.changePercent >= 0 ? '#3f8600' : '#cf1322' }}
                    suffix={formatChange(itm.changePercent)}
                  />
                </Skeleton>
                <div style={{ marginTop: 10 }}>
                  <Text type="secondary">vs. previous period</Text>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default KPIOverview;