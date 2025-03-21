import { fetchData } from './apiService'
export const fetchProductByProductDetailId = async (id) => {
  const data = await fetchData(`products/by-product-details-id/${id}`);
  return data.data;
};
export const fetchProductById = async (id) => {
  const data = await fetchData(`products/${id}`);
  return data.data;
};

export const getAllProducts = async ({ page = 1, pageSize = 12 }) => {
  const data = await fetchData(`products?page=${page}&pageSize=${pageSize}&forceReload=1`);
  return data;
};