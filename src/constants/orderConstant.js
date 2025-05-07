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
    description: (changedByName) => changedByName ? `Order has been placed by ${changedByName} and is awaiting confirmation.` : 'Order has been placed and is awaiting confirmation.'
  },
  CONFIRMED: {
    title: 'Order Confirmed',
    description: (changedByName) => changedByName ? `Order confirmed by ${changedByName}` : 'Order has been confirmed by admin.'
  },
  PROCESSING: {
    title: 'Preparing Shipment',
    description: (changedByName) => changedByName ? `Order being processed by ${changedByName}` : 'Items are being packed and prepared.'
  },
  SHIPPED: {
    title: 'Out for Delivery',
    description: (changedByName) => changedByName ? `Order shipped by ${changedByName}` : 'Order is out for delivery.'
  },
  DELIVERED: {
    title: 'Delivered',
    description: (changedByName) => changedByName ? `Delivery confirmed by ${changedByName}` : 'Order has been delivered to customer.'
  },
  CANCELED: {
    title: 'Canceled',
    description: (changedByName) => changedByName ? `Order canceled by ${changedByName}` : 'Order was canceled by user or admin.',
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
