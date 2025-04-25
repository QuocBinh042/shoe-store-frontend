import { useState, useEffect, useRef } from 'react';
import { notification } from 'antd';
import { getKpiOverview, getRevenueAndOrders } from '../services/dashboardService';

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
  const [series, setSeries]       = useState([]);
  const [status, setStatus]       = useState([]);
  const [loading, setLoading]     = useState(false);
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