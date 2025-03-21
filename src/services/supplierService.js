import { fetchData } from './apiService'

export const getAllSuppliers = async () => {
  const data = await fetchData(`suppliers`);
  return data;
};

export const getSupplierById = async (id) => {
  const data = await fetchData(`suppliers/${id}`);
  return data;
};