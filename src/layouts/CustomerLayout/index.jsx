import React from 'react';
import { Layout, Menu } from 'antd';
import './CustomerLayout.scss'
import logo from '../../assets/images/logos/LogoShoeStore.png';
import Footer from '../../components/Footer';
import { Content } from 'antd/es/layout/layout';
import { Outlet, useLocation } from 'react-router-dom';
import { useMenuCustomer } from '../../components/Menu/menuCustomer';
import { useNavigate } from 'react-router-dom';
import CustomBreadcrumb from '../../components/Breadcrumb';
const { Header } = Layout;

const CustomerLayout = () => {
  
    const location = useLocation();
    const navigate = useNavigate(); 
    const isHome = location.pathname === "/"; 
  return (
    <Layout>
      <Header className='header'>
        <div className='header__menu'>
          <img src={logo} alt="Logo" className="header__logo" />
          <Menu
            theme='dark'
            mode="horizontal"
            items={useMenuCustomer(navigate)} 
            className='header__menu--item'
          />
        </div>
      </Header>
      <div className={`breadcrumb-container ${isHome ? 'hidden' : ''}`}>
        <CustomBreadcrumb />
      </div>
      <Content style={{minHeight:600}}><Outlet /></Content>
      <Footer />
    </Layout>
  );
};
export default CustomerLayout;