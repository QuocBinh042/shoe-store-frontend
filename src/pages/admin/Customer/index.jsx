import { useEffect, useState } from 'react';
import { Table, Row, Col, Input, Button, Tag, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { createCustomer, getCustomers, getDeliveredOrdersCount, getTotalAmountByUserId, searchUsers } from '../../../services/userService';
import { currencyFormat } from '../../../utils/helper';
import './Customer.scss';
import EditDetail from './EditDetail';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailView = location.pathname.includes('/admin/customers/');

  const loadCustomers = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const data = await getCustomers(page, size);
      if (data.statusCode === 200) {
        const enhanced = await enhanceCustomers(data.data.items);
        setCustomers(enhanced);
        setPagination(prev => ({
          ...prev,
          currentPage: data.data.currentPage || page,
          pageSize: data.data.pageSize || size,
          totalElements: data.data.totalElements,
          totalPages: Math.ceil(data.data.totalElements / size),
        }));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      message.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.pathname.includes("/admin/customers/")) {
      loadCustomers(pagination.currentPage, pagination.pageSize);
    }
  }, [location.pathname, refresh]);

  const enhanceCustomers = async (customers) => {
    return Promise.all(
      customers.map(async (customer) => {
        const count = await getDeliveredOrdersCount(customer.userID);
        const amount = await getTotalAmountByUserId(customer.userID);
        return {
          key: customer.userID,
          customerName: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          status: customer.status,
          customerGroup: customer.customerGroup,
          order: count,
          totalSpent: currencyFormat(amount),
          initials: customer.name.split(' ').map(n => n[0]).join(''),
        };
      })
    );
  };

  const handleSearch = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      let data;
      if (searchKeyword.trim() === '') {
        data = await getCustomers(page, size);
      } else {
        data = await searchUsers(searchKeyword, page, size);
      }
      if (data.statusCode === 200) {
        const enhanced = await enhanceCustomers(data.data.items);
        setCustomers(enhanced);
        setPagination(prev => ({
          ...prev,
          currentPage: data.data.currentPage || page,
          pageSize: data.data.pageSize || size,
          totalElements: data.data.totalElements,
          totalPages: Math.ceil(data.data.totalElements / size),
        }));
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      message.error('Failed to search customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newCustomer) => {
    try {
      newCustomer.customerGroup = newCustomer.customerGroup || 'NEW';
      const data = await createCustomer(newCustomer);
      if (data.statusCode === 201) {
        message.success('Customer added successfully');
        setRefresh(!refresh);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      message.error('Failed to add customer');
    }
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    setPagination(prev => ({ ...prev, currentPage: current, pageSize }));
    if (searchKeyword.trim() === '') {
      loadCustomers(current, pageSize);
    } else {
      handleSearch(current, pageSize);
    }
  };

  const columns = [
    {
      title: 'CUSTOMER',
      dataIndex: 'customerName',
      key: 'customer',
      render: (__, record) => (
        <div style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div>{record.customerName}</div>
        </div>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (__, record) => (
        <Tag
          color={record.status === 'ACTIVE' ? 'green' : 'red'}
          style={{ fontWeight: record.status === 'ACTIVE' ? 'bold' : 'normal' }}
        >
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'TYPE',
      dataIndex: 'customerGroup',
      align: 'center',
      key: 'customerGroup',
      render: (__, record) => {
        let color, fontWeight;
        switch (record.customerGroup) {
          case 'NEW':
            color = 'blue';
            fontWeight = 'bold';
            break;
          case 'EXISTING':
            color = 'gold';
            fontWeight = 'normal';
            break;
          case 'VIP':
            color = 'purple';
            fontWeight = 'bold';
            break;
          default:
            color = 'default';
            fontWeight = 'normal';
        }
        return (
          <Tag color={color} style={{ fontWeight }}>
            {record.customerGroup}
          </Tag>
        );
      },
    },
    { title: 'ORDER', dataIndex: 'order', key: 'order' },
    {
      title: 'TOTAL SPENT',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (__, record) => (
        <div style={{ fontWeight: 'bold', color: 'red' }}>{record.totalSpent}</div>
      ),
    },
  ];

  const onRow = (record) => {
    return {
      onClick: () => {
        navigate(`/admin/customers/${record.key}`, {
          state: { customer: record, refresh: true },
        });
      },
    };
  };

  if (isDetailView) {
    return <Outlet />;
  }

  return (
    <div style={{ background: '#f7f7f7', padding: 8 }}>
      <div style={{ margin: 0, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 16, height: 'calc(120vh - 32px)' }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 8 }}>
          <Col flex="1">
            <Input.Search
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={() => handleSearch(1, pagination.pageSize)}
              placeholder="Search customer by name or email or phone number"
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          {/* <Col>
            <Button style={{ border: '1px solid #d9d9d9' }} icon={<DownloadOutlined />}>
              Export
            </Button>
          </Col> */}
          <Col>
            <Button type="primary" onClick={() => { setModalMode('add'); setShowModal(true); }}>
              + Add Customer
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={customers}
          onRow={onRow}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: pagination.totalElements,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowClassName="clickable-row"
        />

        <EditDetail
          open={showModal}
          onCancel={() => setShowModal(false)}
          customer={null}
          handleSave={handleAdd}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default Customer;