// src/pages/admin/dashboard/ShippingAndInventory.jsx
import React from 'react';
import {
  Card, Tabs, Row, Col, Statistic, Progress, List,
  Button, Tag, Alert, Table, Spin
} from 'antd';
import {
  ResponsiveContainer, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useInventoryForecast } from '../../../../hooks/useDashboardData';

const ShippingAndInventory = () => {
  const {
    items,
    totalElements,
    page,
    pageSize,
    loading,
    setPage,
    setPageSize,
    refetch
  } = useInventoryForecast();

  const inventoryColumns = [
    { title: 'Product', dataIndex: 'productName', key: 'productName' },
    { title: 'Current Stock', dataIndex: 'currentStock', key: 'currentStock' },
    { title: 'Total Sold', dataIndex: 'totalSold', key: 'totalSold' },
    { title: 'Stock-to-Sales (%)', dataIndex: 'stockToSalesRatio', key: 'stockToSalesRatio' },
    {
      title: 'Restock Urgency', dataIndex: 'restockUrgency', key: 'restockUrgency',
      render: urgency => {
        const colorMap = { Critical: 'red', High: 'orange', Medium: 'blue', Low: 'green' };
        return <Tag color={colorMap[urgency] || 'gray'}>{urgency}</Tag>;
      }
    },
    { title: 'Action', key: 'action', render: () => <Button size="small" onClick={refetch}>Reorder</Button> }
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Shipping Performance',
      children: (
        <>
          {/* Shipping Performance UI unchanged */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Average Shipping Times (Days)">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: 'FedEx', value: 2.3 },
                      { name: 'UPS', value: 2.5 },
                      { name: 'USPS', value: 3.1 },
                      { name: 'DHL', value: 3.8 }
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
                <Statistic value={94.8} suffix="%" valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
                <Progress percent={94.8} status="success" />
                <div style={{ marginTop: 10 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic title="On Time" value={98.2} suffix="%" valueStyle={{ fontSize: 16 }} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Complete" value={96.5} suffix="%" valueStyle={{ fontSize: 16 }} />
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <List
                header={<div><strong>Recent Shipping Issues</strong></div>}
                bordered
                dataSource={[] /* TODO: integrate shipping issues hook */}
                renderItem={item => (
                  <List.Item actions={[<Button size="small" type="link">Resolve</Button>]}>  
                    <List.Item.Meta
                      avatar={<ClockCircleOutlined style={{ color: '#f5222d' }} />}
                      title={`${item.orderCode} - ${item.issue}`}
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
      key: '2',
      label: 'Inventory Forecast',
      children: (
        <>
          <Alert
            message="Inventory Forecast"
            description="Based on current stock and sales data, see restock urgency for each product."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          {loading ? (
            <Spin />
          ) : (
            <Table
              dataSource={items}
              columns={inventoryColumns}
              rowKey="productName"
              size="small"
              pagination={{
                current: page,
                pageSize,
                total: totalElements,
                showSizeChanger: true,
                onChange: (newPage, newSize) => {
                  setPage(newPage);
                  setPageSize(newSize);
                }
              }}
              loading={loading}
            />
          )}
        </>
      )
    }
  ];

  return (
    <Card title="Shipping & Inventory" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Card>
  );
};

export default ShippingAndInventory;