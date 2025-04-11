import React from 'react';
import { Row, Col, Button, Tag, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getStatusColor } from '../../../../constants/orderConstant';

const { Title, Text } = Typography;

const OrderHeader = ({ orderNumber, date, status, onBack }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: 24,
        border: '1px solid #f0f0f0',
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            Back
          </Button>
        </Col>

        <Col flex="auto" style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            🧾 Order #{orderNumber}
          </Title>

          <Space style={{ marginTop: 4 }}>
            {status.map((item, index) => (
              <Tag
                key={index}
                color={getStatusColor(item.label)}
                style={{ padding: '4px 10px', fontSize: 14, borderRadius: 8 }}
              >
                {item.label}
              </Tag>
            ))}
          </Space>

          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Placed on {date}
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderHeader;
