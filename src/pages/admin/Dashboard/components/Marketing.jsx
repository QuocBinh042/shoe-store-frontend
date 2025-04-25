import { Card, Tabs, Table } from 'antd';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Marketing = ({ mockMarketingData }) => {
  return (
    <Card title="Marketing" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Traffic Sources",
          children: (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockMarketingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockMarketingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )
        },
        {
          key: "2",
          label: "Campaigns",
          children: (
            <Table
              dataSource={[
                {
                  key: '1',
                  name: 'Summer Sale',
                  impressions: 45000,
                  clicks: 3200,
                  conversions: 320,
                  revenue: 28640,
                  roi: 574,
                },
                {
                  key: '2',
                  name: 'Back to School',
                  impressions: 32000,
                  clicks: 2100,
                  conversions: 180,
                  revenue: 14400,
                  roi: 380,
                },
                {
                  key: '3',
                  name: 'New Collection',
                  impressions: 28000,
                  clicks: 1800,
                  conversions: 200,
                  revenue: 18000,
                  roi: 450,
                },
              ]}
              columns={[
                {
                  title: 'Campaign',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Impressions',
                  dataIndex: 'impressions',
                  key: 'impressions',
                  render: val => val.toLocaleString(),
                },
                {
                  title: 'Clicks',
                  dataIndex: 'clicks',
                  key: 'clicks',
                  render: val => val.toLocaleString(),
                },
                {
                  title: 'Conversions',
                  dataIndex: 'conversions',
                  key: 'conversions',
                  render: val => val.toLocaleString(),
                },
                {
                  title: 'Revenue',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  render: val => `$${val.toLocaleString()}`,
                },
                {
                  title: 'ROI',
                  dataIndex: 'roi',
                  key: 'roi',
                  render: val => `${val}%`,
                },
              ]}
              pagination={false}
              size="small"
            />
          )
        }
      ]} />
    </Card>
  );
};

export default Marketing; 