import { fetchData,postData } from './apiService'
export const addPayment = async (payment) => {
    const data = await postData(`payment/add`, payment);
    if (data) {
        console.log('Payment added successfully:', data);
    }
    return data;
};
export const getVnPayUrl = async (amount,code) => {
    const data = await fetchData(`payment/vn-pay/get-link-pay?amount=${amount}&code=${code}`);
    return data.data
};
export const fetcPaymentByOrder = async (id) => {
    const data = await fetchData(`payment/by-order-id/${id}`);
    return data.data;
};