import { useEffect, useState } from 'react';
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
} from 'antd';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import ProductImages from './ProductImages';
import Variant from './Variant';

const { TextArea } = Input;

const mockVariants = [
  {
    key: '1',
    image: 'https://picsum.photos/50?random=1',
    size: '40',
    color: 'Purple',
    price: 300,
    stock: 300,
    status: 'Enabled',
  },
  {
    key: '2',
    image: 'https://picsum.photos/50?random=2',
    size: '39',
    color: 'Blue',
    price: 300,
    stock: 141,
    status: 'Disabled',
  },
  {
    key: '3',
    image: 'https://picsum.photos/50?random=3',
    size: '38',
    color: 'Purple',
    price: 255,
    stock: 500,
    status: 'Enabled',
  },
];

const promotionDetails = {
  1: {
    name: 'Promo 1',
    discountType: 'Percentage',
    discountPercentage: 20,
    startDate: '2023-07-01',
    endDate: '2023-07-31',
    effective: true,
  },
};

const ProductForm = ({ product, onBack, onSubmit }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState(mockVariants);

  const handlePromotionDetails = () => {
    const promo = form.getFieldValue('promotionID');
    const details = promotionDetails[1];
    if (details) {
      Modal.info({
        title: 'Promotion Details',
        content: (
          <div>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <strong>Name:</strong>
              </Col>
              <Col span={12}>{details.name}</Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <strong>Discount Type:</strong>
              </Col>
              <Col span={12}>{details.discountType}</Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <strong>Discount Percentage:</strong>
              </Col>
              <Col span={12}>
                {details.discountPercentage}
                {details.discountType === 'Percentage' && <span>%</span>}
              </Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <strong>Start Date:</strong>
              </Col>
              <Col span={12}>{details.startDate}</Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <strong>End Date:</strong>
              </Col>
              <Col span={12}>{details.endDate}</Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={12}>
                <strong>Effective:</strong>
              </Col>
              <Col span={12}>{details.effective ? 'Yes' : 'No'}</Col>
            </Row>
          </div>
        ),
        onOk() { },
      });
    } else {
      Modal.info({
        title: 'Promotion Details',
        content: <div>No promotion selected</div>,
        onOk() { },
      });
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        images: product.images ? product.images.join(', ') : '',
        sizeOptions: product.sizeOptions ? product.sizeOptions.join(', ') : '',
        colorOptions: product.colorOptions ? product.colorOptions.join(', ') : '',
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      images: values.images
        ? values.images.split(',').map((url) => url.trim())
        : [],
      sizeOptions: values.sizeOptions
        ? values.sizeOptions.split(',').map((s) => s.trim())
        : [],
      colorOptions: values.colorOptions
        ? values.colorOptions.split(',').map((c) => c.trim())
        : [],
    };
    onSubmit(formattedValues);
  };

  const handleEditVariant = (record) => {
    console.log('Edit variant:', record);
    // Ở đây bạn có thể mở modal chỉnh sửa variant
  };

  const handleAddVariant = () => {
    const newVariant = {
      key: (variants.length + 1).toString(),
      image: 'https://picsum.photos/50?random=' + (variants.length + 1),
      size: 'New',
      color: 'New',
      price: 100,
      stock: 50,
      status: 'Enabled',
    };
    setVariants([...variants, newVariant]);
  };

  return (
    <div style={{ padding: 16, background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button onClick={onBack} style={{ marginRight: 16 }}>
          <LeftOutlined />
        </Button>
        <h2 style={{ margin: 0 }}>
          {product ? 'Edit Product' : 'Create Product'}
        </h2>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Col span={16}>
          <Card style={{ marginBottom: 24 }}>
            <h3 style={{ marginTop: 0 }}>Product Information</h3>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Row gutter={14}>
                <Col span={24}>
                  <Form.Item
                    label="Name"
                    name="productName"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                  >
                    <Input placeholder="Product Name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="categoryID" label="Category">
                    <Select placeholder="Select category">
                      <Select.Option value={1}>Running</Select.Option>
                      <Select.Option value={2}>Basketball</Select.Option>
                      <Select.Option value={3}>Casual</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="brandID" label="Brand">
                    <Select placeholder="Select brand">
                      <Select.Option value={1}>Nike</Select.Option>
                      <Select.Option value={2}>Adidas</Select.Option>
                      <Select.Option value={3}>Puma</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="supplierID" label="Supplier">
                    <Select placeholder="Select supplier">
                      <Select.Option value={1}>Supplier A</Select.Option>
                      <Select.Option value={2}>Supplier B</Select.Option>
                      <Select.Option value={3}>Supplier C</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Description (Optional)" name="description">
                <TextArea rows={4} placeholder="Product Description" />
              </Form.Item>
              <ProductImages product={product} />
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ marginBottom: 8 }}>
            <h3 style={{ marginTop: 0 }}>Sales Information</h3>
            <Form form={form} layout="vertical">
              <Form.Item
                style={{ width: '100%' }}
                name="price"
                label="Price (VND)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter price"
                  min={0}
                />
              </Form.Item>

              <Form.Item
                style={{ width: '100%' }}
                name="promotionID"
                label="Promotion"
              >
                <div style={{ display: 'flex', gap: 5 }}>
                  <Select placeholder="Select promotion (optional)">
                    <Select.Option value={1}>Promo 1</Select.Option>
                    <Select.Option value={2}>Promo 2</Select.Option>
                    <Select.Option value={3}>Promo 3</Select.Option>
                  </Select>
                  <Button type="default" onClick={handlePromotionDetails}>
                    <EyeOutlined />
                  </Button>
                </div>
              </Form.Item>

              <Form.Item
                style={{ width: '100%' }}
                name="discountPrice"
                label="Discount Price"
              >
                <Input placeholder="Discount price" disabled style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                style={{ width: '100%' }}
                name="status"
                label="Status"
              >
                <Select placeholder="Select status">
                  <Select.Option value="Available">Available</Select.Option>
                  <Select.Option value="Out of Stock">Out of Stock</Select.Option>
                  <Select.Option value="Coming Soon">Coming Soon</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </div>

      <Variant
        variants={variants}
        onEditVariant={handleEditVariant}
        onAddVariant={handleAddVariant}
      />

      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={() => form.submit()}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
