import { Card, Tabs, Row, Col, Statistic, Progress, List, Button, Tag, Alert, Table } from 'antd';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const ShippingAndInventory = () => {
  return (
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
};

export default ShippingAndInventory; 