import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Typography,
} from 'antd';
import {
  DownloadOutlined,
} from '@ant-design/icons';
import './Product.scss';
import ProductForm from './Form/ProductForm';

const { Title } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      description: 'High-performance running shoes.',
      price: 1000000,
      productName: 'Nike Air Max 270',
      status: 'Available',
      brandID: 1,
      categoryID: 1,
      promotionID: 1,
      supplierID: 1,
      createDate: new Date(),
      images: [
        'https://picsum.photos/200/300?random=1',
        'https://picsum.photos/200/300?random=2',
        'https://picsum.photos/200/300?random=1',
        'https://picsum.photos/200/300?random=2',
        'https://picsum.photos/200/300?random=1',
        'https://picsum.photos/200/300?random=2',
      ],
      // details: [
      //   { color: 'RED', size: 'SIZE_36', stockQuantity: 50 },
      //   { color: 'RED', size: 'SIZE_37', stockQuantity: 40 }
      // ],
      sizeOptions: ['SIZE_38', 'SIZE_39'],
      colorOptions: ['RED', 'BLUE'],
      category: 'Running',
      quantity: 10
    },
    {
      id: 2,
      description: 'Lightweight basketball sneakers.',
      price: 1200000,
      productName: 'Adidas Harden Vol. 5',
      status: 'Available',
      brandID: 2,
      categoryID: 2,
      promotionID: 2,
      supplierID: 2,
      createDate: new Date(),
      images: [],
      // details: [],
      category: 'Basketball',
      quantity: 0
    }
  ]);



  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (record) => {
    setSelectedProduct(record);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = (values) => {
    console.log('Submitted values:', values);
    // Nếu có id => cập nhật sản phẩm, ngược lại tạo mới sản phẩm
    if (selectedProduct) {
      // Cập nhật sản phẩm
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, ...values } : p))
      );
    } else {
      // Tạo mới sản phẩm, giả sử id tự tăng
      const newProduct = { ...values, id: products.length + 1 };
      setProducts((prev) => [...prev, newProduct]);
    }
    // Quay lại danh sách
    setShowForm(false);
    setSelectedProduct(null);
  };


  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'product',
      render: (_, record) => (
        <Space onClick={() => handleEditClick(record)} style={{ cursor: 'pointer' }}>
          {record.images.length > 0 && ( // Check if images array is not empty
            <img
              src={record.images[0]}
              alt={record.productName}
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
            />
          )}
          <div style={{ fontWeight: 500 }}>{record.productName}</div>
        </Space>

      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (<span>{category}</span>),
    },
    {
      title: 'Brand',
      dataIndex: 'brandID',
      key: 'brand',
      align: 'center',
      render: (brand) => (<span>{brand}</span>),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierID',
      key: 'supplier',
      align: 'center',
      render: (supplier) => <span>{supplier}</span>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => <span>{price.toLocaleString()}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        let color = 'green';
        if (status === 'Inactive') {
          color = 'red';
        } else if (status === 'Scheduled') {
          color = 'gold';
        }
        return <Tag color={color} style={{ fontSize: 12, padding: '4px 8px' }}>{status}</Tag>;
      },
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   align: 'center',
    //   render: (_, record) => (
    //     <Space>
    //       <EditOutlined style={{ cursor: 'pointer' }}  />
    //       <MoreOutlined style={{ cursor: 'pointer' }} />
    //     </Space>
    //   ),
    // },
  ];
  if (showForm) {
    return (
      <ProductForm
        product={selectedProduct}
        onBack={handleBack}
        onSubmit={handleFormSubmit}
      />
    );
  }
  return (

    <div className="product-list">
      <Card className="product-list__card">
        {/* Filter Section */}
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Filter</Title>
          </Col>
          <Col>
            <Space>
              <Select defaultValue="Select Status" style={{ width: 150 }}>
                <Select.Option value="Select Status">Select Status</Select.Option>
              </Select>
              <Select defaultValue="Category" style={{ width: 150 }}>
                <Select.Option value="Category">Category</Select.Option>
              </Select>
              <Select defaultValue="In Stock" style={{ width: 150 }}>
                <Select.Option value="In Stock">In Stock</Select.Option>
              </Select>
              <Button type="primary" style={{ background: '#7e3af2', borderColor: '#7e3af2' }} onClick={handleCreateClick}>
                + Add Product
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Search Section */}
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input.Search placeholder="Search" allowClear />
          </Col>
          <Col>
            <Space>
              <Select defaultValue="7" style={{ width: 80 }}>
                <Select.Option value="7">7</Select.Option>
                <Select.Option value="10">10</Select.Option>
                <Select.Option value="20">20</Select.Option>
              </Select>
              <Button style={{ border: '1px solid #d9d9d9' }} icon={<DownloadOutlined />}>
                Export
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={products.map(product => ({ ...product, key: product.id.toString() }))}
          pagination={{
            pageSize: 7,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          rowSelection={{}}
        />
      </Card>
    </div>
  );
};

export default ProductList;
