import { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Statistic,
  Typography,
  Alert,
  notification
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  SettingOutlined,
  CarOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Dashboard Statistics Component
const stats = [
  {
    title: 'Total Orders',
    value: 2,
    icon: <CarOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    color: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  {
    title: 'Pending Shipments',
    value: 2,
    icon: <GlobalOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    color: '#e6f7ff',
    borderColor: '#91d5ff',
  },
  {
    title: 'Delivered Orders',
    value: 985,
    icon: <EnvironmentOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
    color: '#f9f0ff',
    borderColor: '#d3adf7',
  },
  {
    title: 'Total Revenue',
    value: '$23,503.00',
    icon: <DollarOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
    color: '#fff7e6',
    borderColor: '#ffd591',
  },
];

const ShipmentStats = () => (
  <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: 16 }}>
    {stats.map((stat, index) => (
      <Col xs={24} sm={12} lg={6} key={index}>
        <Card
          className="stat-card"
          bordered={false}
          style={{
            backgroundColor: stat.color,
            borderLeft: `4px solid ${stat.borderColor}`,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
          }}
        >
          <Statistic
            title={<Text strong>{stat.title}</Text>}
            value={stat.value}
            prefix={stat.icon}
            valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
          />
        </Card>
      </Col>
    ))}
  </Row>
);

// Shipping Orders Component
const ShippingOrders = ({ orders, onEditOrder, onPrintLabel, onFilterChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const getStatusColor = status =>
    ({
      active: 'green',
      inactive: 'red',
      pending: 'orange'
    }[status] || 'gray');
  
  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Shipping Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 'bold', padding: '4px 8px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => onEditOrder(record)} />
          <Button icon={<PrinterOutlined />} size="small" onClick={() => onPrintLabel(record)} />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const printSelectedLabels = () => {
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: 'No orders selected',
        description: 'Please select at least one order to print labels',
      });
      return;
    }

    notification.success({
      message: 'Labels prepared for printing',
      description: `${selectedRowKeys.length} shipping labels have been sent to printer`,
    });
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={printSelectedLabels}
            disabled={selectedRowKeys.length === 0}
          >
            Print Selected Labels ({selectedRowKeys.length})
          </Button>
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={onFilterChange}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="in_transit">In Transit</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="failed">Failed</Option>
          </Select>
        </Space>
      </div>
      <Table
        columns={orderColumns}
        dataSource={orders}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </>
  );
};

// Shipping Methods Component
const ShippingMethods = ({ methods, onAddMethod, onEditMethod, onDeleteMethod }) => {
  const methodColumns = [
    {
      title: 'Method Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Base Cost',
      dataIndex: 'baseCost',
      key: 'baseCost',
      render: (cost) => `${cost}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => onEditMethod(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDeleteMethod(record)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddMethod}
        >
          Add Shipping Method
        </Button>
      </div>
      <Table
        columns={methodColumns}
        dataSource={methods}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </>
  );
};

// Shipping Carriers Component
const ShippingCarriers = ({ carriers, onAddCarrier, onConfigureCarrier, onDeleteCarrier }) => {
  const carrierColumns = [
    {
      title: 'Carrier Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'API Status',
      dataIndex: 'apiStatus',
      key: 'apiStatus',
      render: (status) => (
        <Tag color={status === 'connected' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<SettingOutlined />}
            size="small"
            onClick={() => onConfigureCarrier(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => onDeleteCarrier(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddCarrier}
        >
          Add Carrier
        </Button>
      </div>
      <Table
        columns={carrierColumns}
        dataSource={carriers}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </>
  );
};

// Shipping Zones Component
const ShippingZones = ({ zones, onAddZone, onEditZone, onDeleteZone }) => {
  const zoneColumns = [
    {
      title: 'Zone Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Regions',
      dataIndex: 'regions',
      key: 'regions',
    },
    {
      title: 'Methods Available',
      dataIndex: 'methods',
      key: 'methods',
      render: (methods) => (
        <Space>
          {methods.map(method => (
            <Tag key={method}>{method}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditZone(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => onDeleteZone(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddZone}
        >
          Add Zone
        </Button>
      </div>
      <Table
        columns={zoneColumns}
        dataSource={zones}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </>
  );
};

// Reports Component
const ShippingReports = () => (
  <Alert
    message="Coming Soon"
    description="Detailed shipping analytics and reports will be available in the next update."
    type="info"
    showIcon
  />
);

// Method Modal Component
const MethodModal = ({ open, initialValues, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Edit Shipping Method" : "Add Shipping Method"}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
          form.resetFields();
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Method Name"
          rules={[{ required: true, message: 'Please enter method name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="baseCost"
          label="Base Cost"
          rules={[{ required: true, message: 'Please enter base cost' }]}
        >
          <InputNumber
            prefix="$"
            min={0}
            step={0.01}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          initialValue="active"
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Carrier Modal Component
const CarrierModal = ({ open, initialValues, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Edit Shipping Carrier" : "Add Shipping Carrier"}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
          form.resetFields();
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Carrier Name"
          rules={[{ required: true, message: 'Please enter carrier name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apiKey"
          label="API Key"
          rules={[{ required: true, message: 'Please enter API key' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="apiEndpoint"
          label="API Endpoint"
          rules={[{ required: true, message: 'Please enter API endpoint' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="webhookUrl"
          label="Webhook URL (Optional)"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Zone Modal Component
const ZoneModal = ({ open, initialValues, onCancel, onSubmit, methods }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const methodOptions = methods.map(method => ({
    label: method.name,
    value: method.name,
  }));

  return (
    <Modal
      title={initialValues ? "Edit Shipping Zone" : "Add Shipping Zone"}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
          form.resetFields();
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Zone Name"
          rules={[{ required: true, message: 'Please enter zone name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="regions"
          label="Regions"
          rules={[{ required: true, message: 'Please select regions' }]}
        >
          <Select mode="multiple" placeholder="Select regions">
            <Option value="hanoi">Hanoi</Option>
            <Option value="hochiminh">Ho Chi Minh City</Option>
            <Option value="danang">Da Nang</Option>
            <Option value="haiphong">Hai Phong</Option>
            <Option value="cantho">Can Tho</Option>
            <Option value="other">Other Provinces</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="methods"
          label="Available Shipping Methods"
          rules={[{ required: true, message: 'Please select shipping methods' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select shipping methods"
            options={methodOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Order Edit Modal Component
const OrderEditModal = ({ open, initialValues, onCancel, onSubmit, methods }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title="Edit Shipping Order"
      open={open}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
          form.resetFields();
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="orderId"
          label="Order ID"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="customer"
          label="Customer"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Shipping Address"
          rules={[{ required: true, message: 'Please enter shipping address' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="method"
          label="Shipping Method"
          rules={[{ required: true, message: 'Please select shipping method' }]}
        >
          <Select>
            {methods.map(method => (
              <Option key={method.key} value={method.name}>{method.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="pending">Pending</Option>
            <Option value="in_transit">In Transit</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="failed">Failed</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Shipment = () => {
  const [activeTab, setActiveTab] = useState('1');

  // Modal visibility states
  const [methodModalVisible, setMethodModalVisible] = useState(false);
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [carrierModalVisible, setCarrierModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  // State for editing items
  const [currentMethod, setCurrentMethod] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [currentCarrier, setCurrentCarrier] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Status filter for orders
  const [statusFilter, setStatusFilter] = useState('all');

  // Data for all entities
  const [methodsData, setMethodsData] = useState([
    {
      key: '1',
      name: 'Standard Shipping',
      description: '3-5 business days',
      baseCost: 5.99,
      status: 'active',
    },
    {
      key: '2',
      name: 'Express Shipping',
      description: '1-2 business days',
      baseCost: 15.99,
      status: 'active',
    },
    {
      key: '3',
      name: 'Same-day Delivery',
      description: 'Delivery within 24 hours',
      baseCost: 25.99,
      status: 'active',
    },
  ]);

  const [ordersData, setOrdersData] = useState([
    {
      key: '1',
      orderId: '#12345',
      customer: 'John Doe',
      address: '123 Main St, City',
      method: 'Standard Shipping',
      status: 'in_transit',
    },
    {
      key: '2',
      orderId: '#12346',
      customer: 'Jane Smith',
      address: '456 Oak St, Town',
      method: 'Express Shipping',
      status: 'pending',
    },
    {
      key: '3',
      orderId: '#12347',
      customer: 'Robert Johnson',
      address: '789 Pine St, Village',
      method: 'Standard Shipping',
      status: 'delivered',
    },
    {
      key: '4',
      orderId: '#12348',
      customer: 'Sarah Williams',
      address: '101 Maple St, City',
      method: 'Same-day Delivery',
      status: 'failed',
    },
  ]);

  const [carriersData, setCarriersData] = useState([
    {
      key: '1',
      name: 'GHN Express',
      apiStatus: 'connected',
      apiKey: 'ghn_test_key_123',
      apiEndpoint: 'https://api.ghn.vn/v1',
    },
    {
      key: '2',
      name: 'GHTK',
      apiStatus: 'connected',
      apiKey: 'ghtk_test_key_456',
      apiEndpoint: 'https://api.ghtk.vn/v1',
    },
    {
      key: '3',
      name: 'Vietnam Post',
      apiStatus: 'disconnected',
      apiKey: '',
      apiEndpoint: 'https://api.vnpost.vn/v1',
    },
  ]);

  const [zonesData, setZonesData] = useState([
    {
      key: '1',
      name: 'North Vietnam',
      regions: 'Hanoi, Hai Phong, etc.',
      methods: ['Standard Shipping', 'Express Shipping'],
    },
    {
      key: '2',
      name: 'South Vietnam',
      regions: 'Ho Chi Minh City, Can Tho, etc.',
      methods: ['Standard Shipping', 'Express Shipping', 'Same-day Delivery'],
    },
    {
      key: '3',
      name: 'Central Vietnam',
      regions: 'Da Nang, Hue, etc.',
      methods: ['Standard Shipping'],
    },
  ]);

  // Statistics data
  const stats = {
    totalOrders: 156,
    pendingShipments: 23,
    avgDeliveryTime: '3.2 days',
    revenue: 12580,
  };

  // Filtered orders based on status
  const filteredOrders = statusFilter === 'all'
    ? ordersData
    : ordersData.filter(order => order.status === statusFilter);

  // Method handlers
  const handleAddMethod = () => {
    setCurrentMethod(null);
    setMethodModalVisible(true);
  };

  const handleEditMethod = (method) => {
    setCurrentMethod(method);
    setMethodModalVisible(true);
  };

  const handleDeleteMethod = (method) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this shipping method?',
      content: `This will delete "${method.name}" and cannot be undone.`,
      onOk: () => {
        setMethodsData(methodsData.filter(item => item.key !== method.key));
        notification.success({
          message: 'Method deleted',
          description: `${method.name} has been deleted successfully`,
        });
      },
    });
  };

  const handleMethodSubmit = (values) => {
    if (currentMethod) {
      // Edit existing method
      setMethodsData(methodsData.map(item =>
        item.key === currentMethod.key ? { ...item, ...values } : item
      ));
      notification.success({
        message: 'Method updated',
        description: `${values.name} has been updated successfully`,
      });
    } else {
      // Add new method
      const newMethod = {
        key: String(methodsData.length + 1),
        ...values,
      };
      setMethodsData([...methodsData, newMethod]);
      notification.success({
        message: 'Method added',
        description: `${values.name} has been added successfully`,
      });
    }
    setMethodModalVisible(false);
  };

  // Carrier handlers
  const handleAddCarrier = () => {
    setCurrentCarrier(null);
    setCarrierModalVisible(true);
  };

  const handleConfigureCarrier = (carrier) => {
    setCurrentCarrier(carrier);
    setCarrierModalVisible(true);
  };

  const handleDeleteCarrier = (carrier) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this carrier?',
      content: `This will delete "${carrier.name}" and cannot be undone.`,
      onOk: () => {
        setCarriersData(carriersData.filter(item => item.key !== carrier.key));
        notification.success({
          message: 'Carrier deleted',
          description: `${carrier.name} has been deleted successfully`,
        });
      },
    });
  };

  const handleCarrierSubmit = (values) => {
    if (currentCarrier) {
      // Edit existing carrier
      setCarriersData(carriersData.map(item =>
        item.key === currentCarrier.key
          ? { ...item, ...values, apiStatus: values.apiKey ? 'connected' : 'disconnected' }
          : item
      ));
      notification.success({
        message: 'Carrier updated',
        description: `${values.name} has been updated successfully`,
      });
    } else {
      // Add new carrier
      const newCarrier = {
        key: String(carriersData.length + 1),
        ...values,
        apiStatus: values.apiKey ? 'connected' : 'disconnected',
      };
      setCarriersData([...carriersData, newCarrier]);
      notification.success({
        message: 'Carrier added',
        description: `${values.name} has been added successfully`,
      });
    }
    setCarrierModalVisible(false);
  };

  // Zone handlers
  const handleAddZone = () => {
    setCurrentZone(null);
    setZoneModalVisible(true);
  };

  const handleEditZone = (zone) => {
    setCurrentZone(zone);
    setZoneModalVisible(true);
  };

  const handleDeleteZone = (zone) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this shipping zone?',
      content: `This will delete "${zone.name}" and cannot be undone.`,
      onOk: () => {
        setZonesData(zonesData.filter(item => item.key !== zone.key));
        notification.success({
          message: 'Zone deleted',
          description: `${zone.name} has been deleted successfully`,
        });
      },
    });
  };

  const handleZoneSubmit = (values) => {
    if (currentZone) {
      // Edit existing zone
      setZonesData(zonesData.map(item =>
        item.key === currentZone.key ? { ...item, ...values } : item
      ));
      notification.success({
        message: 'Zone updated',
        description: `${values.name} has been updated successfully`,
      });
    } else {
      // Add new zone
      const newZone = {
        key: String(zonesData.length + 1),
        ...values,
      };
      setZonesData([...zonesData, newZone]);
      notification.success({
        message: 'Zone added',
        description: `${values.name} has been added successfully`,
      });
    }
    setZoneModalVisible(false);
  };

  // Order handlers
  const handleEditOrder = (order) => {
    setCurrentOrder(order);
    setOrderModalVisible(true);
  };

  const handleOrderSubmit = (values) => {
    setOrdersData(ordersData.map(item =>
      item.key === currentOrder.key ? { ...item, ...values } : item
    ));
    notification.success({
      message: 'Order updated',
      description: `Order ${values.orderId} has been updated successfully`,
    });
    setOrderModalVisible(false);
  };

  const handlePrintLabel = (order) => {
    notification.success({
      message: 'Label printed',
      description: `Shipping label for order ${order.orderId} has been sent to printer`,
      icon: <PrinterOutlined style={{ color: '#1890ff' }} />,
    });
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  // Tab items for the Tabs component
  const tabItems = [
    {
      key: '1',
      label: 'Dashboard',
      children: (
        <>
          <ShipmentStats />
          <ShippingOrders orders={filteredOrders} onEditOrder={handleEditOrder} onPrintLabel={handlePrintLabel} onFilterChange={handleFilterChange} />
        </>
      )
    },
    {
      key: '2',
      label: 'Shipping Methods',
      children: (
        <ShippingMethods
          methods={methodsData}
          onAddMethod={handleAddMethod}
          onEditMethod={handleEditMethod}
          onDeleteMethod={handleDeleteMethod}
        />
      )
    },
    {
      key: '3',
      label: 'Shipping Carriers',
      children: (
        <ShippingCarriers
          carriers={carriersData}
          onAddCarrier={handleAddCarrier}
          onConfigureCarrier={handleConfigureCarrier}
          onDeleteCarrier={handleDeleteCarrier}
        />
      )
    },
    {
      key: '4',
      label: 'Shipping Zones',
      children: (
        <ShippingZones
          zones={zonesData}
          onAddZone={handleAddZone}
          onEditZone={handleEditZone}
          onDeleteZone={handleDeleteZone}
        />
      )
    },
    {
      key: '5',
      label: 'Reports',
      children: <ShippingReports />
    }
  ];

  return (
    <div className="shipping-admin">
      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>

      {/* Modals for all shipping-related operations */}
      <MethodModal
        open={methodModalVisible}
        initialValues={currentMethod}
        onCancel={() => setMethodModalVisible(false)}
        onSubmit={handleMethodSubmit}
      />

      <CarrierModal
        open={carrierModalVisible}
        initialValues={currentCarrier}
        onCancel={() => setCarrierModalVisible(false)}
        onSubmit={handleCarrierSubmit}
      />

      <ZoneModal
        open={zoneModalVisible}
        initialValues={currentZone}
        onCancel={() => setZoneModalVisible(false)}
        onSubmit={handleZoneSubmit}
        methods={methodsData}
      />

      <OrderEditModal
        open={orderModalVisible}
        initialValues={currentOrder}
        onCancel={() => setOrderModalVisible(false)}
        onSubmit={handleOrderSubmit}
        methods={methodsData}
      />
    </div>
  );
};

export default Shipment;