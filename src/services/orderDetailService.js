import { fetchData,postData } from './apiService'
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