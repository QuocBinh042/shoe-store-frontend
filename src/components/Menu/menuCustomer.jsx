import { NavLink } from 'react-router-dom';
import { Modal } from 'antd';
import { 
  HomeOutlined, FileTextOutlined, UserOutlined, 
  LoginOutlined, LogoutOutlined, SearchOutlined, 
  BookOutlined, ShoppingOutlined, 
  ProductFilled
} from '@ant-design/icons';
import { useSelector } from "react-redux";
export const useMenuCustomer = (navigate) => {
  const user = useSelector((state) => state.account.user);
  // const handleAccountClick = () => {
  //   if (user) {
  //     navigate('/account'); 
  //   } else {
  //     Modal.confirm({
  //       title: 'You are not logged in',
  //       content: 'Do you want to login?',
  //       okText: 'Login',
  //       cancelText: 'Cancel',
  //       onOk: () => navigate('/login'),
  //       onCancel: () => {},
  //     });
  //   }
  // };
 

  return [
    {
      key: '1',
      label: <NavLink to="/">Home</NavLink>,
      icon: <HomeOutlined />,
    },
    {
      key: '2',
      label: "Pages",
      icon: <FileTextOutlined />,
      children: [
        { key: '2-1', label: <NavLink to="/about">About Us</NavLink> },
        { key: '2-2', label: <NavLink to="/contact">Contact Us</NavLink> },
      ],
    },
    {
      key: '3',
      label: <NavLink to="/blog">Blog</NavLink>,
      icon: <BookOutlined />,
    },
    {
      key: '4',
      label: <NavLink to="/search">Product</NavLink>,
      icon: <ProductFilled />,
    },
    {
      key: '5',
      label: <NavLink to="/cart">Cart</NavLink>,
      icon: <ShoppingOutlined />,
    },
    {
      key: '6',
      label: <NavLink to="/account">Account</NavLink>,
      icon: <UserOutlined />,
    },
  ];
};
