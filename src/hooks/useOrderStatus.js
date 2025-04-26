import { useState } from 'react';
import { updateOrderStatus } from '../services/orderService';

const useOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateOrderStatus(orderId, { status });

      if (response.statusCode === 200) {
        return response.data;  
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateOrderStatus: handleUpdateOrderStatus,
    loading,
    error
  };
};

export default useOrderStatus;
