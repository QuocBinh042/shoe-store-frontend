import { fetchData } from './apiService'

export const getAllBrands = async () => {  
  const data = await fetchData(`brands`);  
  return data;
};

export const getBrandById = async (id) => {  
  const data = await fetchData(`brands/${id}`);  
  return data;
};