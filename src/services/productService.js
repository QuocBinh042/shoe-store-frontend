import { fetchData, postData, putData } from './apiService'

export const fetchProductByProductDetailId = async (id) => {
  const data = await fetchData(`products/by-product-details-id/${id}`);
  return data.data;
};

export const fetchProductById = async (id) => {
  const data = await fetchData(`products/${id}`);
  return data.data;
};

export const createProduct = async (product) => {
  console.log("product", product);  
  const data = await postData('products', product);
  return data;
};
export const getRating = async (id) => {
  const data = await fetchData(`products/get-rating/${id}`);
  return data.data;
};
export const getRelatedProduct = async (id) => {
  const data = await fetchData(`products/get-related/${id}`);
  return data.data;
};

export const updateProduct = async (id, product) => {
  console.log("product", product);
  const data = await putData(`products/${id}`, product);
  return data;
}

export const getAllProducts = async ({
  page,
  pageSize,
  status,
  categoryIds,
  brandIds,
  supplierIds,
  searchText,
  stock
}) => {
  const params = new URLSearchParams({
    page,
    pageSize,
    forceReload: 1,
  });

  if (status) params.append('status', status);
  if (searchText) params.append('searchText', searchText);
  if (stock) params.append('stock', stock);
  if (categoryIds && categoryIds.length) {
    categoryIds.forEach(id => params.append('categoryIds', id));
  }
  if (brandIds && brandIds.length) {
    brandIds.forEach(id => params.append('brandIds', id));
  }
  if (supplierIds && supplierIds.length) {
    supplierIds.forEach(id => params.append('supplierIds', id));
  }
  const data = await fetchData(`products/search?${params.toString()}`);
  return data;
};
export const fetchBestSeller = async () => {
  const data = await fetchData(`products/get-best-seller`);
  return data.data;
};
export const fetchNewArrivals = async () => {
  const data = await fetchData(`products/get-new-arrivals`);
  return data.data;
};