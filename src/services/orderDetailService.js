import { fetchData,postData, putData } from './apiService'
export const addOrderDetails = async (orderDetail) => {
    // console.log(orderDetail)
    const data = await postData(`order-details/add`, orderDetail);
   
    if (data) {
        console.log('Order detail added successfully:', data);
    }
    return data;
};
export const fetchOrderDetailByOrder = async (id) => {
    const data = await fetchData(`order-details/by-order-id/${id}`);
    return data.data;
};

export const getOrderDetailByOrder = async (orderId) => {
    const data = await fetchData(`order-details/order/${orderId}/details`);
    return data;
};

export const updateOrderDetail = async (orderDetailId, data) => {
    const response = await putData(`order-details/${orderDetailId}`, data);
    return response.data;
  };