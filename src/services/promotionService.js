import { fetchData, postData, putData, deleteData } from './apiService';

export const getDiscountByProduct = async (id) => {
    const data = await fetchData(`promotions/discount-price/by-product-id/${id}`);
    return data.data;
};

export const getPromotionByProduct = async (id) => {
    const data = await fetchData(`promotions/by-product-id/${id}`);
    return data.data;
};

export const getAllPromotions = async (page = 1, size = 12) => {
    const data = await fetchData(`promotions?page=${page}&size=${size}`);
    return data
};

export const getPromotionById = async (id) => {
    const data = await fetchData(`promotions/${id}`);
    return data;
};

export const createPromotion = async (promotionDTO) => {
    const data = await postData(`promotions`, promotionDTO);
    return data;
};

export const updatePromotion = async (id, promotionDTO) => {
    const data = await putData(`promotions/${id}`, promotionDTO);
    return data;
};

export const deletePromotion = async (id) => {
    const data = await deleteData(`promotions/${id}`);
    return data;
};
