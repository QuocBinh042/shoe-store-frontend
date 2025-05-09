import { fetchData } from './apiService'
export const fetchFilters = async () => {
  const data = await fetchData('search/show-filtered');
  return data;
};
export const fetchAllProducts = async (page) => {
  try {
    const response = await fetchData(`search/all-products?page=${page}`);
    if (!response?.data?.items) {
      console.error("No data found in response.");
      return { products: [], total: 0 };
    }
    return { products: response.data.items, total: response.data.totalElements || 0 };
  } catch (error) {
    console.error("Error fetching all products:", error);
    return { products: [], total: 0 };
  }
};
export const fetchFilteredProducts = async (params, page) => {
  const baseUrl = 'search/filtered';
  let queryString = new URLSearchParams({
    page
  });

  if (params.categories?.length) queryString.append('categoryIds', params.categories.join(','));
  if (params.brands?.length) queryString.append('brandIds', params.brands.join(','));
  if (params.colors?.length) queryString.append('colors', params.colors.join(','));
  if (params.sizes?.length) queryString.append('sizes', params.sizes.join(','));
  if (params.minPrice) queryString.append('minPrice', params.minPrice);
  if (params.maxPrice) queryString.append('maxPrice', params.maxPrice);
  if (params.sortBy) queryString.append('sortBy', params.sortBy);
  if (params.keyword) queryString.append('keyword', params.keyword);

  const fullUrl = `${baseUrl}?${queryString.toString()}`;
  console.log(fullUrl);

  try {
    const response = await fetchData(fullUrl);
    if (!response?.data?.items) {
      console.error("No data found in response.");
      return { products: [], total: 0 };
    }
    return { products: response.data.items, total: response.data.totalElements || 0 };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return { products: [], total: 0 };
  }
};


