import { fetchData,postData } from './apiService'
export const getPromotionByProduct = async (id) => {
    const data = await fetchData(`promotion/by-product-id/${id}`);
    return data.data;
};