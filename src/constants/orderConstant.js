export const STATUS_OPTION = [
  { key: 'ALL', label: 'ALL' },
  { key: 'PENDING', label: 'PENDING' },
  { key: 'CONFIRMED', label: 'CONFIRMED' },
  { key: 'SHIPPED', label: 'SHIPPED' },
  { key: 'DELIVERED', label: 'DELIVERED' },
  { key: 'CANCELED', label: 'CANCELED' },
];

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELED'
];

export const ORDER_STATUS_DETAILS = {
  PENDING: {
    title: 'Order Placed',
    description: 'Your order has been placed successfully.'
  },
  CONFIRMED: {
    title: 'Order Confirmed',
    description: 'Order has been confirmed by admin.'
  },
  PROCESSING: {
    title: 'Preparing Shipment',
    description: 'Items are being packed and prepared.'
  },
  SHIPPED: {
    title: 'Out for Delivery',
    description: 'Order is out for delivery.'
  },
  DELIVERED: {
    title: 'Delivered',
    description: 'Order has been delivered to customer.'
  },
  CANCELED: {
    title: 'Canceled',
    description: 'Order was canceled by user or admin.',
  },
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'gold';
    case 'CONFIRMED': return 'cyan';
    case 'PROCESSING': return 'orange';
    case 'SHIPPED': return 'blue';
    case 'DELIVERED': return 'green';
    case 'CANCELLED': return 'red';
    default: return 'default';
  }
};
