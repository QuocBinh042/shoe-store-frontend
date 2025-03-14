import { fetchData,postData } from './apiService'
export const getDiscountByProduct = async (id) => {
    const data = await fetchData(`promotion/discount-price/by-product-id/${id}`);
    return data.data;
};
export const getPromotionByProduct = async (id) => {
    const data = await fetchData(`promotion/by-product-id/${id}`);
    return data.data;
};