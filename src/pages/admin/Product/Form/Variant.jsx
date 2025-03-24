import { Button, Card, Table, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const Variant = ({ variants = [], onEditVariant, onAddVariant, error }) => {
  const getStatusColor = (status) => {
    if (status === 'Enabled') return 'green';
    if (status === 'Disabled') return 'red';
    return 'default';
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Variant"
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            N/A
          </div>
        ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <Space>
          {color}
          {color && (
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                backgroundColor: color.toLowerCase(),
                borderRadius: '50%',
                border: '1px solid #ddd',
              }}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) =>
        record.stockQuantity != null ? record.stockQuantity : (record.stock || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => onEditVariant(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h3 style={{ margin: 0 }}>Variants</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddVariant}>
          Add Variant
        </Button>
      </div>

      <Table dataSource={variants} columns={columns} pagination={false} rowKey={(record) => record.productDetailID || record.key || Date.now()} />

      {error && (
        <div style={{ color: '#ff4d4f', marginTop: 8 }}>
          {error}
        </div>
      )}
    </Card>
  );
};

export default Variant;