import { useState, useEffect, useMemo } from 'react';
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
  Form,
  message,
} from 'antd';
import './Product.scss';
import ProductForm from './Form/ProductForm';
import { getAllProducts } from '../../../services/productService';
import { buildCloudinaryUrl, currencyFormat } from '../../../utils/helper';
import { getAllCategories } from '../../../services/categoryService';
import { getAllBrands } from '../../../services/brandService';
import { getAllSuppliers } from '../../../services/supplierService';
import { AppstoreOutlined, FilterOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, ShopOutlined, TrademarkCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    status: undefined,
    categoryId: undefined,
    brandId: undefined,
    supplierId: undefined,
    searchText: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const statusOptions = useMemo(() => [
    { value: undefined, label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Scheduled', label: 'Scheduled' }
  ], []);

  const categoryOptions = useMemo(() => [
    { value: undefined, label: 'All Categories' },
    ...categories.map(category => ({
      value: category.categoryID,
      label: category.name
    }))
  ], [categories]);

  const brandOptions = useMemo(() => [
    { value: undefined, label: 'All Brands' },
    ...brands.map(brand => ({
      value: brand.brandID,
      label: brand.name
    }))
  ], [brands]);

  const supplierOptions = useMemo(() => [
    { value: undefined, label: 'All Suppliers' },
    ...suppliers.map(supplier => ({
      value: supplier.supplierID,
      label: supplier.supplierName
    }))
  ], [suppliers]);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [brandResponse, categoryResponse, supplierResponse] = await Promise.all([
          getAllBrands(),
          getAllCategories(),
          getAllSuppliers(),
        ]);
        if (brandResponse.statusCode === 200) {
          setBrands(brandResponse.data);
        }
        if (categoryResponse.statusCode === 200) {
          setCategories(categoryResponse.data);
        }
        if (supplierResponse.statusCode === 200) {
          setSuppliers(supplierResponse.data);
        }
      } catch (error) {
        console.error('Error fetching static data:', error);
        message.error('Không thể tải dữ liệu tĩnh. Vui lòng làm mới trang.');
      }
    };
    fetchStaticData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filterParams = {};
        if (filters.status) filterParams.status = filters.status;
        if (filters.categoryId) filterParams.categoryId = filters.categoryId;
        if (filters.brandId) filterParams.brandId = filters.brandId;
        if (filters.supplierId) filterParams.supplierId = filters.supplierId;
        if (filters.searchText) filterParams.search = filters.searchText;

        const queryParams = {
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...filterParams
        };

        const productResponse = await getAllProducts(queryParams);
        const productData = productResponse.data;
        if (productData && productData.items) {
          setProducts(productData.items);
          setPagination({
            currentPage: productData.currentPage || queryParams.page,
            pageSize: productData.pageSize || queryParams.pageSize,
            totalElements: productData.totalElements,
            totalPages: productData.totalPages,
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  const enhancedProducts = useMemo(() => {
    const categoryMap = categories.reduce((map, category) => {
      map[category.categoryID] = category.name;
      return map;
    }, {});
    const brandMap = brands.reduce((map, brand) => {
      map[brand.brandID] = brand.name;
      return map;
    }, {});
    const supplierMap = suppliers.reduce((map, supplier) => {
      map[supplier.supplierID] = supplier.supplierName;
      return map;
    }, {});

    return products.map(product => ({
      ...product,
      key: product.productID.toString(),
      categoryName: categoryMap[product.categoryID] || 'Unknown',
      brandName: brandMap[product.brandID] || 'Unknown',
      supplierName: supplierMap[product.supplierID] || 'Unknown',
    }));
  }, [products, categories, brands, suppliers]);

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
    setShowForm(false);
    setSelectedProduct(null);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      currentPage: paginationInfo.current,
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, searchText: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: undefined,
      categoryId: undefined,
      brandId: undefined,
      supplierId: undefined,
      searchText: '',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (_, record) => (
        <Space onClick={() => handleEditClick(record)} style={{ cursor: 'pointer' }}>
          {record.imageURL && record.imageURL.length > 0 && (
            <img
              src={buildCloudinaryUrl(record.imageURL[0], { width: 40, height: 40, crop: 'fill' })}
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
      dataIndex: 'categoryName',
      key: 'category',
    },
    {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brand',
      align: 'center',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplier',
      align: 'center',
    },
    {
      title: 'Quantity',
      dataIndex: 'productDetails',
      key: 'quantity',
      align: 'center',
      render: (details) => {
        if (Array.isArray(details) && details.length > 0) {
          return details.reduce((acc, cur) => acc + cur.stockQuantity, 0);
        }
        return 0;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => <span>{currencyFormat(price)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        let color = 'green';
        if (status === 'Inactive') color = 'red';
        else if (status === 'Scheduled') color = 'gold';
        return (
          <Tag color={color} style={{ fontSize: 12, padding: '4px 8px' }}>
            {status}
          </Tag>
        );
      },
    },
  ];

  const ProductListHeader = ({
    filters,
    handleFilterChange,
    statusOptions,
    categoryOptions,
    brandOptions,
    supplierOptions,
    handleCreateClick,
    handleResetFilters,
    handleSearch,
  }) => {
    return (
      <Card style={{ marginBottom: 16, padding: 0, background: '#f5f6f7' }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Product List
            </Title>
          </Col>
          
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Form layout="vertical">
              <Form.Item
                label={<Space><FilterOutlined /> <span>Status</span></Space>}
              >
                <Select
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  placeholder="Select Status"
                  style={{ width: '100%' }}
                >
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}>
            <Form layout="vertical">
              <Form.Item
                label={<Space><AppstoreOutlined /> <span>Category</span></Space>}
              >
                <Select
                  value={filters.categoryId}
                  onChange={(value) => handleFilterChange('categoryId', value)}
                  placeholder="Select Category"
                  loading={categoryOptions.length === 0}
                  style={{ width: '100%' }}
                >
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}>
            <Form layout="vertical">
              <Form.Item
                label={<Space><TrademarkCircleOutlined /> <span>Brand</span></Space>}
              >
                <Select
                  value={filters.brandId}
                  onChange={(value) => handleFilterChange('brandId', value)}
                  placeholder="Select Brand"
                  loading={brandOptions.length === 0}
                  style={{ width: '100%' }}
                >
                  {brandOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}>
            <Form layout="vertical">
              <Form.Item
                label={<Space><ShopOutlined /> <span>Supplier</span></Space>}
              >
                <Select
                  value={filters.supplierId}
                  onChange={(value) => handleFilterChange('supplierId', value)}
                  placeholder="Select Supplier"
                  loading={supplierOptions.length === 0}
                  style={{ width: '100%' }}
                >
                  {supplierOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form layout="horizontal">
              <Form.Item
                // label={<Space><span>Search By name</span></Space>}
              >
                <Input.Search
                  placeholder="Search products by name..."
                  allowClear
                  onSearch={handleSearch}
                  onChange={(e) => e.target.value === '' && handleSearch('')}

                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={6} >
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              style={{ marginTop: 'auto', width: '100%' }}
            >
              Reset Filters
            </Button>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateClick}
              style={{
                width: '100%',
                background: 'linear-gradient(90deg,rgb(46, 20, 246),rgb(74, 104, 195))',
                border: 'none'
              }}
            >
              Create New Product
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  if (showForm) {
    return (
      <ProductForm
        product={selectedProduct}
        onBack={handleBack}
        onSubmit={handleFormSubmit}
        categories={categories}
        brands={brands}
        suppliers={suppliers}
      />
    );
  }

  return (
    <div className="product-list">
      <Card className="product-list__card">
        <ProductListHeader
          filters={filters}
          handleFilterChange={handleFilterChange}
          statusOptions={statusOptions}
          categoryOptions={categoryOptions}
          brandOptions={brandOptions}
          supplierOptions={supplierOptions}
          handleCreateClick={handleCreateClick}
          handleResetFilters={handleResetFilters}
          handleSearch={handleSearch}
        />
        <Table
          columns={columns}
          dataSource={enhancedProducts}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalElements,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default ProductManager;