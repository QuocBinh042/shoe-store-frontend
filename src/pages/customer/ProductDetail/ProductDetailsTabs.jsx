import React from 'react';
import { Image, Tabs } from 'antd';
import ReviewTab from './Review';
import shoe from '../../../assets/images/products/product2.jpg'
const ProductDetailsTabs = () => {
  const items = [
    {
      key: '1',
      label: 'Desctiption',
      children: (
        <>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean massa...</p>
          <Image src={shoe} alt="Product 1" />
          <p>Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes...</p>
          <div style={{ textAlign: 'center', }}>
            <Image src={shoe} width="70%" style={{ display: 'block', margin: 'auto', }} alt="Product 1" />
          </div>
        </>
      )
    },
    {
      key: '2',
      label: 'Reviews',
      children: <ReviewTab />,
    },
  ];

  return (<Tabs size='large' defaultActiveKey="1" items={items} />)
};

export default ProductDetailsTabs;
