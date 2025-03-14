import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import AdminMenu from '../../components/Menu/menuAdmin';

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const userDropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Update Profile',
      },
      {
        key: 'logout',
        icon: <UserOutlined />,
        label: 'Logout',
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
            <Avatar icon={<UserOutlined />} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>John Doe</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Admin</div>
            </div>
          </div>
        </Dropdown>
      </Sider>

      {/* Main content; add left margin equal to sider's width */}
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: 8}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
