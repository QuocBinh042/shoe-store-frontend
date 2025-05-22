import { Button, Card, Image, Tag } from "antd";
import React, { useState } from "react";
import OrderDetailDrawer from "./OrderDetailDrawer";
import dayjs from "dayjs";
function OrderItem({ order, reloadOrders }) { 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Card
        title={`Order: #${order.code}`}
        extra={<Button onClick={() => setIsDrawerOpen(true)}>View Detail</Button>}
      >
        <div style={styles.row}>
          <div style={styles.rightColumn}>
          <p><strong>Order Date:</strong> {dayjs(order.date).format("DD/MM/YYYY HH:mm:ss")}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color="blue">{order.status}</Tag>
            </p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          </div>
        </div>
      </Card>

      <OrderDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        order={order}
        reloadOrders={reloadOrders}
      />
    </>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
  },
  rightColumn: {
    flex: 2,
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default OrderItem;