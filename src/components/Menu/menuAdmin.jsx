import * as Icons from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const AdminMenu = [
  {
    key: 'dashboard',
    icon: <Icons.DashboardOutlined />,
    label: <NavLink to="dashboard" >Dashboard</NavLink>,
  },
  {
    key: 'products',
    icon: <Icons.AppstoreOutlined />,
    label: <NavLink to="products" >Products</NavLink>,
  },
  {
    key: 'orders',
    icon: <Icons.CodeSandboxOutlined />,
    label: <NavLink to="orders" >Orders</NavLink>,
  },
  {
    key: 'shipment',
    icon: <Icons.CarOutlined />,
    label: <NavLink to="shipment" >Shipment</NavLink>,
  },
  {
    key: 'promotions',
    icon: <Icons.TagOutlined />,
    label: <NavLink to="promotions" >Promotions</NavLink>,
  },
  {
    key: 'customers',
    icon: <Icons.UserOutlined />,
    label: <NavLink to="customers" >Customers</NavLink>,
  },
];

export default AdminMenu;
