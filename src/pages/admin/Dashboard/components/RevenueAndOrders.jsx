import React from 'react';
import { Card, Row, Col, Select, Divider, List, Badge, Skeleton } from 'antd';
import {
  ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { LoadingOutlined } from '@ant-design/icons';
import { useRevenueData } from '../../../../hooks/useDashboardData';

const { Option } = Select;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function RevenueAndOrders() {
  const {
    timeFrame, setTimeFrame,
    series, status,
    loading
  } = useRevenueData('monthly');

  return (
    <Card
      title="Revenue & Orders"
      style={{ marginBottom: 16 }}
      extra={
        <Select
          value={timeFrame}
          onChange={setTimeFrame}
          disabled={loading}
          suffixIcon={loading ? <LoadingOutlined spin /> : undefined}
          style={{ width: 120 }}
        >
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
      }
    >
      {/* Line Chart */}
      <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={series} margin={{ top:5, right:30, left:20, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left"  type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }}/>
            <Line yAxisId="right" type="monotone" dataKey="orders"  stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Skeleton>

      <Divider>Order Status</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Skeleton loading={loading} active paragraph={{ rows: 7 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={status}
                  cx="50%" cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="status" 
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {status.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                {/* <Tooltip formatter={(value) => [`${value} orders`]}/> */}
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </Skeleton>
        </Col>
        <Col span={12}>
          <List
            dataSource={status}
            renderItem={(item, i) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={COLORS[i % COLORS.length]} />}
                  title={item.status}
                />
                <div>{item.count} orders</div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
}
