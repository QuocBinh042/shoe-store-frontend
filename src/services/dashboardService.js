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

export const getBestSellers = async (limit, page) => {
  const res = await fetchData(`/admin/dashboard/best-sellers?page=${page}&pageSize=${limit}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  console.log('Best Sellers:', res.data.items);
  return res.data;
};

export const getStockAlerts = async (threshold, page) => {
  const res = await fetchData(`/admin/dashboard/stock-alerts?threshold=${threshold}&page=${page}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  return res.data;
};