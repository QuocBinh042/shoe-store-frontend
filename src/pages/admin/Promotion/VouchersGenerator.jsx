import React, { useState, useEffect } from 'react';
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
import { getAllVouchers, createBatchVouchers, deleteVoucher } from '../../../services/voucherService';
import './Promotion.scss';
import { currencyFormat } from '../../../utils/helper';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const formatDate = (date) => {
  if (!date) return null;
  return date.format('YYYY-MM-DDTHH:mm:ss'); // ISO string for backend
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
  const [vouchers, setVouchers] = useState([]); // data thực lấy từ backend
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewVouchers, setPreviewVouchers] = useState([]);
  const [saving, setSaving] = useState(false);

  // Fetch voucher thực khi vào trang hoặc sau khi lưu
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getAllVouchers();
      if (response.statusCode === 200) {
        setVouchers(response.data);
      } else {
        message.error('Failed to load vouchers');
      }
    } catch (err) {
      console.error('Error loading vouchers:', err);
      message.error('Failed to load vouchers');
    }
    setLoading(false);
  };

  // Generate a random coupon code
  const generateRandomCode = (prefix, length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix ? prefix : '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate multiple coupons
  const generateVouchers = (values) => {
    setLoading(true);
    const {
      prefix,
      codeLength,
      quantity,
      discountType,
      discountValue,
      expiryDate,
      minOrderValue,
      maxUses,
      description,
      productRestriction,
      freeShipping,
      startDate,
    } = values;

    const now = new Date();
    const newVouchers = [];
    for (let i = 0; i < quantity; i++) {
      const code = generateRandomCode(prefix, codeLength);
      newVouchers.push({
        voucherID: 0,
        code,
        discountType: discountType === 'percentage' ? 'PERCENT' : 'FIXED', // backend enum
        discountValue: discountValue,
        minOrderValue: minOrderValue || 0,
        freeShipping: !!freeShipping,
        description: description || '',
        productRestriction: productRestriction || 'all',
        status: true, // default active
        usedCount: 0,
        maxUses: maxUses || 1,
        startDate: formatDate(startDate || null) || new Date().toISOString(), // default now
        endDate: formatDate(expiryDate || null) || null,
      });
    }
    setPreviewVouchers(newVouchers);
    setPreviewVisible(true);
    setLoading(false);
  };

  // Save coupons to database (call backend)
  const saveVouchers = async () => {
    setSaving(true);
    try {
      const response = await createBatchVouchers(previewVouchers);
      if (response.statusCode === 200) {
        message.success(`${previewVouchers.length} vouchers created!`);
        setPreviewVisible(false);
        setPreviewVouchers([]);
        fetchVouchers(); // reload table
        form.resetFields();
      } else {
        message.error('Failed to save vouchers');
      }
    } catch (err) {
      console.error('Error saving vouchers:', err);
      message.error('Failed to save vouchers: ' + (err?.response?.data?.message || ''));
    }
    setSaving(false);
  };

  // Export vouchers as CSV
  const exportVouchersAsCSV = () => {
    if (vouchers.length === 0) {
      message.warning('No vouchers to export');
      return;
    }
    const headers = [
      'Code',
      'Discount Type',
      'Discount Value',
      'Start Date',
      'End Date',
      'Min Order Value (VND)',
      'Free Shipping',
      'Max Uses',
      'Used Count',
      'Status',
      'Description',
    ];
    const csvContent = [
      headers.join(','),
      ...vouchers.map((c) =>
        [
          c.code,
          c.discountType,
          c.discountValue,
          c.startDate,
          c.endDate,
          c.minOrderValue,
          c.freeShipping ? 'Yes' : 'No',
          c.maxUses,
          c.usedCount || 0,
          c.status ? 'Active' : 'Inactive',
          `"${c.description || ''}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vouchers_${formatDateTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle deleting a voucher
  const handleDeleteVoucher = (id) => {
    confirm({
      title: 'Delete this voucher?',
      icon: <DeleteOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteVoucherById(id);
      },
    });
  };

  const deleteVoucherById = async (id) => {
    try {
      console.log("id", id);
      const response = await deleteVoucher(id);
      console.log("response", response);
      if (response.statusCode === 200) {
        setVouchers((prev) => prev.filter((c) => c.voucherID !== id));
        message.success('Voucher deleted!');
      } else {
        message.error('Failed to delete voucher');
      }
    } catch (err) {
      console.error('Error deleting voucher:', err);
      message.error('Failed to delete voucher');
    }
  };

  // Copy code to clipboard
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

  // Table columns for generated vouchers
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
          {record.discountType === 'PERCENT' || record.discountType === 'percentage'
            ? `${record.discountValue}%`
            : currencyFormat(record.discountValue)}
        </Text>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => (date ? new Date(date).toLocaleString() : ''),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => (date ? new Date(date).toLocaleString() : ''),
    },
    {
      title: 'Min Order',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      render: (value) => currencyFormat(value),
    },
    {
      title: 'Uses',
      key: 'uses',
      render: (_, record) => `${record.usedCount || 0}/${record.maxUses}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status ? 'green' : 'volcano';
        return <Tag color={color}>{status ? 'ACTIVE' : 'INACTIVE'}</Tag>;
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
            onClick={() => handleDeleteVoucher(record.voucherID)}
            tooltip="Delete voucher"
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
                productRestriction: 'all',
                freeShipping: false,
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
                rules={[{ required: true, message: 'Please input the number of vouchers to generate' }]}
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
                  formatter={(value) =>
                    form.getFieldValue('discountType') === 'percentage'
                      ? `${value}%`
                      : `$ ${value}`
                  }
                  parser={(value) => value.replace(/\$\s?|%/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="startDate"
                label="Start Date"
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  disabledDate={(date) => date && date < new Date()}
                />
              </Form.Item>

              <Form.Item
                name="expiryDate"
                label="Expiry Date"
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  disabledDate={(date) => date && date < new Date()}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="minOrderValue"
                    label="Minimum Order Value (VND)"
                  >
                    <InputNumber
                      min={0}
                      formatter={(value) => `${value}`}
                      parser={(value) => value.replace(/\$\s?/g, '')}
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
                name="freeShipping"
                label="Free Shipping"
                valuePropName="checked"
              >
                <Radio.Group>
                  <Radio.Button value={true}>Yes</Radio.Button>
                  <Radio.Button value={false}>No</Radio.Button>
                </Radio.Group>
              </Form.Item>

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
                  disabled={vouchers.length === 0}
                >
                  Export as CSV
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={vouchers}
              rowKey="voucherID"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
              locale={{ emptyText: 'No vouchers generated yet' }}
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
        confirmLoading={saving}
      >
        <Alert
          message="Preview Generated Vouchers"
          description="Review the generated vouchers before saving them to the database."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Table
          columns={columns.filter((col) => col.key !== 'actions')}
          dataSource={previewVouchers}
          rowKey={(record) => record.code}
          pagination={false}
          scroll={{ y: 300 }}
        />
      </Modal>
    </div>
  );
};

export default VoucherGenerator;
