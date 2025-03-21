import { fetchData } from './apiService'

export const getAllCategories = async () => {  
  const data = await fetchData(`categories`);  
  return data;
};

export const getCategoryById = async (id) => {  
  const data = await fetchData(`categories/${id}`);  
  return data;
};