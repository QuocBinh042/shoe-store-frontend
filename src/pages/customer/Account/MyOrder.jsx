import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import OrderItem from './OrderItem';
import { useSelector } from "react-redux";
import { fetchOrderByUser } from '../../../services/orderService';
import { fetcPaymentByOrder } from '../../../services/paymentService';
import { fetchOrderDetailByOrder } from '../../../services/orderDetailService';
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
          const details = await fetchOrderDetailByOrder(order.orderID);
          console.log(details)
          const payment = await fetcPaymentByOrder(order.orderID);
          return {
            id: order.orderID,
            name: order?.user?.name || "Unknown",
            phone: order?.user?.phoneNumber || "N/A",
            date: order.orderDate,
            status: order.status,
            paymentMethod: order.typePayment,
            shippingAddress: order.shippingAddress,
            total: order.total,
            details: Array.isArray(details) ? details.map(detail => ({
              id: detail.id,
              price: detail.price,
              quantity: detail.quantity,
              size: detail?.productDetail?.size || "N/A",
              color: detail?.productDetail?.color || "N/A",
              stockQuantity: detail?.productDetail?.stockQuantity || 0,
            })) : [],
            code: order.code,
            paymentStatus: payment?.status || "Unknown",
            feeShip: order.feeShip,
            discount: order.discount
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
            <OrderItem key={order.orderID} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: "Processing",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("Processing").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: "Shipped",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("Shipped").map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      ),
    },
    {
      key: "4",
      label: "Delivered",
      children: (
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          {filterOrdersByStatus("Delivered").map((order) => (
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
