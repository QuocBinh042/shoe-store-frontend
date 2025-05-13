import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import KPIOverview from './components/KPIOverview';
import RevenueAndOrders from './components/RevenueAndOrders';
import Products from './components/Products';
import Customers from './components/Customers';
import Marketing from './components/Marketing';
import ShippingAndInventory from './components/ShippingAndInventory';

import { useDashboardData } from '../../../hooks/useDashboardData';
import './Dashboard.scss'; 
const mockCustomerData = [
  { name: 'Jan', new: 120, returning: 80 },
  { name: 'Feb', new: 100, returning: 90 },
  { name: 'Mar', new: 80, returning: 100 },
  { name: 'Apr', new: 90, returning: 110 },
  { name: 'May', new: 95, returning: 120 },
  { name: 'Jun', new: 110, returning: 125 },
];

const mockMarketingData = [
  { name: 'Social Media', value: 35 },
  { name: 'Email', value: 25 },
  { name: 'Organic Search', value: 20 },
  { name: 'Direct', value: 15 },
  { name: 'Referral', value: 5 },
];

const Dashboard = () => {
  const {
    timeFrame,
    setTimeFrame,
    kpiItems,
    kpiLoading
  } = useDashboardData('monthly');

  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const best = [
      { id: 1, name: 'Running Shoe X1', sold: 120, price: 89.99, revenue: 10798.80 }
    ];
    setBestSellers(best);
    setLoading(false);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <KPIOverview
        items={kpiItems}
        loading={kpiLoading}
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
      />

      <div style={{ height: 16 }} />

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Revenue & Orders',
            children: <RevenueAndOrders />
          },
          {
            key: '2',
            label: 'Products',
            children: (
              <Products
                loading={loading}
                bestSellers={bestSellers}
              />
            )
          },
          {
            key: '3',
            label: 'Customers',
            children: <Customers mockCustomerData={mockCustomerData} />
          },
          // {
          //   key: '4',
          //   label: 'Marketing',
          //   children: <Marketing mockMarketingData={mockMarketingData} />
          // },
          {
            key: '5',
            label: 'Shipping & Inventory',
            children: <ShippingAndInventory />
          }
        ]}
      />
    </div>
  );
};

export default Dashboard;
