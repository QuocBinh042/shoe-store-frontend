import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { getKpiOverview } from '../services/dashboardService';

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
