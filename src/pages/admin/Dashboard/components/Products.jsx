import { Card, Tabs, List, Button, Tag, Progress } from 'antd';

const Products = ({ loading, bestSellers }) => {
  return (
    <Card title="Products" style={{ marginBottom: '16px' }}>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Best Sellers",
          children: (
            <List
              loading={loading}
              dataSource={bestSellers}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">View Details</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.sold} sold • $${item.price}`}
                  />
                  <div>${item.revenue.toLocaleString()}</div>
                </List.Item>
              )}
            />
          )
        },
        {
          key: "2",
          label: "Stock Alerts",
          children: (
            <List
              loading={loading}
              dataSource={bestSellers.map(item => ({ ...item, stock: Math.floor(Math.random() * 10) }))}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" ghost>Restock</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.stock} units remaining`}
                  />
                  <Tag color={item.stock < 10 ? "error" : "warning"}>
                    {item.stock < 10 ? "Low Stock" : "Getting Low"}
                  </Tag>
                </List.Item>
              )}
            />
          )
        },
        {
          key: "3",
          label: "Performance",
          children: (
            <List
              loading={loading}
              dataSource={bestSellers.map(item => ({ 
                ...item, 
                views: Math.floor(Math.random() * 1000) + 500,
                conversion: (Math.random() * 5 + 2).toFixed(1)
              }))}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.views} views • ${item.conversion}% conversion`}
                  />
                  <Progress 
                    percent={parseFloat(item.conversion) * 10} 
                    size="small" 
                    status={parseFloat(item.conversion) > 4 ? "success" : "normal"} 
                  />
                </List.Item>
              )}
            />
          )
        }
      ]} />
    </Card>
  );
};

export default Products; 