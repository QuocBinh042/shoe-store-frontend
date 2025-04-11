import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import OrderItem from './OrderItem';
import { useSelector } from "react-redux";
import { fetchOrderByUser } from '../../../services/orderService';
import { fetcPaymentByOrder } from '../../../services/paymentService';
import { fetchOrderDetailByOrder } from '../../../services/orderDetailService';
import { image } from 'framer-motion/client';
const onChange = (key) => {
  // console.log(key);
};


function MyOrder() {
  const [orders, setOrders] = useState([]);
  const user = useSelector((state) => state.account.user);
  useEffect(() => {
    if (user?.userID) {
      loadOrdersWithDetails(user.userID);
    } else {
      setOrders([]); 
    }
  }, [user]);
  const loadOrdersWithDetails = async (userId) => {
    try {
      if (!userId) return;
  
      const fetchedOrders = await fetchOrderByUser(userId);
      if (!Array.isArray(fetchedOrders)) {
        console.error("fetchOrderByUser did not return an array:", fetchedOrders);
        setOrders([]);
        return;
      }
 
      const detailedOrders = await Promise.all(
        fetchedOrders.map(async (order) => {
          console.log(order)
          return {
            id: order.orderDTO.orderID,
            name: order.orderDTO.user.name || "Unknown",
            phone:  order.orderDTO.user.phoneNumber || "N/A",
            date:  order.orderDTO.orderDate,
            status:  order.orderDTO.status,
            paymentMethod: order.orderDTO.paymentMethod,
            shippingAddress: order.orderDTO.shippingAddress,
            total:  order.orderDTO.total,
            details: Array.isArray(order.orderDetailDTOs) ? order.orderDetailDTOs.map(detail => ({
              id: detail.productDetail.productDetailID,
              price: detail.price,
              quantity: detail.quantity,
              size: detail?.productDetail?.size || "N/A",
              color: detail?.productDetail?.color || "N/A",
              stockQuantity: detail?.productDetail?.stockQuantity || 0,
              // image:detail
            })) : [],
            code:  order.orderDTO.code,
            paymentStatus:order.paymentDTO?.status || "Unknown",
            feeShip:  order.orderDTO.feeShip,
            discount:  order.orderDTO.discount
          };
        })
      );
  
      setOrders(detailedOrders);
    } catch (error) {
      console.error("Failed to load orders with details:", error);
    }
  };
  
  
  const filterOrdersByStatus = (status) =>
    orders.filter((order) => order.status === status);

  const items = [
    {
      key: '1',
      label: 'All Orders',
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: "Pending",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("PENDING").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: "Confirmed",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("CONFIRMED").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "4",
      label: "Shipped",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("SHIPPED").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "5",
      label: "Delivered",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("DELIVERED").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "6",
      label: "Canceled",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("CANCELED").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },

  ];
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />


    </>
  )
}

export default MyOrder;
