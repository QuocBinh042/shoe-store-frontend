import { Row, Col, Card, Statistic, Typography } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, UserOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

const KPIOverview = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Revenue"
            value={240560}
            prefix={<DollarOutlined />}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 8.2%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Orders"
            value={2543}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 4.7%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Avg. Order Value"
            value={94.6}
            prefix={<DollarOutlined />}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 3.1%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="New Customers"
            value={368}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600' }}
            suffix={
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                <ArrowUpOutlined /> 12.4%
              </span>
            }
          />
          <div style={{ marginTop: '10px' }}>
            <Text type="secondary">vs. previous period</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default KPIOverview; 