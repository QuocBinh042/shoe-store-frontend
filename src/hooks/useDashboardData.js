import { useState, useEffect, useRef, useCallback } from 'react';
import { notification } from 'antd';
import { getBestSellers, getCustomerGrowth, getCustomerMetrics, getKpiOverview, getRevenueAndOrders, getStockAlerts } from '../services/dashboardService';

export function useDashboardData(initialTimeFrame = 'monthly') {
  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [kpiItems, setKpiItems] = useState([]);
  const [kpiLoading, setKpiLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setKpiLoading(true);

    getKpiOverview(timeFrame)
      .then(items => {
        if (!mounted) return;
        setKpiItems(items);
      })
      .catch(err => {
        notification.error({
          message: 'Failed to load KPI overview',
          description: err.message || 'Unknown error'
        });
      })
      .finally(() => {
        if (mounted) setKpiLoading(false);
      });

    return () => { mounted = false; };
  }, [timeFrame]);

  return {
    timeFrame,
    setTimeFrame,
    kpiItems,
    kpiLoading
  };
}


export function useRevenueData(initialFrame = 'monthly') {
  const [timeFrame, setTimeFrame] = useState(initialFrame);
  const [series, setSeries] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({});    // cache data per timeFrame

  useEffect(() => {
    let canceled = false;
    async function fetchData() {
      setLoading(true);
      // show cache immediately if có
      if (cacheRef.current[timeFrame]) {
        setSeries(cacheRef.current[timeFrame].revenueSeries);
        setStatus(cacheRef.current[timeFrame].orderStatus);
      }
      try {
        const data = await getRevenueAndOrders(timeFrame);
        if (canceled) return;
        cacheRef.current[timeFrame] = data;
        setSeries(data.revenueSeries);
        setStatus(data.orderStatus);
      } catch (err) {
        if (!canceled) {
          notification.error({
            message: 'Failed to load Revenue & Orders',
            description: err.message
          });
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    fetchData();
    return () => { canceled = true; };
  }, [timeFrame]);

  return { timeFrame, setTimeFrame, series, status, loading };
}

export function useBestSellers(initialLimit = 5, initialPage = 1) {
  const [limit, setLimit] = useState(initialLimit);
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState({ items: [], totalElements: 0, currentPage: 1, pageSize: limit });
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({});

  const fetch = useCallback(async () => {
    setLoading(true);
    const key = `bs_${limit}_${page}`;
    if (cacheRef.current[key]) {
      setData(cacheRef.current[key]);
      setLoading(false);
      return;
    }
    try {
      const res = await getBestSellers(limit, page);
      cacheRef.current[key] = res;
      setData(res);
    } catch (err) {
      notification.error({ message: 'Load Best Sellers failed', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => { fetch(); }, [fetch]);

  return {
    limit,
    setLimit: (l) => { setLimit(l); setPage(1); },
    page,
    setPage,
    bestSellers: data.items,
    pagination: {
      current: data.currentPage,
      pageSize: data.pageSize,
      total: data.totalElements
    },
    loading
  };
}

export function useStockAlerts(initialThreshold = 10, initialPage = 1) {
  const [threshold, setThreshold] = useState(initialThreshold);
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState({ items: [], totalElements: 0, currentPage: 1, pageSize: initialPage });
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({});

  const fetch = useCallback(async () => {
    setLoading(true);
    const key = `sa_${threshold}_${page}`;
    if (cacheRef.current[key]) {
      setData(cacheRef.current[key]);
      setLoading(false);
      return;
    }
    try {
      const res = await getStockAlerts(threshold, page);
      cacheRef.current[key] = res;
      setData(res);
    } catch (err) {
      notification.error({ message: 'Load Stock Alerts failed', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [threshold, page]);

  useEffect(() => { fetch(); }, [fetch]);

  return {
    threshold,
    setThreshold: (t) => { setThreshold(t); setPage(1); },
    page,
    setPage,
    stockAlerts: data.items,
    pagination: {
      current: data.currentPage,
      pageSize: data.pageSize,
      total: data.totalElements
    },
    loading
  };
}

export function useCustomerDashboard(year = new Date().getFullYear()) {
  const [growthData, setGrowthData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchAll() {
      try {
        setLoading(true);
        setError(false);

        const [rawGrowth, rawMetrics] = await Promise.all([
          getCustomerGrowth(year),
          getCustomerMetrics(year),
        ]);

        if (!active) return;

        setGrowthData(rawGrowth.map(d => ({
          name: d.month,
          new: d.newCustomers,
          returning: d.returningCustomers,
        })));

        setMetrics({
          retentionRate: rawMetrics.retentionRate,
          avgLifetimeValue: rawMetrics.avgLifetimeValue,
          repeatPurchaseRate: rawMetrics.repeatPurchaseRate,
        });
      } catch (e) {
        console.error('Customer dashboard error', e);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchAll();
    return () => { active = false; };
  }, [year]);

  return { growthData, metrics, loading, error };
}