import { Table, Tag, Typography } from 'antd';
import { currencyFormat } from '../../../../utils/helper';
import { getStatusColor } from '../../../../constants/orderConstant';

const { Text } = Typography;

const OrderTable = ({ orders, totalOrdersCount, currentPage, pageSize, onPageChange, onNavigate }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'code',
      key: 'code',
      render: (code) => `#${code}`,
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (user?.name ? user.name : 'N/A'),
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <Text strong>{currencyFormat(total)}</Text>,
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
      title: 'Shipping Address',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      render: (addr) => addr || 'N/A',
    },
  ];

  return (
    <Table
      onRow={(record) => ({
        onClick: () => onNavigate(`/admin/orders/${record.orderID}`),
        style: { cursor: 'pointer' },
      })}
      columns={columns}
      dataSource={orders}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalOrdersCount,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
    />
  );
};

export default OrderTable; 