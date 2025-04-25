import { Card, Row, Col, Select, Divider, List, Badge } from 'antd';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RevenueAndOrders = ({ timeFrame, setTimeFrame, mockRevenueData, mockOrderStatusData }) => {
  const getFilteredData = (data) => {
    return data;
  };

  return (
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
};

export default RevenueAndOrders; 