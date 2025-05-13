import React from 'react';
import {
  Card,
  Tabs,
  Rate,
  Tag,
  Typography,
  Space,
  Button,
  Skeleton,
  Select,
  Pagination,
  List,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useBestSellers, useStockAlerts } from '../../../../hooks/useDashboardData';
import CloudinaryImage from '../../../../utils/cloudinaryImage';
import { currencyFormat } from '../../../../utils/helper';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { Option } = Select;

export default function Products() {
  const {
    limit, setLimit,
    page: bsPage, setPage: setBsPage,
    bestSellers, pagination: bsPag, loading: bsLoading,
  } = useBestSellers(5, 1);

  const {
    threshold, setThreshold,
    page: saPage, setPage: setSaPage,
    stockAlerts, pagination: saPag, loading: saLoading,
  } = useStockAlerts(10, 1);
  const navigate = useNavigate();
  const tabItems = [
    {
      key: '1',
      label: 'Best Sellers',
      children: (
        <div>
          <Skeleton active loading={bsLoading} paragraph={{ rows: 5 }}>
            <div className="five-col-grid">
              {bestSellers.map((item, idx) => (
                <div className="grid-item" key={`${item.productId}-${idx}`}>
                  <Card
                    hoverable
                    className="product-card"
                    bodyStyle={{ padding: 12 }}
                    cover={
                      <div className="product-image-wrapper">
                        <CloudinaryImage
                          publicId={item.imageUrl}
                          alt={item.name}
                          options={{ width: 400, height: 300, crop: 'fill' }}
                          className="product-image"
                        />
                      </div>
                    }
                    actions={[<Button
                      type="link"
                      size="small"
                      onClick={() => navigate(`/admin/products/${item.productId}/edit`)}
                    >
                      Details
                    </Button>]}
                  >
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Title level={5} ellipsis style={{ margin: 0 }}>{item.name}</Title>
                      <Rate disabled allowHalf defaultValue={item.avgRating} style={{ fontSize: 12 }} />
                      <Text style={{ fontSize: 12 }}>Sold: <Text strong>{item.sold}</Text></Text>
                      <Text style={{ fontSize: 12 }}>Price: {currencyFormat(item.price)}</Text>
                      <Text style={{ fontSize: 12 }}>Revenue: {currencyFormat(item.revenue)}</Text>
                      <Space wrap size="small">
                        <Tag color={item.stock < 10 ? 'error' : 'default'} style={{ fontSize: 12 }}>
                          Stock: {item.stock}
                        </Tag>
                        <Tag color={item.growthPercent >= 0 ? 'green' : 'red'} style={{ fontSize: 12 }}>
                          {item.growthPercent.toFixed(1)}%
                        </Tag>
                      </Space>
                    </Space>
                  </Card>
                </div>
              ))}
            </div>
          </Skeleton>
          <div className="pagination-wrapper">
            <Pagination
              current={bsPag.current}
              pageSize={bsPag.pageSize}
              total={bsPag.total}
              onChange={setBsPage}
              showSizeChanger={false}
              size="small"
            />
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: 'Stock Alerts',
      children: (
        <Skeleton active loading={saLoading} paragraph={{ rows: 4 }}>
          <List
            itemLayout="horizontal"
            dataSource={stockAlerts}
            pagination={{
              current: saPag.current,
              pageSize: saPag.pageSize,
              total: saPag.total,
              onChange: setSaPage,
              showSizeChanger: false,
              size: 'small'
            }}
            renderItem={item => (
              <List.Item
                key={item.productId}
                actions={[<Button type="primary" ghost size="small">Restock</Button>]}
              >
                <List.Item.Meta
                  avatar={
                    <CloudinaryImage
                      publicId={item.imageUrl}
                      alt={item.name}
                      options={{ width: 60, height: 60, crop: 'fill' }}
                      className="product-thumb"
                    />
                  }
                  title={<Text strong>{item.name}</Text>}
                  description={`Stock: ${item.stock}`}
                />
                <Tag color={item.stock < 10 ? 'error' : 'warning'}>
                  {item.stock < 10 ? 'Low Stock' : 'Getting Low'}
                </Tag>
              </List.Item>
            )}
          />
        </Skeleton>
      )
    }
  ];

  return (
    <Card
      title="Products"
      className="products-container"
      extra={
        <Space size="middle">
          <span>Top</span>
          <Select
            value={limit}
            onChange={setLimit}
            disabled={bsLoading}
            suffixIcon={bsLoading ? <LoadingOutlined spin /> : undefined}
            style={{ width: 80 }}
          >
            {[5, 10, 20].map(n => <Option key={n} value={n}>{n}</Option>)}
          </Select>
          <span>Low Stock ≤</span>
          <Select
            value={threshold}
            onChange={setThreshold}
            disabled={saLoading}
            suffixIcon={saLoading ? <LoadingOutlined spin /> : undefined}
            style={{ width: 80 }}
          >
            {[5, 10, 20].map(n => <Option key={n} value={n}>{n}</Option>)}
          </Select>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Tabs items={tabItems} />
    </Card>
  );
}
