import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Modal, Layout, Menu, theme } from 'antd';
import {
  DesktopOutlined,
  InboxOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import MyOrder from './MyOrder';
import Address from './Address';
import DashBoard from './Dashboard';
import { authService } from '../../../services/authService';
import { useDispatch } from "react-redux";
import { doLogoutAction } from '../../../redux/accountSlice';
const { Content, Sider } = Layout;

const Account = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  
  const handleLogout = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      content: 'You will be redirected to the home page after logging out.',
      okText: 'Log out',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Error during logout:", error);
        }
        dispatch(doLogoutAction()); 
        navigate('/');
      },
    });
  };
  

  // Menu items
  const items = [
    { key: '1', label: 'Dashboard', icon: <DesktopOutlined /> },
    { key: '2', label: 'My Order', icon: <InboxOutlined /> },
    { key: '3', label: 'Address', icon: <UserOutlined /> },
    { key: '4', label: 'Log out', icon: <LogoutOutlined style={{ color: 'red' }} />, onClick: handleLogout },
  ];
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <DashBoard />;
        case '2':
          return <MyOrder />;
      case '3':
        return <Address />;
    }
  };

  return (
    <Layout style={{ minHeight: '120vh', padding: '20px 100px' }}>
      <Sider
        style={{ background: '#f5f5f5' }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
      >
        <Menu
          style={{ background: '#f5f5f5' }}
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={(e) => setSelectedKey(e.key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Account;
