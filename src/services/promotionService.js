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
  return data;
};

export const getPromotionById = async (id) => {
  const data = await fetchData(`promotions/${id}`);
  return data;
};

export const createPromotion = async (promotionDTO) => {
  const data = await postData(`promotions`, promotionDTO);
  console.log(data)
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

export const searchPromotions = async (params) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.type) query.append('type', params.type);
  if (params.name) query.append('name', params.name);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.page) query.append('page', params.page);
  if (params.pageSize) query.append('pageSize', params.pageSize);

  const data = await fetchData(`promotions/search?${query.toString()}`);
  return data;
};

export const countUpcomingPromotions = async () => {
  const data = await fetchData(`promotions/count/upcoming`);
  return data.data;
};

export const countActivePromotions = async () => {
  const data = await fetchData(`promotions/count/active`);
  return data.data;
};

export const getAppliedPromotionsForProduct = async (productId) => {
  const data = await fetchData(`promotions/applied/${productId}`);
  return data.data;
};

export const getDiscountedPrice = async (productId) => {
  const data = await fetchData(`promotions/final-price/${productId}`);
  return data.data;
};