import { Card, Tabs, Row, Col, Statistic, Progress, Typography, Divider } from 'antd';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const { Text } = Typography;

const Customers = ({ mockCustomerData }) => {
  return (
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
};

export default Customers; 