import { Card, Col, Row, Statistic, Typography } from 'antd';
const { Text } = Typography;

const OrderStats = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: '16px' }}>
      {stats.map((stat) => (
        <Col xs={24} sm={12} lg={6} key={stat.title}>
          <Card
            className="stat-card"
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
  );
};

export default OrderStats; 