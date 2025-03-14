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

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const PromotionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [form] = Form.useForm();
  const [promotionType, setPromotionType] = useState('percentage');
  const [selectedProducts, setSelectedProducts] = useState('all');
  const [useCode, setUseCode] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Mock data for editing - in a real app, you'd fetch this from an API
  const initialValues = isEditing ? {
    name: 'Summer Sale 2023',
    description: 'Get 10% off on all summer products!',
    type: 'percentage',
    discountValue: 10,
    dateRange: [moment('2023-06-01'), moment('2023-08-31')],
    timeRanges: ['morning', 'afternoon'],
    minOrderValue: 0,
    maxDiscount: null,
    useCode: true,
    code: 'SUMMER10',
    applicableTo: 'all',
    customerGroup: 'all',
    active: true,
    featured: false,
    stackable: true,
    usageLimit: null,
  } : {
    type: 'percentage',
    applicableTo: 'all',
    customerGroup: 'all',
    useCode: true,
    active: true,
    stackable: true,
  };
  
  useEffect(() => {
    if (isEditing) {
      setPromotionType(initialValues.type);
      setSelectedProducts(initialValues.applicableTo);
      setUseCode(initialValues.useCode);
    }
  }, [isEditing]);
  
  const onFinish = (values) => {
    setLoading(true);
    console.log('Submitted values:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/promotions');
    }, 1000);
  };
  
  const handleTypeChange = (value) => {
    setPromotionType(value);
    // Reset some fields when type changes
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
    Modal.confirm({
      title: 'Are you sure you want to delete this promotion?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk() {
        message.success('Promotion deleted successfully');
        navigate('/admin/promotions');
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
          initialValues={initialValues}
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
                    <Option value="percentage">Percentage Discount</Option>
                    <Option value="fixed">Fixed Amount Discount</Option>
                    <Option value="buyx">Buy X Get Y Free</Option>
                    <Option value="gift">Free Gift</Option>
                    <Option value="shipping">Free Shipping</Option>
                  </Select>
                </Form.Item>
              
                {promotionType === 'percentage' && (
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
              
                {promotionType === 'fixed' && (
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
              
                {promotionType === 'buyx' && (
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
              
                {promotionType === 'gift' && (
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
                      <Option value="prod1">Small Tote Bag</Option>
                      <Option value="prod2">Travel Size Skincare Set</Option>
                      <Option value="prod3">Product Sample Pack</Option>
                    </Select>
                  </Form.Item>
                )}
              
                <Divider />
              
                <Form.Item
                  name="dateRange"
                  label="Promotion Date Range"
                  rules={[{ required: true, message: 'Please select date range' }]}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              
                <Form.Item
                  name="timeRanges"
                  label="Applicable Time (Optional)"
                  tooltip="Restrict promotion to specific times of day"
                >
                  <Select mode="multiple" placeholder="Select applicable times (leave empty for all times)">
                    <Option value="morning">Morning (6:00 - 12:00)</Option>
                    <Option value="afternoon">Afternoon (12:00 - 18:00)</Option>
                    <Option value="evening">Evening (18:00 - 22:00)</Option>
                    <Option value="night">Night (22:00 - 6:00)</Option>
                  </Select>
                </Form.Item>
              </Card>
              
              {/* Conditions Card */}
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
                      <Radio value="all">All Products</Radio>
                      <Radio value="categories">Specific Categories</Radio>
                      <Radio value="products">Specific Products</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              
                {selectedProducts === 'categories' && (
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
                      <Option value="clothing">Clothing</Option>
                      <Option value="electronics">Electronics</Option>
                      <Option value="home">Home & Kitchen</Option>
                      <Option value="beauty">Beauty & Personal Care</Option>
                    </Select>
                  </Form.Item>
                )}
              
                {selectedProducts === 'products' && (
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
                      <Option value="prod1">Product 1</Option>
                      <Option value="prod2">Product 2</Option>
                      <Option value="prod3">Product 3</Option>
                      <Option value="prod4">Product 4</Option>
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
              
                {promotionType === 'percentage' && (
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
                    <Option value="all">All Customers</Option>
                    <Option value="new">New Customers Only</Option>
                    <Option value="existing">Existing Customers Only</Option>
                    <Option value="vip">VIP Members</Option>
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
              
              {/* Settings */}
              <Card 
                title="Settings" 
                bordered={false}
                className="form-section"
              >
                <Form.Item
                  name="active"
                  label="Active Status"
                  valuePropName="checked"
                  tooltip="Enable or disable this promotion"
                >
                  <Switch 
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
                
                <Form.Item
                  name="featured"
                  label="Featured Promotion"
                  valuePropName="checked"
                  tooltip="Featured promotions are highlighted on the homepage and in marketing materials"
                >
                  <Switch 
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
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