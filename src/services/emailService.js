import { postData } from './apiService'; 

export const sendOrderStatusEmail = async (orderId, status) => {
  const endpoint = `/admin/email/order-status/${orderId}?status=${status}`;
  return postData(endpoint, null); 
};
