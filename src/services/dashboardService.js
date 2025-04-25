import { fetchData } from './apiService'

export const getKpiOverview = async (timeFrame = 'monthly') => {
  const response = await fetchData(`admin/dashboard/kpi?timeFrame=${timeFrame}`);
  console.log('KPI Overview:', response.data.items);
  if (response.statusCode !== 200) {
    throw new Error(response.message || 'Failed to load KPI overview');
  }
  return response.data.items;
};


export const getRevenueAndOrders = async (timeFrame) => {
  const res = await fetchData(`/admin/dashboard/revenue-orders?timeFrame=${timeFrame}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  return res.data; 
};