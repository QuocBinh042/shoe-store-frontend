import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Menu/menuAdmin';
import { useSelector, useDispatch } from 'react-redux';
import { doLogoutAction } from '../../redux/accountSlice';
import { authService } from '../../services/authService';
import { Modal } from 'antd';
const { confirm } = Modal;
const { Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);

  const handleLogout = () => {
    confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      okText: 'Log out',
      cancelText: 'Cancel',
      onOk: async () => {
        await authService.logout();
        dispatch(doLogoutAction());
        navigate('/login');
      },
    });
  };

  const userDropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserSwitchOutlined />,
        label: 'Update Profile',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      <Sider
        trigger={null}
        theme="light"
        width={200}
        style={{
          background: '#fff',
          boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          overflow: 'auto',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          E-Com
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={AdminMenu}
          style={{
            background: '#fff',
            borderRight: 'none',
          }}
        />

        <Dropdown menu={userDropdownItems} placement="topRight" trigger={['click']}>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: '#fff',
              borderTop: '1px solid #f0f0f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Avatar 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'admin'}`}
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>ID: {user?.id}</div>
            </div>
          </div>
        </Dropdown>
      </Sider>

      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: 8}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
