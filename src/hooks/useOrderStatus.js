import { useState } from 'react';
import { updateOrderStatus } from '../services/orderService';

const useOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateOrderStatus = async (orderId, statusData) => {
    try {
      setLoading(true);
      setError(null);

      // If statusData is just a string, convert it to an object
      const data = typeof statusData === 'string' 
        ? { status: statusData } 
        : statusData;

      const response = await updateOrderStatus(orderId, data);

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
