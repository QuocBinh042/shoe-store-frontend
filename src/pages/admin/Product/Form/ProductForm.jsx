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
  message,
  Space,
  Divider,
  Typography,
  Tag,
  Radio,
  Tooltip,
  Modal
} from 'antd';
import {
  AppstoreOutlined,
  LeftOutlined,
  ShopOutlined,
  TrademarkCircleOutlined,
  TagOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import Variant from './Variant';
import EditVariantModal from './EditVariantModal';
import ProductImages from './ProductImages';
import { getAllBrands } from '../../../../services/brandService';
import { getAllCategories } from '../../../../services/categoryService';
import { getAllSuppliers } from '../../../../services/supplierService';
import { createProduct, fetchProductById, updateProduct } from '../../../../services/productService';
import { createProductDetail, updateProductDetail } from '../../../../services/productDetailService';
import { uploadImage } from '../../../../services/uploadService';
import { getAppliedPromotionsForProduct, getDiscountedPrice } from '../../../../services/promotionService';
import { useNavigate, useParams } from 'react-router-dom';
import { currencyFormat } from '../../../../utils/helper';
import { STATUS_PRODUCT_OPTIONS } from '../../../../constants/productConstant';
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

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
  const [productImages, setProductImages] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isEditVariantModalOpen, setIsEditVariantModalOpen] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [tempStatus, setTempStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayStatus, setDisplayStatus] = useState(null);

  const totalStock = useMemo(() => {
    return variants.reduce((sum, variant) => {
      return sum + (variant.stockQuantity != null ? variant.stockQuantity : (variant.stock || 0));
    }, 0);
  }, [variants]);

  const calculatedStatus = useMemo(() => {
    if (totalStock > 20) return 'AVAILABLE';
    if (totalStock > 0 && totalStock <= 20) return 'LIMITED_STOCK';
    return form.getFieldValue('status') || 'UNAVAILABLE';
  }, [totalStock, form]);

  useEffect(() => {
    if (!displayStatus) {
      setDisplayStatus(calculatedStatus);
    }

    const currentStatus = form.getFieldValue('status');
    if (
      mode !== 'edit' ||
      (currentStatus !== 'UNAVAILABLE' && currentStatus !== 'DISCONTINUED')
    ) {
      if (calculatedStatus === 'AVAILABLE' || calculatedStatus === 'LIMITED_STOCK') {
        form.setFieldsValue({ status: calculatedStatus });
        setDisplayStatus(calculatedStatus);
      }
    }
  }, [calculatedStatus, form, mode, displayStatus]);

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchProductAndPromotions = async () => {
        try {
          const response = await fetchProductById(id);
          if (response) {
            setProduct(response);
            setProductImages(response.imageURL ? response.imageURL.map(url => ({ url })) : []);

            const variantsWithImages = response.productDetails && response.productDetails.map(detail => ({
              ...detail,
              image: detail.image || null,
            }));
            

            setVariants(variantsWithImages || []);

            const promoResponse = await getAppliedPromotionsForProduct(id);
            setAppliedPromotions(promoResponse || []);
            const discountedPriceResponse = await getDiscountedPrice(id);
            setDiscountedPrice(discountedPriceResponse || response.price);
          } else {
            message.error('Product not found');
            navigate('/admin/products');
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
          message.error('Error fetching product details');
          navigate('/admin/products');
        }
      };
      fetchProductAndPromotions();
    }
  }, [mode, id, navigate]);

  useEffect(() => {
    if (product) {
      const initialStatus = product.status || 'AVAILABLE';
      form.setFieldsValue({
        productName: product.productName,
        description: product.description,
        price: product.price,
        status: initialStatus,
        categoryID: product.categoryID,
        brandID: product.brandID,
        supplierID: product.supplierID,
      });
      setDisplayStatus(initialStatus);
    } else if (mode !== 'edit') {
      form.resetFields();
      setVariants([]);
      setProductImages([]);
      setAppliedPromotions([]);
      setDisplayStatus('AVAILABLE');
    }
    setFormErrors({});
  }, [product, form, mode]);

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

  const shouldWarn = (status, stock) => {
    if (stock > 0 && (status === 'UNAVAILABLE' || status === 'DISCONTINUED')) {
      return true;
    }
    return false;
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    if (shouldWarn(newStatus, totalStock)) {
      setTempStatus(newStatus);
      setModalVisible(true);
    } else {
      form.setFieldsValue({ status: newStatus });
      setDisplayStatus(newStatus);
    }
  };

  const handleConfirmStatus = () => {
    form.setFieldsValue({ status: tempStatus });
    setDisplayStatus(tempStatus);
    setModalVisible(false);
    setTempStatus(null);
  };

  const handleCancelStatus = () => {
    setModalVisible(false);
    setTempStatus(null);
  };

  const handleFinish = async (values) => {
    setFormErrors({});

    if (productImages.length === 0) {
      setFormErrors(prev => ({ ...prev, imageURL: 'Please upload at least one product image' }));
      return;
    }

    // Upload main product images
    const uploadedImages = await Promise.all(
      productImages.map(async (img) => {
        if (img.file) {
          const response = await uploadImage(img.file, product?.productID);
          return response.data.public_id;
        }
        return img.url;
      }),
    );

    const productData = {
      productName: values.productName,
      imageURL: uploadedImages,
      description: values.description || '',
      price: values.price,
      status: values.status || 'AVAILABLE',
      brandID: values.brandID,
      categoryID: values.categoryID,
      supplierID: values.supplierID,
    };

    setSubmitting(true);
    try {
      let productId;
      if (mode === 'edit') {
        productId = product.productID;
        await updateProduct(productId, productData);
        message.success('Product updated successfully');
      } else {
        const response = await createProduct(productData);
        productId = response.data.productID;
        message.success('Product created successfully');
      }

      const variantPromises = variants.map(async (variant) => {
        const variantData = {
          size: variant.size,
          color: variant.color,
          stockQuantity: variant.stockQuantity || variant.stock || 0,
          status: variant.status || 'AVAILABLE',
          image: variant.image, 
        };
        if (variant.productDetailID) {
          return updateProductDetail(variant.productDetailID, variantData);          
        } else {          
          return createProductDetail(productId, variantData);
        }
        
      });
      await Promise.all(variantPromises);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Unable to save product. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagesUpdate = (newImages) => {
    setProductImages(newImages);
    if (formErrors.imageURL) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.imageURL;
        return newErrors;
      });
    }
  };

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
      setVariants(prev => [...prev, updatedVariant]);
    }
    setIsEditVariantModalOpen(false);
  };

  const handleUpdateVariantStatus = (updatedVariant) => {
    setVariants(prev =>
      prev.map(v => (v.productDetailID === updatedVariant.productDetailID ? updatedVariant : v))
    );
    message.success(`Variant status changed to ${updatedVariant.status}`);
  };

  const getTagColor = (discount) => {
    if (discount >= 50) return 'red';
    if (discount >= 20) return 'orange';
    return 'green';
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
            <Card
              bordered={false}
              style={{
                marginBottom: 16,
                borderRadius: 8,
                boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
                background: 'linear-gradient(to right bottom, #ffffff,rgb(241, 241, 241))'
              }}
            >
              <h3 style={{ marginTop: 0 }}>Product Information</h3>
              <Form.Item
                label="Product Name"
                name="productName"
                rules={[{ required: true, message: 'Please enter the product name' }]}
                validateStatus={formErrors.productName ? 'error' : undefined}
                help={formErrors.productName}
              >
                <Input placeholder="Product Name" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                validateStatus={formErrors.description ? 'error' : undefined}
                help={formErrors.description}
              >
                <TextArea rows={4} placeholder="Product Description" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={<Space><AppstoreOutlined /> <span>Category</span></Space>}
                    name="categoryID"
                    rules={[{ required: true, message: 'Please select a category' }]}
                    validateStatus={formErrors.categoryID ? 'error' : undefined}
                    help={formErrors.categoryID}
                  >
                    <Select placeholder="Select Category" loading={categoryOptions.length === 0}>
                      {categoryOptions.map((option, index) => (
                        <Option key={`${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<Space><TrademarkCircleOutlined /> <span>Brand</span></Space>}
                    name="brandID"
                    rules={[{ required: true, message: 'Please select a brand' }]}
                    validateStatus={formErrors.brandID ? 'error' : undefined}
                    help={formErrors.brandID}
                  >
                    <Select placeholder="Select Brand" loading={brandOptions.length === 0}>
                      {brandOptions.map((option, index) => (
                        <Option key={`${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<Space><ShopOutlined /> <span>Supplier</span></Space>}
                    name="supplierID"
                    rules={[{ required: true, message: 'Please select a supplier' }]}
                    validateStatus={formErrors.supplierID ? 'error' : undefined}
                    help={formErrors.supplierID}
                  >
                    <Select placeholder="Select Supplier" loading={supplierOptions.length === 0}>
                      {supplierOptions.map((option, index) => (
                        <Option key={`${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
                <Col span={12} >
                  <Form.Item
                    layout='horizontal'
                    name="status"
                    label={
                      <Space>
                        Status
                        <Tooltip title="Select 'UNAVAILABLE' or 'DISCONTINUED' if applicable. 'AVAILABLE' and 'Limited Stock' are set automatically based on inventory.">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                    validateStatus={formErrors.status ? 'error' : undefined}
                    help={formErrors.status}
                    style={{ marginBottom: 0 }}
                  >
                    <Radio.Group
                      size="large"
                      onChange={handleStatusChange}
                      value={displayStatus}
                    >
                      {STATUS_PRODUCT_OPTIONS.map(option => (
                        <Radio
                          key={option.value}
                          value={option.value}
                          style={{
                            marginRight: 16,
                            marginBottom: 8,
                          }}
                          disabled={option.value === 'AVAILABLE' || option.value === 'LIMITED_STOCK'}
                        >
                          <Tag
                            color={option.color}
                            style={{
                              minWidth: 100,
                              textAlign: 'center',
                              padding: '2px 8px',
                            }}
                          >
                            {option.label}
                          </Tag>
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      background: '#f5f5f5',
                      padding: '12px 16px',
                      borderRadius: 6,
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Text strong style={{ fontSize: 14, color: '#595959' }}>
                        Total Inventory
                        <Tooltip title="Total of all variant stock quantities">
                          <InfoCircleOutlined style={{ marginLeft: 6, color: '#1890ff' }} />
                        </Tooltip>
                      </Text>
                      <div>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: totalStock > 20 ? '#3f8600' : totalStock > 0 ? '#d46b08' : '#cf1322',
                          }}
                        >
                          {totalStock} units
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 14, marginRight: 8 }}>
                        Current Status:
                      </Text>
                      <Tag
                        color={STATUS_PRODUCT_OPTIONS.find(opt => opt.value === displayStatus)?.color}
                        style={{ padding: '2px 8px' }}
                      >
                        {displayStatus || 'UNAVAILABLE'}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>

              <ProductImages
                product={product}
                onImagesUpdate={handleImagesUpdate}
                maxImages={8}
              />
              {formErrors.imageURL && (
                <div style={{ color: '#ff4d4f', marginTop: -16, marginBottom: 16 }}>
                  {formErrors.imageURL}
                </div>
              )}
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ marginBottom: 8 }}>
              <Title level={4} style={{ marginTop: 0 }}>Sales Information</Title>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter the price' }]}
                validateStatus={formErrors.price ? 'error' : undefined}
                help={formErrors.price}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter price"
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  size="large"
                  addonAfter="VND"
                  onPressEnter={(e) => e.preventDefault()}
                />
              </Form.Item>

              {appliedPromotions.length > 0 && (
                <Card
                  bordered={false}
                  style={{
                    marginBottom: 8,
                    borderRadius: 8,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(to right bottom, #ffffff, #f9feff)'
                  }}
                >
                  <Title level={5} style={{ display: 'flex', alignItems: 'center', marginTop: 0, marginBottom: 16 }}>
                    <TagOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Applied Promotions
                  </Title>

                  <Divider style={{ margin: '0 0 16px 0' }} />

                  {appliedPromotions.map((promo, index) => (
                    <div key={index} style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start' }}>
                      <CheckCircleOutlined style={{ marginRight: 8, marginTop: 4, color: '#52c41a' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          <Text strong style={{ marginRight: 8 }}>{promo.name}</Text>
                          <Tag color={getTagColor(promo.discountValue)}>
                            <PercentageOutlined /> {promo.discountValue}% OFF
                          </Tag>
                        </div>
                        <Paragraph type="secondary">{promo.description}</Paragraph>
                      </div>
                    </div>
                  ))}

                  {discountedPrice !== null && product && (
                    <>
                      <Divider style={{ margin: '16px 0' }} />
                      <div style={{
                        padding: 16,
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 8
                      }}>
                        <Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>Price Summary</Title>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text>Original Price:</Text>
                          <Text delete style={{ color: '#8c8c8c' }}>{currencyFormat(product.price)}</Text>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>After Discount:</Text>
                          <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                            {currencyFormat(discountedPrice)}
                          </Text>
                        </div>

                        <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0, fontStyle: 'italic' }}>
                          {appliedPromotions.length > 1
                            ? 'Multiple promotions applied (highest discount used)'
                            : 'Single promotion applied'}
                        </Paragraph>
                      </div>
                    </>
                  )}
                </Card>
              )}
            </Card>
          </Col>
        </Row>

        <Variant
          variants={variants}
          onEditVariant={handleEditVariant}
          onAddVariant={handleAddVariant}
          onUpdateVariantStatus={handleUpdateVariantStatus}
          error={formErrors.productDetails}
        />

        <EditVariantModal
          open={isEditVariantModalOpen}
          variant={editingVariant}
          onCancel={() => setIsEditVariantModalOpen(false)}
          onFinish={handleVariantFinish}
          productId={mode === 'edit' ? product?.productID : undefined}
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

      <Modal
        title="Warning"
        open={modalVisible}
        onOk={handleConfirmStatus}
        onCancel={handleCancelStatus}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Text>
          The selected status <Tag color={STATUS_PRODUCT_OPTIONS.find(opt => opt.value === tempStatus)?.color}>{tempStatus}</Tag> may not be appropriate for the current inventory ({totalStock} units). Are you sure you want to proceed?
        </Text>
      </Modal>
    </div>
  );
};

export default ProductForm;