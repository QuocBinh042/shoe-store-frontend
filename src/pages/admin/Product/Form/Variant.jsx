import { Button, Card, Table, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { STATUS_PRODUCT_OPTIONS } from '../../../../constants/productConstant';
import CloudinaryImage from '../../../../utils/cloudinaryImage';

const Variant = ({ variants = [], onEditVariant, onAddVariant, error }) => {
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) =>
        image ? (
          <CloudinaryImage
            publicId={image.includes('project_ShoeStore/ImageProduct/') ? image : `project_ShoeStore/ImageProduct/${image}`}
            alt="Variant"
            options={{ width: 50, height: 50, crop: 'fill' }}
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => {
        const displaySize = size?.replace('SIZE_', '') || '';
        return (
          <Tag
            color="cyan"
            style={{
              fontSize: '14px',
              padding: '6px 10px',
              borderRadius: '12px',
              backgroundColor: '#e6f7ff',
              border: 'none',
            }}
          >
            {displaySize}
          </Tag>
        );
      },
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{color}</span>
          {color && (
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: color.toLowerCase(),
                borderRadius: '50%',
                border: '1px solid #ddd',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) => {
        const stock = record.stockQuantity != null ? record.stockQuantity : (record.stock || 0);
        const color = stock >= 20 ? '#3f8600' : stock > 0 ? '#d46b08' : '#cf1322';
        return <span style={{ color, fontWeight: 500 }}>{stock}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusOption = STATUS_PRODUCT_OPTIONS.find((opt) => opt.value === status);
        return (
          <Tag color={statusOption ? statusOption.color : 'default'}>
            {statusOption ? statusOption.label : status}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEditVariant(record)}
        >
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

      <Table
        dataSource={variants}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.productDetailID || record.key || Date.now()}
      />

      {error && (
        <div style={{ color: '#ff4d4f', marginTop: 8 }}>
          {error}
        </div>
      )}
    </Card>
  );
};

export default Variant;