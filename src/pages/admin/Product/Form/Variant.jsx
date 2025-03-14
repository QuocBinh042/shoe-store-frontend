import { useState } from 'react';
import { Card, Table, Button, Tag } from 'antd';
import EditVariantModal from './EditVariantModal';

const Variant = ({ variants, onEditVariant, onAddVariant }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const handleEditClick = (variant) => {
    setEditingVariant(variant);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (variant) => {
    setEditingVariant(variant);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingVariant(null);
  };

  const handleModalFinish = (updatedVariant) => {
    onEditVariant(updatedVariant);
    setIsModalVisible(false);
    setEditingVariant(null);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      render: (src) => (
        <img
          src={src}
          alt="variant"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      align: 'center',
      render: (color) => (
        <>
          {color}
          <span style={{ backgroundColor: color, display: 'inline-block', width: '10px', height: '10px', marginLeft: '5px' }} />
        </>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        <Tag color={status === 'Enabled' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEditClick(record)}
            style={{ marginRight: '10px' }}
          >
            Edit
          </Button>
          <Button
            type="text"
            onClick={() => handleDeleteClick(record)}
            style={{ color: 'red' }}
          >
            Delete
          </Button>
        </>

      ),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <h3>Variant</h3>
        <Table
          columns={columns}
          dataSource={variants}
          pagination={false}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={onAddVariant}>
          Add Variant
        </Button>
      </Card>
      <EditVariantModal
        open={isModalVisible}
        variant={editingVariant}
        onCancel={handleModalCancel}
        onFinish={handleModalFinish}
      />
    </>
  );
};

export default Variant;
