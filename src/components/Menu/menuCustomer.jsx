import { NavLink } from 'react-router-dom';
import {
  HomeOutlined, FileTextOutlined, UserOutlined,
  LoginOutlined, SearchOutlined,
  BookOutlined, ShoppingOutlined, ProductFilled
} from '@ant-design/icons';
import { useSelector } from "react-redux";

export const useMenuCustomer = (navigate) => {
  const user = useSelector((state) => state.account.user);

  const authMenu = user
    ? [
      {
        key: '6',
        label: <NavLink to="/account"></NavLink>,
        icon: <UserOutlined />,
      },
    ]
    : [
      {
        key: '6',
        label: (
          <span>
            <NavLink to="/login" style={{ marginRight: 8 }}>Login</NavLink>
          </span>
        ),
        icon: <UserOutlined />,
      },
    ];
    const cart = user
    ? [
      {
        key: '5',
      label: <NavLink to="/cart">Cart</NavLink>,
      icon: <ShoppingOutlined />,
      },
    ]
    : [
      {
        key: '5',
        label: (
          <span>
            <NavLink to="/login">Cart</NavLink>
          </span>
        ),
        icon: <ShoppingOutlined />,
      },
    ];

  return [
    {
      key: '1',
      label: <NavLink to="/">Home</NavLink>,
      icon: <HomeOutlined />,
    },
    // {
    //   key: '2',
    //   label: "Pages",
    //   icon: <FileTextOutlined />,
    //   children: [
    //     { key: '2-1', label: <NavLink to="/about">About Us</NavLink> },
    //     { key: '2-2', label: <NavLink to="/contact">Contact Us</NavLink> },
    //   ],
    // },
    // {
    //   key: '3',
    //   label: <NavLink to="/blog">Blog</NavLink>,
    //   icon: <BookOutlined />,
    // },
    {
      key: '4',
      label: <NavLink to="/search">Product</NavLink>,
      icon: <ProductFilled />,
    },
    ...cart,
    ...authMenu, 
  ];
};
