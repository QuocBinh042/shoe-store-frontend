import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import OrderItem from './OrderItem';
import { useSelector } from "react-redux";
import { fetchOrderByUser } from '../../../services/orderService';
const onChange = (key) => {
  // console.log(key);
};
const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;

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
            id: order.orderResponse.orderID,
            name: order.orderResponse.user.name || "Unknown",
            phone: order.orderResponse.user.phoneNumber || "N/A",
            date: order.orderResponse.orderDate,
            status: order.orderResponse.status,
            paymentMethod: order.orderResponse.paymentMethod,
            shippingAddress: order.orderResponse.shippingAddress,
            total: order.orderResponse.total,
            details: Array.isArray(order.orderDetailsResponse)
              ? order.orderDetailsResponse.map(detail => {
                  const hasGift = detail.giftProductDetail;
                  return {
                    id: detail.orderDetailId,
                    price: detail.price,
                    quantity: detail.quantity,
                    size: detail.productDetails?.size || "N/A",
                    color: detail.productDetails?.color || "N/A",
                    image: `${CLOUDINARY_BASE_URL}${detail.imageURL}`,
                    gift: hasGift
                      ? {
                          giftImageURL: detail.giftImageURL ? `${CLOUDINARY_BASE_URL}${detail.giftImageURL}` : null,
                          giftProductName: detail.giftProductName || "Gift Item",
                          giftSize: detail.giftProductDetail?.size || "N/A",
                          giftColor: detail.giftProductDetail?.color || "N/A",
                          giftQuantity: detail.giftQuantity || 1,
                        }
                      : null,
                  };
                })
              : [],
            code: order.orderResponse.code,
            paymentStatus: order.paymentResponse.status,
            feeShip: order.orderResponse.feeShip,
            discount: order.orderResponse.voucherDiscount,
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
