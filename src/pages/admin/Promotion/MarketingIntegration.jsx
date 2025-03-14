import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Table,
  Tag,
  Tabs,
  Row,
  Col,
  Space,
  Modal,
  Steps,
  Divider,
  message,
  Upload,
  Switch,
  Radio,
  Segmented,
  Descriptions,
  Statistic,
} from 'antd';
import {
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  SendOutlined,
  HistoryOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  FileDoneOutlined,
  UploadOutlined,
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Promotion.scss';
// Comment out moment to avoid dependency issues
// import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Dragger } = Upload;
const { Step } = Steps;
const { confirm } = Modal;

const MarketingIntegration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');
  const [templateType, setTemplateType] = useState('standard');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [campaignDetailModalVisible, setCampaignDetailModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // Mock data for email/SMS campaigns
  const campaigns = [
    {
      id: '1',
      name: 'Summer Promotion Launch',
      type: 'email',
      status: 'sent',
      sentDate: '2023-06-05',
      recipients: 1250,
      openRate: 28.5,
      clickRate: 12.3,
      conversionRate: 4.2,
      template: 'summer_promo_template',
      promotion: 'Summer Sale 2023'
    },
    {
      id: '2',
      name: 'New Customer Welcome',
      type: 'email',
      status: 'scheduled',
      scheduledDate: '2023-07-15',
      recipients: 0,
      openRate: null,
      clickRate: null,
      conversionRate: null,
      template: 'welcome_template',
      promotion: 'New Customer Discount'
    },
    {
      id: '3',
      name: 'Flash Sale Alert',
      type: 'sms',
      status: 'sent',
      sentDate: '2023-05-20',
      recipients: 875,
      deliveryRate: 98.2,
      clickRate: 15.7,
      conversionRate: 5.3,
      template: 'flash_sale_template',
      promotion: 'Flash Sale Weekend'
    },
    {
      id: '4',
      name: 'Back to School Reminder',
      type: 'email',
      status: 'draft',
      recipients: null,
      openRate: null,
      clickRate: null,
      conversionRate: null,
      template: 'back_to_school_template',
      promotion: 'Back to School'
    },
  ];

  // Mock data for templates
  const templates = [
    {
      id: '1',
      name: 'Summer Promotion Template',
      key: 'summer_promo_template',
      type: 'email',
      category: 'promotional',
      createdAt: '2023-05-15',
      lastUsed: '2023-06-05'
    },
    {
      id: '2',
      name: 'Welcome New Customer',
      key: 'welcome_template',
      type: 'email',
      category: 'transactional',
      createdAt: '2023-04-10',
      lastUsed: '2023-06-20'
    },
    {
      id: '3',
      name: 'Flash Sale Alert',
      key: 'flash_sale_template',
      type: 'sms',
      category: 'promotional',
      createdAt: '2023-05-01',
      lastUsed: '2023-05-20'
    },
    {
      id: '4',
      name: 'Back to School',
      key: 'back_to_school_template',
      type: 'email',
      category: 'promotional',
      createdAt: '2023-07-01',
      lastUsed: null
    },
  ];

  // Mock data for promotions
  const promotions = [
    { id: '1', name: 'Summer Sale 2023' },
    { id: '2', name: 'New Customer Discount' },
    { id: '3', name: 'Back to School' },
    { id: '4', name: 'Flash Sale Weekend' },
    { id: '5', name: 'Holiday Gift' },
  ];

  // Mock data for customer segments
  const customerSegments = [
    { id: '1', name: 'All Customers', count: 5000 },
    { id: '2', name: 'New Customers (Last 30 Days)', count: 450 },
    { id: '3', name: 'Repeat Customers', count: 2300 },
    { id: '4', name: 'VIP Customers', count: 750 },
    { id: '5', name: 'Inactive Customers (90+ Days)', count: 1500 },
  ];

  // Email campaign columns
  const campaignColumns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'email' ? 'blue' : 'green'} icon={type === 'email' ? <MailOutlined /> : <MessageOutlined />}>
          {type === 'email' ? 'Email' : 'SMS'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'sent') color = 'green';
        if (status === 'scheduled') color = 'blue';
        if (status === 'draft') color = 'orange';
        
        return (
          <Tag color={color} style={{ textTransform: 'capitalize' }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, record) => record.sentDate || record.scheduledDate || '-',
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      render: (text) => text || '-',
    },
    {
      title: 'Promotion',
      dataIndex: 'promotion',
      key: 'promotion',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCampaign(record)}
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            disabled={record.status === 'sent'}
            onClick={() => handleSendCampaign(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCampaign(record)}
          />
        </Space>
      ),
    },
  ];

  // Template columns
  const templateColumns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'email' ? 'blue' : 'green'} icon={type === 'email' ? <MailOutlined /> : <MessageOutlined />}>
          {type === 'email' ? 'Email' : 'SMS'}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color={category === 'promotional' ? 'purple' : 'cyan'}>{category}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (text) => text || 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTemplate(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTemplate(record)}
          />
        </Space>
      ),
    },
  ];

  // Handle create new campaign
  const handleCreateCampaign = () => {
    setCreateModalVisible(true);
    setCurrentStep(0);
    form.resetFields();
  };

  // Handle edit campaign
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailModalVisible(true);
  };

  // Handle send campaign
  const handleSendCampaign = (campaign) => {
    confirm({
      title: `Are you sure you want to send "${campaign.name}" campaign?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This will send messages to all recipients in the selected segment.',
      okText: 'Yes, Send Now',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        message.success(`Campaign "${campaign.name}" has been sent successfully!`);
      },
    });
  };

  // Handle delete campaign
  const handleDeleteCampaign = (campaign) => {
    confirm({
      title: `Are you sure you want to delete "${campaign.name}" campaign?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success(`Campaign "${campaign.name}" has been deleted.`);
      },
    });
  };

  // Handle edit template
  const handleEditTemplate = (template) => {
    // Implement template editing
    console.log('Edit template:', template);
  };

  // Handle delete template
  const handleDeleteTemplate = (template) => {
    confirm({
      title: `Are you sure you want to delete "${template.name}" template?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. Campaigns using this template may be affected.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success(`Template "${template.name}" has been deleted.`);
      },
    });
  };

  // Handle next step in campaign creation
  const handleNextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(err => {
      console.error('Validation error:', err);
    });
  };

  // Handle previous step in campaign creation
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle campaign creation completion
  const handleCreateFinish = () => {
    form.validateFields().then(values => {
      console.log('Campaign created:', values);
      message.success('Campaign created successfully!');
      setCreateModalVisible(false);
    }).catch(err => {
      console.error('Validation error:', err);
    });
  };

  // Campaign creation steps
  const steps = [
    {
      title: 'Campaign Info',
      icon: <FileTextOutlined />,
      content: (
        <Form form={form} layout="vertical" requiredMark>
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true, message: 'Please enter a campaign name' }]}
          >
            <Input placeholder="e.g., Summer Promotion Launch" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Campaign Type"
            rules={[{ required: true, message: 'Please select a campaign type' }]}
            initialValue="email"
          >
            <Radio.Group 
              optionType="button" 
              buttonStyle="solid"
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <Radio.Button value="email">Email Campaign</Radio.Button>
              <Radio.Button value="sms">SMS Campaign</Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="promotion"
            label="Linked Promotion"
            rules={[{ required: true, message: 'Please select a promotion' }]}
          >
            <Select placeholder="Select a promotion">
              {promotions.map(promo => (
                <Option key={promo.id} value={promo.id}>{promo.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Brief description of this campaign" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Audience',
      icon: <UserOutlined />,
      content: (
        <>
          <Form.Item
            name="audience"
            label="Target Audience"
            rules={[{ required: true, message: 'Please select a target audience' }]}
          >
            <Select placeholder="Select audience segment">
              {customerSegments.map(segment => (
                <Option key={segment.id} value={segment.id}>
                  {segment.name} ({segment.count.toLocaleString()} customers)
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="customAudience"
            label="Upload Custom List"
            extra="Upload a CSV file with customer emails or phone numbers"
          >
            <Dragger
              accept=".csv"
              maxCount={1}
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">CSV file with headers: Email/Phone, Name, etc.</p>
            </Dragger>
          </Form.Item>
          
          <Form.Item
            name="excludeRecent"
            label="Exclude Recent Recipients"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Content',
      icon: <FileDoneOutlined />,
      content: (
        <>
          <Form.Item
            name="templateType"
            label="Template Type"
            initialValue="existing"
          >
            <Segmented
              options={[
                { label: 'Use Existing Template', value: 'existing' },
                { label: 'Create New Template', value: 'new' },
              ]}
              onChange={value => setTemplateType(value)}
            />
          </Form.Item>
          
          {templateType === 'existing' ? (
            <Form.Item
              name="template"
              label="Select Template"
              rules={[{ required: true, message: 'Please select a template' }]}
            >
              <Select placeholder="Select template">
                {templates
                  .filter(t => t.type === form.getFieldValue('type'))
                  .map(template => (
                    <Option key={template.id} value={template.id}>{template.name}</Option>
                  ))}
              </Select>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="templateName"
                label="Template Name"
                rules={[{ required: true, message: 'Please enter a template name' }]}
              >
                <Input placeholder="e.g., Summer Promo Email" />
              </Form.Item>
              
              <Form.Item
                name="subject"
                label={form.getFieldValue('type') === 'email' ? "Email Subject" : "SMS Title"}
                rules={[{ required: true, message: 'Please enter a subject line' }]}
              >
                <Input placeholder={form.getFieldValue('type') === 'email' ? "e.g., Don't Miss Our Summer Sale!" : "e.g., Summer Sale Alert!"} />
              </Form.Item>
              
              <Form.Item
                name="content"
                label="Message Content"
                rules={[{ required: true, message: 'Please enter message content' }]}
              >
                <TextArea 
                  rows={6} 
                  placeholder={form.getFieldValue('type') === 'email' 
                    ? "Enter email content. You can use placeholders like {{customer_name}}, {{promotion_code}}, etc."
                    : "Enter SMS content. Keep it concise! You can use placeholders like {{name}}, {{code}}, etc."}
                />
              </Form.Item>
              
              {form.getFieldValue('type') === 'email' && (
                <Form.Item
                  name="attachments"
                  label="Attachments"
                >
                  <Upload listType="picture" maxCount={3}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              )}
            </>
          )}
          
          <Form.Item
            name="personalizeContent"
            label="Personalize Content"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Schedule',
      icon: <CalendarOutlined />,
      content: (
        <>
          <Form.Item
            name="sendType"
            label="When to Send"
            initialValue="now"
          >
            <Radio.Group>
              <Radio value="now">Send Immediately</Radio>
              <Radio value="schedule">Schedule for Later</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="scheduledDate"
            label="Scheduled Date & Time"
            dependencies={['sendType']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('sendType') !== 'schedule' || value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Please select a date and time'));
                },
              }),
            ]}
          >
            <Input.Group compact>
              <Form.Item
                name="scheduledDate"
                noStyle
              >
                <Input style={{ width: '100%' }} disabled={form.getFieldValue('sendType') === 'now'} placeholder="Select date and time" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          
          <Form.Item
            name="sendTestMessage"
            label="Send Test Message"
            extra="Send a test message to verify content before sending to all recipients"
          >
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 120px)' }}
                placeholder={form.getFieldValue('type') === 'email' ? "Enter test email" : "Enter test phone number"}
              />
              <Button type="primary" style={{ width: '120px' }}>Send Test</Button>
            </Input.Group>
          </Form.Item>
        </>
      ),
    },
  ];

  // Define the tab items
  const emailTabItems = [
    {
      key: "1",
      label: "Campaigns",
      children: (
        <Table
          columns={campaignColumns}
          dataSource={campaigns.filter(c => c.type === 'email')}
          pagination={{ 
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      )
    },
    {
      key: "2",
      label: "Templates",
      children: (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
          >
            Create Template
          </Button>
          <Table
            columns={templateColumns}
            dataSource={templates}
            pagination={{ 
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </div>
      )
    },
    {
      key: "3",
      label: "Analytics",
      children: (
        <Table
          columns={[
            ...campaignColumns.filter(col => col.key !== 'actions'),
            {
              title: 'Performance',
              key: 'performance',
              render: (_, record) => (
                <Space direction="vertical" size={0}>
                  {record.type === 'email' && (
                    <>
                      <Text>Open Rate: {record.openRate}%</Text>
                      <Text>Click Rate: {record.clickRate}%</Text>
                    </>
                  )}
                  {record.type === 'sms' && (
                    <>
                      <Text>Delivery Rate: {record.deliveryRate}%</Text>
                      <Text>Click Rate: {record.clickRate}%</Text>
                    </>
                  )}
                  <Text>Conversion: {record.conversionRate}%</Text>
                </Space>
              ),
            },
          ]}
          dataSource={campaigns.filter(c => c.status === 'sent')}
          pagination={{ 
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      )
    }
  ];

  // Define campaignDetailTabItems for the nested tabs in campaign detail modal
  const campaignDetailTabItems = selectedCampaign ? [
    {
      key: "details",
      label: "Campaign Details",
      children: (
        <div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Campaign Name" span={2}>{selectedCampaign.name}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={selectedCampaign.type === 'email' ? 'blue' : 'green'}>
                {selectedCampaign.type === 'email' ? 'Email' : 'SMS'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedCampaign.status === 'sent' ? 'green' : 
                selectedCampaign.status === 'scheduled' ? 'blue' : 'orange'
              }>
                {selectedCampaign.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Linked Promotion" span={2}>{selectedCampaign.promotion}</Descriptions.Item>
            <Descriptions.Item label="Template">{selectedCampaign.template}</Descriptions.Item>
            <Descriptions.Item label="Recipients">{selectedCampaign.recipients || '-'}</Descriptions.Item>
            {selectedCampaign.status === 'sent' && (
              <>
                <Descriptions.Item label="Sent Date">{selectedCampaign.sentDate}</Descriptions.Item>
                <Descriptions.Item label="Delivery Rate">{selectedCampaign.deliveryRate}%</Descriptions.Item>
                {selectedCampaign.type === 'email' && (
                  <Descriptions.Item label="Open Rate">{selectedCampaign.openRate}%</Descriptions.Item>
                )}
                <Descriptions.Item label="Click Rate">{selectedCampaign.clickRate}%</Descriptions.Item>
                <Descriptions.Item label="Conversion Rate">{selectedCampaign.conversionRate}%</Descriptions.Item>
              </>
            )}
            {selectedCampaign.status === 'scheduled' && (
              <Descriptions.Item label="Scheduled Date" span={2}>{selectedCampaign.scheduledDate}</Descriptions.Item>
            )}
          </Descriptions>
        </div>
      )
    },
    {
      key: "preview",
      label: "Content Preview",
      children: (
        <div style={{ padding: '16px', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
          <Title level={5}>Campaign Preview</Title>
          <Paragraph>
            This is a preview of the {selectedCampaign.type} content. In a real application, you would see the actual
            template content with placeholders replaced with sample data.
          </Paragraph>
          {selectedCampaign.type === 'email' && (
            <div style={{ padding: '16px', border: '1px solid #d9d9d9', background: '#f5f5f5', borderRadius: '4px' }}>
              <Title level={5}>Subject: Special Offer - {selectedCampaign.promotion}</Title>
              <Paragraph>
                Hello [Customer Name],<br /><br />
                
                We're excited to share our {selectedCampaign.promotion} with you!<br /><br />
                
                [Promotion Details]<br /><br />
                
                Use code: <strong>PROMO123</strong> to redeem this offer.<br /><br />
                
                Valid until: [End Date]<br /><br />
                
                Shop now: [Link]<br /><br />
                
                Thank you,<br />
                Your Store Team
              </Paragraph>
            </div>
          )}
          
          {selectedCampaign.type === 'sms' && (
            <div style={{ padding: '16px', border: '1px solid #d9d9d9', background: '#f5f5f5', borderRadius: '4px' }}>
              <Paragraph>
                [Your Store]: {selectedCampaign.promotion} is now live! Use code PROMO123 for special discounts. 
                Shop now: [link] Reply STOP to opt out.
              </Paragraph>
            </div>
          )}
        </div>
      )
    },
    {
      key: "analytics",
      label: "Analytics",
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic 
                  title="Recipients" 
                  value={selectedCampaign.recipients} 
                  suffix="customers"
                />
              </Card>
            </Col>
            
            {selectedCampaign.type === 'email' && (
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic 
                    title="Open Rate" 
                    value={selectedCampaign.openRate} 
                    suffix="%" 
                    precision={1}
                  />
                </Card>
              </Col>
            )}
            
            <Col span={8}>
              <Card bordered={false}>
                <Statistic 
                  title="Click Rate" 
                  value={selectedCampaign.clickRate} 
                  suffix="%" 
                  precision={1}
                />
              </Card>
            </Col>
            
            <Col span={8}>
              <Card bordered={false}>
                <Statistic 
                  title="Conversion Rate" 
                  value={selectedCampaign.conversionRate} 
                  suffix="%" 
                  precision={1}
                />
              </Card>
            </Col>
            
            <Col span={8}>
              <Card bordered={false}>
                <Statistic 
                  title="Revenue Generated" 
                  value={Math.round(selectedCampaign.recipients * selectedCampaign.conversionRate / 100 * 50)} 
                  prefix="$"
                />
              </Card>
            </Col>
          </Row>
          
          <Divider />
          
          <Paragraph>
            Detailed analytics and customer engagement data would be displayed here, including:
          </Paragraph>
          <ul>
            <li>Click map (for emails)</li>
            <li>Time-based engagement</li>
            <li>Device/platform breakdown</li>
            <li>Geographic distribution</li>
            <li>Conversion funnel</li>
          </ul>
        </div>
      )
    }
  ] : [];

  return (
    <div className="marketing-integration">

      <Card 
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/promotions')}
            >
              Back
            </Button>
          </Space>
        }
        className="marketing-card"
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateCampaign}
          >
            Create Campaign
          </Button>
        }
      >
        <Tabs defaultActiveKey="1" items={emailTabItems} />
      </Card>
      
      {/* Create Campaign Modal */}
      <Modal
        title="Create Campaign"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </Button>,
          currentStep > 0 && (
            <Button key="back" onClick={handlePrevStep}>
              Previous
            </Button>
          ),
          currentStep < steps.length - 1 ? (
            <Button key="next" type="primary" onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleCreateFinish}>
              Create Campaign
            </Button>
          ),
        ]}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>
        
        <Form
          form={form}
          layout="vertical"
          requiredMark
        >
          <div className="steps-content">{steps[currentStep].content}</div>
        </Form>
      </Modal>
      
      {/* Campaign Detail Modal */}
      {campaignDetailModalVisible && selectedCampaign && (
        <Modal
          title={`Campaign Details: ${selectedCampaign.name}`}
          open={campaignDetailModalVisible}
          onCancel={() => setCampaignDetailModalVisible(false)}
          width={800}
          footer={[
            <Button key="back" onClick={() => setCampaignDetailModalVisible(false)}>
              Close
            </Button>,
            selectedCampaign.status === 'draft' && (
              <Button 
                key="send" 
                type="primary" 
                onClick={() => handleSendCampaign(selectedCampaign)}
              >
                Send Campaign
              </Button>
            )
          ]}
        >
          <Tabs items={campaignDetailTabItems} />
        </Modal>
      )}
    </div>
  );
};

export default MarketingIntegration; 