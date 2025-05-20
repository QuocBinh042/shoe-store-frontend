// src/components/Customers.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Spin,
  Alert,
  Space
} from 'antd';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { useCustomerDashboard } from '../../../../hooks/useDashboardData';

const { Text } = Typography;

export default function Customers({ year = new Date().getFullYear() }) {
  const { growthData, metrics, loading, error } = useCustomerDashboard(year);

  const [percentages, setPercentages] = useState({ retention: 0, repeat: 0 });
  useEffect(() => {
    if (!loading && metrics) {
      setPercentages({
        retention: metrics.retentionRate,
        repeat: metrics.repeatPurchaseRate
      });
    }
  }, [loading, metrics]);

  if (loading) {
    return (
      <Spin
        tip="Loading customers..."
        style={{ display: 'block', marginTop: 50, textAlign: 'center' }}
      />
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load customer data."
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <Card
      title="Customers"
      style={{
        marginBottom: 16,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Tabs defaultActiveKey="1">
        {/* Customer Growth Tab */}
        <Tabs.TabPane key="1" tab="Customer Growth">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={growthData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              isAnimationActive
              animationDuration={800}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="new"
                name="New Customers"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="returning"
                name="Returning Customers"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Tabs.TabPane>

        {/* Retention Tab */}
        <Tabs.TabPane key="2" tab="Retention">
          <Row gutter={[24, 24]} justify="center">
            {/* Customer Retention Rate */}
            <Col xs={24} sm={12} lg={8}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Statistic
                  title="Customer Retention Rate"
                  value={metrics.retentionRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ fontSize: 28 }}
                />
                <Progress
                  percent={percentages.retention}
                  strokeWidth={12}
                  showInfo={false}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068'
                  }}
                  style={{ transition: 'width 1s ease-out' }}
                />
                <Text
                  type="secondary"
                  style={{
                    textAlign: 'right',
                    display: 'block',
                    marginTop: 4
                  }}
                >
                  {metrics.retentionRate.toFixed(1)}% retained
                </Text>
              </Space>
            </Col>

            {/* Avg. Customer Lifetime Value */}
            <Col xs={24} sm={12} lg={8}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Statistic
                  title="Avg. Customer Lifetime Value"
                  value={metrics.avgLifetimeValue}
                  prefix="$"
                  precision={2}
                  formatter={value => Number(value).toLocaleString()}
                  valueStyle={{ fontSize: 28 }}
                />
                {/* Uncomment if you have a lifetime change metric */}
                {/* <Text type="secondary">+12% since last quarter</Text> */}
              </Space>
            </Col>

            {/* Repeat Purchase Rate */}
            <Col xs={24} sm={12} lg={8}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Statistic
                  title="Repeat Purchase Rate"
                  value={metrics.repeatPurchaseRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#3f8600', fontSize: 28 }}
                />
                <Progress
                  percent={percentages.repeat}
                  strokeWidth={12}
                  showInfo={false}
                  strokeColor={{
                    '0%': '#3f8600',
                    '100%': '#87d068'
                  }}
                  style={{ transition: 'width 1s ease-out' }}
                />
                <Text
                  type="secondary"
                  style={{
                    textAlign: 'right',
                    display: 'block',
                    marginTop: 4
                  }}
                >
                  {metrics.repeatPurchaseRate.toFixed(1)}% repeat
                </Text>
              </Space>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
