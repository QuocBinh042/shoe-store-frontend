import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import KPIOverview from './components/KPIOverview';
import Alerts from './components/Alerts';
import RevenueAndOrders from './components/RevenueAndOrders';
import Products from './components/Products';
import Customers from './components/Customers';
import Marketing from './components/Marketing';
import ShippingAndInventory from './components/ShippingAndInventory';

const mockRevenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 2000, orders: 180 },
  { name: 'Apr', revenue: 2780, orders: 210 },
  { name: 'May', revenue: 1890, orders: 160 },
  { name: 'Jun', revenue: 2390, orders: 175 },
  { name: 'Jul', revenue: 3490, orders: 220 },
  { name: 'Aug', revenue: 4000, orders: 250 },
  { name: 'Sep', revenue: 5000, orders: 320 },
  { name: 'Oct', revenue: 4500, orders: 290 },
  { name: 'Nov', revenue: 4700, orders: 310 },
  { name: 'Dec', revenue: 6000, orders: 390 },
];

const mockOrderStatusData = [
  { name: 'Processing', value: 40 },
  { name: 'Shipped', value: 30 },
  { name: 'Delivered', value: 25 },
  { name: 'Returned', value: 5 },
];

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
  const [bestSellers, setBestSellers] = useState([]);
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: '10 products are low in stock' },
    { id: 2, type: 'info', message: '5 new orders require review' },
    { id: 3, type: 'error', message: '3 orders have shipping delays' }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch best sellers
        const bestSellersData = [
          { id: 1, name: 'Running Shoe X1', sold: 120, price: 89.99, revenue: 10798.80 }];
        setBestSellers(bestSellersData.slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div style={{ padding: '8px' }}>
      <KPIOverview />
      
      <div style={{ height: '16px' }} />
      
      <Alerts alerts={alerts} />
      
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Revenue & Orders",
          children: (
            <RevenueAndOrders 
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              mockRevenueData={mockRevenueData}
              mockOrderStatusData={mockOrderStatusData}
            />
          )
        },
        {
          key: "2",
          label: "Products",
          children: (
            <Products 
              loading={loading}
              bestSellers={bestSellers}
            />
          )
        },
        {
          key: "3",
          label: "Customers",
          children: (
            <Customers 
              mockCustomerData={mockCustomerData}
            />
          )
        },
        {
          key: "4",
          label: "Marketing",
          children: (
            <Marketing 
              mockMarketingData={mockMarketingData}
            />
          )
        },
        {
          key: "5",
          label: "Shipping & Inventory",
          children: <ShippingAndInventory />
        }
      ]} />
    </div>
  );
};

export default Dashboard;