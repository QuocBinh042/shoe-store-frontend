import { fetchData, postData, putData } from './apiService'
export const fetchProductDetailById = async (id) => {
  const data = await fetchData(`product-details/${id}`);
  return data.data;
};
export const fetchProductDetailByProductId = async (id) => {
  const data = await fetchData(`product-details/by-product-id/${id}`);
  return data.data;
};
export const fetchProductDetailByOrderDetail = async (id) => {
  const data = await fetchData(`product-details/by-product-id/${id}`);
  return data.data;
};

export const createProductDetail = async (productId, productDetail) => {
  const data = await postData(`product-details/${productId}`, productDetail);
  return data;
}

export const updateProductDetail = async (id, productDetail) => {
  const data = await putData(`product-details/${id}`, productDetail);
  return data;
}