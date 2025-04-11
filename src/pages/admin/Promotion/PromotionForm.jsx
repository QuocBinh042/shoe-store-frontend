import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Radio,
  Upload,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Tooltip,
  Alert,
  Modal,
  message
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  InboxOutlined,
  TagsOutlined,
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import './Promotion.scss';
import {
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../../../services/promotionService';
import { getAllProducts } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const PromotionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form] = Form.useForm();
  const [promotionType, setPromotionType] = useState('PERCENTAGE');
  const [selectedProducts, setSelectedProducts] = useState('ALL');
  const [useCode, setUseCode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        message.error('Failed to load categories');
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({ page: 1, pageSize: 100 });
        setProducts(response.data.items);
      } catch (error) {
        message.error('Failed to load products');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchPromotion = async () => {
        setLoading(true);
        try {
          const response = await getPromotionById(id);
          const promotionData = response.data;

          const formData = {
            ...promotionData,
            dateRange: promotionData.startDate && promotionData.endDate ? [
              moment(promotionData.startDate),
              moment(promotionData.endDate)
            ] : undefined,
            categories: promotionData.categories?.map(cat => cat.categoryID),
            products: promotionData.applicableProducts?.map(prod => prod.productID),
            giftProduct: promotionData.giftProduct?.productID,
            customerGroup: promotionData.customerGroups?.length === 3 ? 'ALL' : promotionData.customerGroups?.[0] || 'ALL',
            applicableTo: promotionData.applicableTo
          };

          form.setFieldsValue(formData);
          setPromotionType(promotionData.type);
          setSelectedProducts(promotionData.applicableTo);
          setUseCode(promotionData.useCode);
        } catch (error) {
          message.error('Unable to load promotion data');
          console.error('Error fetching promotion data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPromotion();
    } else {
      form.setFieldsValue({
        type: 'PERCENTAGE',
        applicableTo: 'ALL',
        customerGroup: 'ALL', 
        useCode: true,
        stackable: true,
        status: 'ACTIVE'
      });
    }
  }, [id, isEditing, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Make sure dates are in ISO format
      const startDate = values.dateRange && values.dateRange[0]
        ? values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        : null;

      const endDate = values.dateRange && values.dateRange[1]
        ? values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        : null;

      // Validate that endDate is not before startDate
      if (startDate && endDate && moment(endDate).isBefore(moment(startDate))) {
        throw new Error('End date cannot be before start date.');
      }

      // Map customerGroup to customerGroups
      const validCustomerGroups = ['NEW', 'EXISTING', 'VIP'];
      let customerGroups;
      if (values.customerGroup === 'ALL') {
        customerGroups = validCustomerGroups; // If ALL, include all groups
      } else {
        customerGroups = [values.customerGroup]; // Otherwise, include only the selected group
      }

      const payload = {
        // Add promotionID for compatibility with backend
        promotionID: 0,
        // Default fields for all types
        name: values.name,
        description: values.description || '',
        type: values.type,
        // Convert discountValue to decimal (BigDecimal compatibility)
        discountValue: values.discountValue ? Number(values.discountValue).toFixed(1) : 0.0,
        startDate: startDate,
        endDate: endDate,
        categoryIDs: values.applicableTo === 'CATEGORIES' && values.categories && values.categories.length > 0
          ? values.categories.map(id => {
              const parsed = Number(id);
              if (isNaN(parsed) || parsed <= 0) {
                throw new Error(`Invalid category ID: ${id}. Must be a positive number.`);
              }
              return parsed;
            })
          : [], // Set to empty array if applicableTo is ALL
        applicableProductIDs: values.applicableTo === 'PRODUCTS' && values.products && values.products.length > 0
          ? values.products.map(id => {
              const parsed = Number(id);
              if (isNaN(parsed) || parsed <= 0) {
                throw new Error(`Invalid product ID: ${id}. Must be a positive number.`);
              }
              return parsed;
            })
          : [], // Set to empty array if applicableTo is ALL
        applicableTo: values.applicableTo,
        customerGroups: customerGroups, // Send customerGroups as a list
        // Convert minOrderValue and maxDiscount to decimal (BigDecimal compatibility)
        minOrderValue: values.minOrderValue ? Number(values.minOrderValue).toFixed(1) : 0.0,
        maxDiscount: values.maxDiscount ? Number(values.maxDiscount).toFixed(1) : 0.0,
        useCode: !!values.useCode,
        code: values.useCode ? String(values.code || '') : '',
        status: values.status || 'ACTIVE',
        stackable: !!values.stackable,
        usageLimit: values.usageLimit ? Number(values.usageLimit) : 0,
        // Type-specific fields
        buyQuantity: values.buyQuantity ? Number(values.buyQuantity) : 0,
        getQuantity: values.getQuantity ? Number(values.getQuantity) : 0,
        giftProductID: values.giftProduct ? Number(values.giftProduct) : 0,
        image: values.image && values.image.length > 0 ? values.image[0].thumbUrl : 'default-image-url',
        usageCount: 0,
      };

      // Validate code if useCode is true
      if (payload.useCode && !payload.code.trim()) {
        throw new Error('Promotion code is required when "Require Code" is enabled.');
      }

      console.log('Form payload:', payload);

      if (isEditing) {
        await updatePromotion(id, payload);
        message.success('Promotion updated successfully');
      } else {
        await createPromotion(payload);
        message.success('Promotion created successfully');
      }
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error saving promotion:', error);

      // Display more detailed error information
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || error.response.data.error || 'Unknown error';
        message.error(`Failed to save promotion: ${errorMessage}`);
      } else {
        message.error('Failed to save promotion: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (value) => {
    setPromotionType(value);
    form.setFieldsValue({
      discountValue: undefined,
      buyQuantity: undefined,
      getQuantity: undefined,
      giftProduct: undefined,
    });
  };

  const handleBack = () => {
    navigate('/admin/promotions');
  };

  const handleDelete = () => {
    confirm({
      title: 'Are you sure you want to delete this promotion?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk: async () => {
        try {
          await deletePromotion(id);
          message.success('Promotion deleted successfully');
          navigate('/admin/promotions');
        } catch (error) {
          message.error('Failed to delete promotion');
          console.error('Error deleting promotion:', error);
        }
      },
    });
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldsValue({ code: result });
  };

  return (
    <div className="promotion-form" style={{ padding: '16px' }}>
      <Card
        style={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        title={
          <Space align="center">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ marginRight: '16px' }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {isEditing ? 'Edit Promotion' : 'Create New Promotion'}
            </Title>
          </Space>
        }
        extra={
          <Space>
            {isEditing && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark="optional"
        >
          <Row gutter={24}>
            {/* Basic Information */}
            <Col xs={24} lg={16}>
              <Card
                title="Basic Information"
                bordered={false}
                className="form-section"
              >
                <Form.Item
                  name="name"
                  label="Promotion Name"
                  rules={[{ required: true, message: 'Please enter a promotion name' }]}
                >
                  <Input placeholder="Enter a name for easy identification" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter a description' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Describe the promotion details"
                  />
                </Form.Item>

                <Form.Item
                  name="type"
                  label="Promotion Type"
                  rules={[{ required: true, message: 'Please select a promotion type' }]}
                >
                  <Select onChange={handleTypeChange}>
                    <Option value="PERCENTAGE">Percentage Discount</Option>
                    <Option value="FIXED">Fixed Amount</Option>
                    <Option value="BUYX">Buy X Get Y</Option>
                    <Option value="GIFT">Free Gift</Option>
                  </Select>
                </Form.Item>

                {promotionType === 'PERCENTAGE' && (
                  <Form.Item
                    name="discountValue"
                    label="Discount Percentage"
                    rules={[{ required: true, message: 'Please enter discount percentage' }]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      addonAfter="%"
                      style={{ width: '100%' }}
                      placeholder="Enter percentage (e.g., 10 for 10%)"
                    />
                  </Form.Item>
                )}

                {promotionType === 'FIXED' && (
                  <Form.Item
                    name="discountValue"
                    label="Discount Amount"
                    rules={[{ required: true, message: 'Please enter discount amount' }]}
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      addonBefore="$"
                      style={{ width: '100%' }}
                      placeholder="Enter amount (e.g., 20.00)"
                    />
                  </Form.Item>
                )}

                {promotionType === 'BUYX' && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      name="buyQuantity"
                      label="Buy Quantity"
                      rules={[{ required: true, message: 'Please enter buy quantity' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="Number of items to buy" />
                    </Form.Item>

                    <Form.Item
                      name="getQuantity"
                      label="Get Quantity Free"
                      rules={[{ required: true, message: 'Please enter get quantity' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="Number of items to get free" />
                    </Form.Item>
                  </Space>
                )}

                {promotionType === 'GIFT' && (
                  <Form.Item
                    name="giftProduct"
                    label="Gift Product"
                    rules={[{ required: true, message: 'Please select a gift product' }]}
                  >
                    <Select
                      placeholder="Select gift product"
                      showSearch
                      optionFilterProp="children"
                    >
                      {products.map((product) => (
                        <Option key={product.productID} value={product.productID}>
                          {product.productName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Divider />

                <Form.Item
                  name="dateRange"
                  label="Promotion Date Range"
                  rules={[{ required: true, message: 'Please select date range' }]}
                >
                  <RangePicker style={{ width: '100%' }} showTime />
                </Form.Item>
              </Card>

              <Card
                title="Applicable Conditions"
                bordered={false}
                className="form-section"
              >
                <Form.Item
                  name="applicableTo"
                  label="Apply To"
                  rules={[{ required: true, message: 'Please select applicability' }]}
                >
                  <Radio.Group onChange={(e) => setSelectedProducts(e.target.value)}>
                    <Space direction="vertical">
                      <Radio value="ALL">All Products</Radio>
                      <Radio value="CATEGORIES">Specific Categories</Radio>
                      <Radio value="PRODUCTS">Specific Products</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                {selectedProducts === 'CATEGORIES' && (
                  <Form.Item
                    name="categories"
                    label="Select Categories"
                    rules={[{ required: true, message: 'Please select at least one category' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select categories"
                      style={{ width: '100%' }}
                    >
                      {categories.map((category) => (
                        <Option key={category.categoryID} value={category.categoryID}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                {selectedProducts === 'PRODUCTS' && (
                  <Form.Item
                    name="products"
                    label="Select Products"
                    rules={[{ required: true, message: 'Please select at least one product' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Search and select products"
                      showSearch
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                    >
                      {products.map((product) => (
                        <Option key={product.productID} value={product.productID}>
                          {product.productID} - {product.productName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  name="minOrderValue"
                  label={
                    <Space>
                      <span>Minimum Order Value</span>
                      <Tooltip title="Promotion will only apply to orders that meet this minimum value">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    addonBefore="$"
                    style={{ width: '100%' }}
                    placeholder="0.00 (No minimum)"
                  />
                </Form.Item>

                {promotionType === 'PERCENTAGE' && (
                  <Form.Item
                    name="maxDiscount"
                    label={
                      <Space>
                        <span>Maximum Discount Amount</span>
                        <Tooltip title="Limit the maximum discount amount for percentage discounts">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      addonBefore="$"
                      style={{ width: '100%' }}
                      placeholder="No maximum"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="customerGroup"
                  label="Customer Eligibility"
                  rules={[{ required: true, message: 'Please select customer eligibility' }]}
                >
                  <Select>
                    <Option value="ALL">All Customers</Option>
                    <Option value="NEW">New Customers Only</Option>
                    <Option value="EXISTING">Existing Customers Only</Option>
                    <Option value="VIP">VIP Members</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={8}>
              {/* Promotion Code */}
              <Card
                title="Promotion Code"
                bordered={false}
                className="form-section"
              >
                <Form.Item
                  name="useCode"
                  label="Require Code"
                  valuePropName="checked"
                >
                  <Switch
                    checked={useCode}
                    onChange={(checked) => setUseCode(checked)}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="code"
                  label="Promotion Code"
                  rules={[
                    {
                      required: useCode,
                      message: 'Please enter a promotion code'
                    },
                    {
                      min: 3,
                      message: 'Promotion code must be at least 3 characters long',
                      when: () => useCode
                    }
                  ]}
                >
                  <Input
                    prefix={<TagsOutlined />}
                    placeholder="e.g. SUMMER20"
                    style={{ textTransform: 'uppercase' }}
                    disabled={!useCode}
                  />
                </Form.Item>

                <Alert
                  message="Customer will need to enter this code at checkout to apply the promotion."
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <Button
                  type="dashed"
                  block
                  icon={<TagsOutlined />}
                  onClick={generateRandomCode}
                  disabled={!useCode}
                >
                  Generate Random Code
                </Button>
              </Card>

              {/* Promotion Image */}
              <Card
                title="Promotion Image"
                bordered={false}
                className="form-section"
              >
                <Form.Item name="image" className="upload-label">
                  <Upload.Dragger
                    maxCount={1}
                    listType="picture"
                    beforeUpload={() => false}
                    accept="image/*"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Upload an image for this promotion to display on the website
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Card>

              <Card
                title="Settings"
                bordered={false}
                className="form-section"
              >
                <Form.Item
                  name="status"
                  label="Promotion Status"
                  tooltip="Set the current status of this promotion"
                >
                  <Select>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                    <Option value="UPCOMING">Upcoming</Option>
                    <Option value="EXPIRED">Expired</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="stackable"
                  label="Stackable with Other Promotions"
                  valuePropName="checked"
                  tooltip="Allow this promotion to be combined with other active promotions"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="usageLimit"
                  label="Usage Limit per Customer"
                >
                  <InputNumber
                    min={0}
                    placeholder="No limit"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default PromotionForm;