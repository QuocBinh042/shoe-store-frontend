import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  Table,
  Space,
  Tag,
  Modal,
  message,
  Alert,
  Row,
  Col,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Promotion.scss';

const { Title, Text} = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const formatDate = (date) => {
  if (!date) return null;
  return date.format('YYYY-MM-DD');
};

const formatDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

const VoucherGenerator = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [coupons, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewVouchers, setPreviewVouchers] = useState([]);

  // Generate a random coupon code
  const generateRandomCode = (prefix, length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix ? prefix : '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate multiple coupon codes
  const generateVouchers = (values) => {
    setLoading(true);
    const { prefix, codeLength, quantity, discountType, discountValue, expiryDate, minOrderValue, maxUses, description, productRestriction } = values;
    
    const newVouchers = [];
    for (let i = 0; i < quantity; i++) {
      const code = generateRandomCode(prefix, codeLength);
      newVouchers.push({
        id: `temp-${Date.now()}-${i}`,
        code,
        discountType,
        discountValue,
        expiryDate: formatDate(expiryDate),
        minOrderValue: minOrderValue || 0,
        maxUses: maxUses || 1,
        usedCount: 0,
        status: 'active',
        description,
        productRestriction,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    
    setPreviewVouchers(newVouchers);
    setPreviewVisible(true);
    setLoading(false);
  };

  // Save coupons to database
  const saveVouchers = () => {
    // In a real app, you would send the coupons to your API
    console.log('Saving coupons:', previewVouchers);
    setVouchers([...coupons, ...previewVouchers]);
    setPreviewVisible(false);
    message.success(`${previewVouchers.length} coupons generated successfully!`);
    form.resetFields();
  };

  // Export coupons as CSV
  const exportVouchersAsCSV = () => {
    if (coupons.length === 0) {
      message.warning('No coupons to export');
      return;
    }

    const headers = ['Code', 'Discount Type', 'Discount Value', 'Expiry Date', 'Min Order Value', 'Max Uses', 'Status', 'Description'];
    const csvContent = [
      headers.join(','),
      ...coupons.map(coupon => [
        coupon.code,
        coupon.discountType,
        coupon.discountValue,
        coupon.expiryDate,
        coupon.minOrderValue,
        coupon.maxUses,
        coupon.status,
        `"${coupon.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `coupons_${formatDateTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle deleting a coupon
  const handleDeleteVoucher = (id) => {
    confirm({
      title: 'Are you sure you want to delete this coupon?',
      icon: <DeleteOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setVouchers(coupons.filter(coupon => coupon.id !== id));
        message.success('Voucher deleted successfully');
      },
    });
  };

  // Copy coupon code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        message.success(`Copied ${code} to clipboard`);
      },
      () => {
        message.error('Failed to copy code');
      }
    );
  };

  // Table columns for generated coupons
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <Space>
          <Text copyable={{ text, tooltips: ['Copy', 'Copied!'] }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_, record) => (
        <Text>
          {record.discountType === 'percentage' ? `${record.discountValue}%` : `$${record.discountValue}`}
        </Text>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Min Order',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (value) => `$${value}`,
    },
    {
      title: 'Uses',
      key: 'uses',
      render: (_, record) => `${record.usedCount}/${record.maxUses}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'used') {
          color = 'volcano';
        } else if (status === 'expired') {
          color = 'gray';
        }
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<CopyOutlined />} 
            onClick={() => copyToClipboard(record.code)}
            tooltip="Copy code"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteVoucher(record.id)}
            tooltip="Delete coupon"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="coupon-generator">

      <Card 
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/promotions')}
            >
              Back to Promotions
            </Button>
            <Title level={4}>Voucher Generator</Title>
          </Space>
        }
        className="coupon-generator-card"
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={10}>
            <Form
              form={form}
              layout="vertical"
              onFinish={generateVouchers}
              requiredMark={false}
              initialValues={{
                prefix: 'SHOE',
                codeLength: 8,
                quantity: 10,
                discountType: 'percentage',
                discountValue: 10,
                maxUses: 1,
                productRestriction: 'all'
              }}
            >
              <Title level={5}>Generate New Vouchers</Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="prefix"
                    label="Code Prefix"
                    tooltip="Add a prefix to make coupon codes easier to recognize"
                  >
                    <Input placeholder="SUMMER" maxLength={10} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="codeLength"
                    label="Code Length"
                    rules={[{ required: true, message: 'Please input the code length' }]}
                  >
                    <InputNumber min={4} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="quantity"
                label="Number of Vouchers"
                rules={[{ required: true, message: 'Please input the number of coupons to generate' }]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="discountType"
                label="Discount Type"
                rules={[{ required: true, message: 'Please select discount type' }]}
              >
                <Radio.Group>
                  <Radio.Button value="percentage">Percentage (%)</Radio.Button>
                  <Radio.Button value="fixed">Fixed Amount ($)</Radio.Button>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="discountValue"
                label="Discount Value"
                rules={[{ required: true, message: 'Please input the discount value' }]}
              >
                <InputNumber
                    min={0}
                    max={form.getFieldValue('discountType') === 'percentage' ? 100 : 1000}
                    formatter={value => 
                        form.getFieldValue('discountType') === 'percentage' 
                            ? `${value}%` 
                            : `$ ${value}`
                    }
                    parser={value => value.replace(/\$\s?|%/g, '')}
                    style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item
                name="expiryDate"
                label="Expiry Date"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={date => date && date < new Date()}
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="minOrderValue"
                    label="Minimum Order Value"
                  >
                    <InputNumber
                      min={0}
                      formatter={value => `$ ${value}`}
                      parser={value => value.replace(/\$\s?/g, '')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="maxUses"
                    label="Max Uses Per Voucher"
                    tooltip="How many times each coupon can be used"
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="productRestriction"
                label="Product Restriction"
              >
                <Select placeholder="Apply to">
                  <Option value="all">All Products</Option>
                  <Option value="category">Specific Categories</Option>
                  <Option value="product">Specific Products</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
                tooltip="Internal notes about this coupon batch"
              >
                <TextArea rows={3} placeholder="e.g., Summer promotion 2023" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />}>
                  Generate Vouchers
                </Button>
              </Form.Item>
            </Form>
          </Col>
          
          <Col xs={24} lg={14}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={5}>Generated Vouchers</Title>
              <Space>
                <Button 
                  icon={<DownloadOutlined />} 
                  onClick={exportVouchersAsCSV}
                  disabled={coupons.length === 0}
                >
                  Export as CSV
                </Button>
              </Space>
            </div>
            
            <Table
              columns={columns}
              dataSource={coupons}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
              locale={{ emptyText: 'No coupons generated yet' }}
            />
          </Col>
        </Row>
      </Card>
      
      {/* Preview Modal */}
      <Modal
        title="Voucher Preview"
        open={previewVisible}
        onOk={saveVouchers}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        okText="Save Vouchers"
        cancelText="Cancel"
      >
        <Alert
          message="Preview Generated Vouchers"
          description="Review the generated coupons before saving them to the database."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Table
          columns={columns.filter(col => col.key !== 'actions')}
          dataSource={previewVouchers}
          rowKey="id"
          pagination={false}
          scroll={{ y: 300 }}
        />
      </Modal>
    </div>
  );
};

export default VoucherGenerator; 