import { fetchData } from './apiService'

const BASE = '/admin/dashboard';

export const getKpiOverview = async (timeFrame = 'monthly') => {
  const response = await fetchData(`${BASE}/kpi?timeFrame=${timeFrame}`);
  console.log('KPI Overview:', response.data.items);
  if (response.statusCode !== 200) {
    throw new Error(response.message || 'Failed to load KPI overview');
  }
  return response.data.items;
};


export const getRevenueAndOrders = async (timeFrame) => {
  const res = await fetchData(`${BASE}/revenue-orders?timeFrame=${timeFrame}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  return res.data;
};

export const getBestSellers = async (limit, page) => {
  const res = await fetchData(`${BASE}/best-sellers?page=${page}&pageSize=${limit}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  console.log('Best Sellers:', res.data.items);
  return res.data;
};

export const getStockAlerts = async (threshold, page) => {
  const res = await fetchData(`${BASE}/stock-alerts?threshold=${threshold}&page=${page}`);
  if (res.statusCode !== 200) throw new Error(res.message);
  return res.data;
};

export const getCustomerGrowth = async (year = new Date().getFullYear()) => {
  const res = await fetchData(`${BASE}/customers-growth?year=${year}`);
  if (res.statusCode !== 200) {
    throw new Error(res.message || 'Failed to load customer growth');
  }
  return res.data;
};

export const getCustomerMetrics = async (year = new Date().getFullYear()) => {
  const res = await fetchData(`${BASE}/customers-metrics?year=${year}`);
  if (res.statusCode !== 200) {
    throw new Error(res.message || 'Failed to load customer metrics');
  }
  return res.data; 
};