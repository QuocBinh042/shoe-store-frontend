import { useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Row,
  Col,
  Card,
  Modal,
  message,
  Upload,
} from 'antd';
import { EyeOutlined, LeftOutlined, UploadOutlined } from '@ant-design/icons';
import Variant from './Variant';
import EditVariantModal from './EditVariantModal';
import { getAllBrands } from '../../../../services/brandService';
import { getAllCategories } from '../../../../services/categoryService';
import { getAllSuppliers } from '../../../../services/supplierService';
import { createProduct, fetchProductById, updateProduct } from '../../../../services/productService';
import { createProductDetail } from '../../../../services/productDetailService'; // Thêm import
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const ProductForm = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isEditVariantModalOpen, setIsEditVariantModalOpen] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchProduct = async () => {
        try {
          const response = await fetchProductById(id);
          if (response) {
            setProduct(response);
          } else {
            message.error('Product not found');
            navigate('/admin/products');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          message.error('Error fetching product details');
          navigate('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [mode, id, navigate]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.productName,
        description: product.description,
        price: product.price,
        status: product.status || 'Available',
        categoryID: product.categoryID,
        brandID: product.brandID,
        supplierID: product.supplierID,
      });
      setVariants(product.productDetails || []);
    } else if (mode !== 'edit') {
      form.resetFields();
      setVariants([]);
    }
    setFormErrors({});
  }, [product, form, mode]);

  useEffect(() => {
    if (product && product.imageURL && product.imageURL.length > 0) {
      const initialFileList = product.imageURL.map((url, index) => ({
        uid: `-${index}`,
        name: `Image ${index + 1}`,
        status: 'done',
        url,
        thumbUrl: url,
      }));
      setFileList(initialFileList);
    } else {
      setFileList([]);
    }
  }, [product]);

  const categoryOptions = useMemo(() =>
    categories.map(category => ({ value: category.categoryID, label: category.name })),
    [categories]
  );

  const brandOptions = useMemo(() =>
    brands.map(brand => ({ value: brand.brandID, label: brand.name })),
    [brands]
  );

  const supplierOptions = useMemo(() =>
    suppliers.map(supplier => ({ value: supplier.supplierID, label: supplier.supplierName })),
    [suppliers]
  );

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
        message.error('Unable to load static data. Please refresh the page.');
      }
    };
    fetchStaticData();
  }, []);

  const handleFinish = async (values) => {
    setFormErrors({});

    const imageURLs = fileList
      .filter(file => file.status === 'done' && (file.url || file.response))
      .map(file => file.url || (file.response && file.response.url));

    const productData = {
      productName: values.productName,
      imageURL: imageURLs,
      description: values.description || '',
      price: values.price,
      status: values.status || 'Available',
      brandID: values.brandID,
      categoryID: values.categoryID,
      supplierID: values.supplierID,
    };

    setSubmitting(true);
    try {
      let productId;
      if (mode === 'edit') {
        await updateProduct(product.productID, productData);
        productId = product.productID;
        message.success('Product updated successfully');
      } else {
        const response = await createProduct(productData);
        productId = response.data.productID; 
        message.success('Product created successfully');

        for (const variant of variants) {
          const variantData = {
            productID: productId,
            size: variant.size,
            color: variant.color,
            stockQuantity: variant.stockQuantity || variant.stock || 0,
            status: variant.status || 'Enabled',
          };
          await createProductDetail(variantData);
        }
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error submitting product:', error);
      message.error('Unable to save product. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList: fileList,
    onChange: handleUploadChange,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          file.url = reader.result;
          resolve(file);
        };
      });
    },
    onPreview: async (file) => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.writeln(image.outerHTML);
    },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess({ url: URL.createObjectURL(file) });
      }, 1000);
    },
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleEditVariant = (record) => {
    setEditingVariant(record);
    setIsEditVariantModalOpen(true);
  };

  const handleAddVariant = () => {
    setEditingVariant(null);
    setIsEditVariantModalOpen(true);
  };

  const handleVariantFinish = (updatedVariant) => {
    if (updatedVariant.productDetailID) {
      setVariants(prev =>
        prev.map(v => (v.productDetailID === updatedVariant.productDetailID ? updatedVariant : v))
      );
    } else {
      setVariants(prev => [...prev, { ...updatedVariant, productDetailID: Date.now() }]); // Tạo ID tạm
    }
    setIsEditVariantModalOpen(false);
  };

  const handlePromotionDetails = () => {
    const promo = form.getFieldValue('promotionID');
    const details = { name: 'Promo 1', discountPercentage: 20 };
    Modal.info({
      title: 'Promotion Details',
      content: (
        <div>
          <Row>
            <Col span={12}><strong>Name:</strong></Col>
            <Col span={12}>{details.name}</Col>
          </Row>
          <Row>
            <Col span={12}><strong>Discount:</strong></Col>
            <Col span={12}>{details.discountPercentage}%</Col>
          </Row>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <div style={{ padding: 16, background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button onClick={() => navigate('/admin/products')} style={{ marginRight: 16 }}>
          <LeftOutlined />
        </Button>
        <h2 style={{ margin: 0 }}>{mode === 'edit' ? 'Edit Product' : 'Create Product'}</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={10}>
          <Col span={16}>
            <Card style={{ marginBottom: 24 }}>
              <h3 style={{ marginTop: 0 }}>Product Information</h3>
              <Form.Item
                label="Name"
                name="productName"
                rules={[{ required: true, message: 'Please enter product name' }]}
                validateStatus={formErrors.productName ? 'error' : undefined}
                help={formErrors.productName}
              >
                <Input placeholder="Product Name" />
              </Form.Item>
              <Form.Item
                label="Description (Optional)"
                name="description"
                validateStatus={formErrors.description ? 'error' : undefined}
                help={formErrors.description}
              >
                <TextArea rows={4} placeholder="Product Description" />
              </Form.Item>
              <Form.Item
                label="Product Images"
                validateStatus={formErrors.imageURL ? 'error' : undefined}
                help={formErrors.imageURL}
              >
                <Upload {...uploadProps}>
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <div style={{ marginTop: 8, color: '#999' }}>
                  Upload product images (supports JPG, PNG)
                </div>
              </Form.Item>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ marginBottom: 8 }}>
              <h3 style={{ marginTop: 0 }}>Sales Information</h3>
              <Form.Item
                name="price"
                label="Price (VND)"
                rules={[{ required: true, message: 'Please enter price' }]}
                validateStatus={formErrors.price ? 'error' : undefined}
                help={formErrors.price}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter price" min={0} />
              </Form.Item>
              <Form.Item name="promotionID" label="Promotion">
                <div style={{ display: 'flex', gap: 5 }}>
                  <Select placeholder="Select promotion (optional)">
                    <Option value={1}>Promo 1</Option>
                    <Option value={2}>Promo 2</Option>
                    <Option value={3}>Promo 3</Option>
                  </Select>
                  <Button type="default" onClick={handlePromotionDetails}>
                    <EyeOutlined />
                  </Button>
                </div>
              </Form.Item>
              <Form.Item name="discountPrice" label="Discount Price">
                <Input placeholder="Discount price" disabled style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                validateStatus={formErrors.status ? 'error' : undefined}
                help={formErrors.status}
              >
                <Select placeholder="Select status" defaultValue="Available">
                  <Option value="Available">Available</Option>
                  <Option value="Out of Stock">Out of Stock</Option>
                  <Option value="Coming Soon">Coming Soon</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Variant
          variants={variants}
          onEditVariant={handleEditVariant}
          onAddVariant={handleAddVariant}
          error={formErrors.productDetails}
        />
        <EditVariantModal
          open={isEditVariantModalOpen}
          variant={editingVariant}
          onCancel={() => setIsEditVariantModalOpen(false)}
          onFinish={handleVariantFinish}
          productId={product?.productID || 0}
        />

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={() => navigate('/admin/products')} style={{ marginRight: 16 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {mode === 'edit' ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;