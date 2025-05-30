import { useState, useEffect, useMemo, useCallback } from 'react';
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
import debounce from 'lodash/debounce';
import './Product.scss';
import { getAllProducts } from '../../../services/productService';
import { buildCloudinaryUrl, currencyFormat } from '../../../utils/helper';
import { getAllCategories } from '../../../services/categoryService';
import { getAllBrands } from '../../../services/brandService';
import { getAllSuppliers } from '../../../services/supplierService';
import {
  AppstoreOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ShopOutlined,
  TrademarkCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useOutlet } from 'react-router-dom';
import { STATUS_PRODUCT, STATUS_PRODUCT_OPTIONS } from '../../../constants/productConstant';

const { Title } = Typography;
const { Option } = Select;

const ProductManager = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: undefined,
    categoryId: undefined,
    brandId: undefined,
    supplierId: undefined,
    searchText: '',
    stock: undefined,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const statusOptions = useMemo(
    () => [
      { value: null, label: 'All Status' },
      ...STATUS_PRODUCT.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    ],
    []
  );

  const stockOptions = useMemo(
    () => [
      { value: null, label: 'All Stock' },
      { value: 'in_stock', label: 'In Stock' },
      { value: 'out_of_stock', label: 'Out of Stock' },
    ],
    []
  );

  const categoryOptions = useMemo(() => {
    return [
      { value: null, label: 'All Categories' },
      ...categories.map((category) => ({
        value: category.categoryID,
        label: category.name,
      })),
    ];
  }, [categories]);

  const brandOptions = useMemo(() => {
    return [
      { value: null, label: 'All Brands' },
      ...brands.map((brand) => ({
        value: brand.brandID,
        label: brand.name,
      })),
    ];
  }, [brands]);

  const supplierOptions = useMemo(() => {
    return [
      { value: null, label: 'All Suppliers' },
      ...suppliers.map((supplier) => ({
        value: supplier.supplierID,
        label: supplier.supplierName,
      })),
    ];
  }, [suppliers]);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [brandResponse, categoryResponse, supplierResponse] = await Promise.all([
          getAllBrands(),
          getAllCategories(),
          getAllSuppliers(),
        ]);
        
        if (brandResponse.statusCode === 200) setBrands(brandResponse.data);
        if (categoryResponse.statusCode === 200) setCategories(categoryResponse.data);
        if (supplierResponse.statusCode === 200) setSuppliers(supplierResponse.data);
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
        const params = {
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
          forceReload: 1
        };
        
        // Only add parameters if they have actual values (not null, undefined, or empty string)
        if (filters.status) params.status = filters.status;
        if (filters.categoryId) params.categoryIds = [filters.categoryId];
        if (filters.brandId) params.brandIds = [filters.brandId];
        if (filters.supplierId) params.supplierIds = [filters.supplierId];
        if (filters.searchText && filters.searchText.trim() !== '') params.searchText = filters.searchText;
        if (filters.stock) params.stock = filters.stock;
        
        console.log("Fetch params:", JSON.stringify(params));
        const productResponse = await getAllProducts(params);
        
        if (productResponse.statusCode === 200) {
          const { items, totalElements, currentPage, pageSize } = productResponse.data;
          console.log('Response data:', productResponse.data);
          console.log('Total elements:', totalElements);
          setProducts(items);
          setPagination((prev) => ({
            ...prev,
            currentPage: currentPage || pagination.currentPage,
            pageSize: pageSize || pagination.pageSize,
            totalElements: totalElements,
            totalPages: Math.ceil(totalElements / (pageSize || pagination.pageSize)),
          }));
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

  const fetchFilteredProducts = useCallback(
  debounce(async (filters, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        forceReload: 1
      };
      
      // Only add parameters if they have actual values (not null, undefined, or empty string)
      if (filters.status) params.status = filters.status;
      if (filters.categoryId) params.categoryIds = [filters.categoryId];
      if (filters.brandId) params.brandIds = [filters.brandId];
      if (filters.supplierId) params.supplierIds = [filters.supplierId];
      if (filters.searchText && filters.searchText.trim() !== '') params.searchText = filters.searchText;
      if (filters.stock) params.stock = filters.stock;
      
      console.log('Filter params:', JSON.stringify(params));
      const productResponse = await getAllProducts(params);
      if (productResponse.statusCode === 200) {
        const { items, totalElements, currentPage, pageSize } = productResponse.data;
        console.log('Response data full:', productResponse.data);
        console.log('Total elements:', totalElements);
        setProducts(items);
        setPagination({
          currentPage: currentPage || page,
          pageSize: pageSize || pageSize,
          totalElements: totalElements,
          totalPages: Math.ceil(totalElements / pageSize),
        });
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      message.error('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, 500),
  []
);

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
  
    return products.map((product) => ({
      ...product,
      key: product.productID.toString(),
      categoryName: categoryMap[product.categoryID] || 'Unknown',
      brandName: brandMap[product.brandID] || 'Unknown',
      supplierName: supplierMap[product.supplierID] || 'Unknown',
    }));
  }, [products, categories, brands, suppliers]);


  const handleEditClick = (record) => {
    return {
      onClick: () => {
        navigate(`/admin/products/${record.productID}/edit`, {
          state: { customer: record, refresh: true },
        });
      },
    };
  };
  const handleCreateClick = () => {
    navigate('/admin/products/create');
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    setPagination((prev) => ({ ...prev, currentPage: current, pageSize }));
    fetchFilteredProducts(filters, current, pageSize);
  };

  const handleFilterChange = (filterType, value) => {
    // If value is null, undefined, or empty string, treat it as a "select all" option
    setFilters((prev) => {
      const newFilters = { 
        ...prev, 
        [filterType]: value === null || value === undefined || value === '' ? null : value 
      };
      fetchFilteredProducts(newFilters, 1, pagination.pageSize);
      return newFilters;
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };
  
  const handleSearch = (value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, searchText: value };
      fetchFilteredProducts(newFilters, 1, pagination.pageSize);
      return newFilters;
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: undefined,
      categoryId: undefined,
      brandId: undefined,
      supplierId: undefined,
      searchText: '',
      stock: undefined,
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchFilteredProducts({}, 1, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (_, record) => {
        const firstImage = record.productDetails && record.productDetails.length > 0
          ? "project_ShoeStore/ImageProduct" + record.productDetails[0].image
          : null;
        return (
          <Space>
            {firstImage && (
              <img
                src={buildCloudinaryUrl(firstImage, { width: 70, height: 60, crop: 'fill' })}
                alt={record.productName}
                style={{ borderRadius: '50%', marginRight: 8 }}
              />
            )}
            <div style={{ fontWeight: 500 }}>{record.productName}</div>
          </Space>
        );
      },
    },
    { title: 'Category', dataIndex: 'categoryName', key: 'category' },
    { title: 'Brand', dataIndex: 'brandName', key: 'brand', align: 'center' },
    { title: 'Supplier', dataIndex: 'supplierName', key: 'supplier', align: 'center' },
    {
      title: 'Quantity',
      dataIndex: 'productDetails',
      key: 'quantity',
      align: 'center',
      render: (details) =>
        Array.isArray(details) && details.length > 0
          ? details.reduce((acc, cur) => acc + cur.stockQuantity, 0)
          : 0,
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
        const statusOption = STATUS_PRODUCT_OPTIONS.find(option => option.value === status);
        const color = statusOption ? statusOption.color : 'default';     
        return (
          <Tag color={color} style={{ fontSize: 12, padding: '4px 8px' }}>
            {statusOption ? statusOption.label : status} 
          </Tag>
        );
      },
    }
  ];

  const ProductListHeader = ({
    filters,
    handleFilterChange,
    statusOptions,
    stockOptions,
    categoryOptions,
    brandOptions,
    supplierOptions,
    handleCreateClick,
    handleResetFilters,
    handleSearch,
  }) => (
    <Card style={{ marginBottom: 16, padding: 0, background: '#f5f6f7' }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Product List</Title>
        </Col>
        <Col span={6}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            style={{
              width: '80%',
              background: 'linear-gradient(90deg, rgb(46, 20, 246), rgb(74, 104, 195))',
              border: 'none',
            }}
          >
            Create New Product
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label={<Space><FilterOutlined /> <span>Status</span></Space>}>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                placeholder="Select Status"
                style={{ width: '100%' }}
              >
                {statusOptions.map((option, index) => (
                  <Option key={`${option.value}-${index}`} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label={<Space><FilterOutlined /> <span>Stock</span></Space>}>
              <Select
                value={filters.stock}
                onChange={(value) => handleFilterChange('stock', value)}
                placeholder="Select Stock"
                style={{ width: '100%' }}
              >
                {stockOptions.map((option, index) => (
                  <Option key={`${option.value}-${index}`} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form layout="vertical">
            <Form.Item label={<Space><span>Search By name</span></Space>}>
              <Input.Search
                placeholder="Search products by name..."
                allowClear
                onSearch={handleSearch}
                onChange={(e) => e.target.value === '' && handleSearch('')}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label={<Space><AppstoreOutlined /> <span>Category</span></Space>}>
              <Select
                value={filters.categoryId}
                onChange={(value) => handleFilterChange('categoryId', value)}
                placeholder="Select Category"
                loading={categoryOptions.length === 0}
                style={{ width: '100%' }}
              >
                {categoryOptions.map((option, index) => (
                  <Option key={`${option.value}-${index}`} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label={<Space><TrademarkCircleOutlined /> <span>Brand</span></Space>}>
              <Select
                value={filters.brandId}
                onChange={(value) => handleFilterChange('brandId', value)}
                placeholder="Select Brand"
                loading={brandOptions.length === 0}
                style={{ width: '100%' }}
              >
                {brandOptions.map((option,index) => (
                  <Option key={`${option.value}-${index}`} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label={<Space><ShopOutlined /> <span>Supplier</span></Space>}>
              <Select
                value={filters.supplierId}
                onChange={(value) => handleFilterChange('supplierId', value)}
                placeholder="Select Supplier"
                loading={supplierOptions.length === 0}
                style={{ width: '100%' }}
              >
                {supplierOptions.map((option, index) => (
                  <Option key={`${option.value}-${index}`} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          <Form layout="vertical">
            <Form.Item label={<Space></Space>}>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters} style={{ width: '100%' }}>
                Reset Filters
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
  if (outlet) {
    return outlet;
  }
  return (
    <div className="product-list">
      <Card className="product-list__card">
        <ProductListHeader
          filters={filters}
          handleFilterChange={handleFilterChange}
          statusOptions={statusOptions}
          stockOptions={stockOptions}
          categoryOptions={categoryOptions}
          brandOptions={brandOptions}
          supplierOptions={supplierOptions}
          handleCreateClick={handleCreateClick}
          handleResetFilters={handleResetFilters}
          handleSearch={handleSearch}
        />
        <Table
          onRow={handleEditClick}
          columns={columns}
          dataSource={enhancedProducts}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalElements,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowClassName="clickable-row"
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      
    </div>
  );
};

export default ProductManager;