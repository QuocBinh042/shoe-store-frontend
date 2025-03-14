import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Statistic, Avatar, Typography, Button, Modal, Form, Input, notification } from "antd";
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import { countOrderByUser, sumAmount, fetchOrderByUser } from "../../../services/orderService";
import { fetchUserInfoById, updateUserInfo } from "../../../services/userService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;

const UserDashboard = () => {
    const [quantiyOrder, setQuantityOrder] = useState(0);
    const [amount, setAmount] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUseruserInfo] = useState({});
    const [form] = Form.useForm();
    const user = useSelector((state) => state.account.user);
    useEffect(() => {
        if (user?.userID) {
            fetchData(user.userID);
        }
    }, [user]);

    const fetchQuantityOrder = async (userId) => {
        const count = await countOrderByUser(userId);
        setQuantityOrder(count);
    };

    const fetchtotalAmount = async (userId) => {
        const amount = await sumAmount(userId);
        setAmount(amount);
    };

    const fetchOrders = async (userId) => {
        const orders = await fetchOrderByUser(userId);
        processMonthlyData(orders);
        setFilteredOrders(orders.filter(order => order.status !== "Completed"));
    };

    const fetchUserInfo = async (userId) => {
        const userInfo = await fetchUserInfoById(userId);
        setUseruserInfo(userInfo.data);
    };

    const fetchData = async (userId) => {

        try {
            await fetchUserInfo(userId);
            await fetchQuantityOrder(userId);
            await fetchtotalAmount(userId);
            await fetchOrders(userId);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }

    };
    const processMonthlyData = (orders) => {
        const monthlyData = Array.from({ length: 12 }, (_, index) => ({
            month: `${index + 1}`,
            amount: 0,
        }));

        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            if (!isNaN(orderDate) && orderDate.getFullYear() === new Date().getFullYear()) {
                monthlyData[orderDate.getMonth()].amount += order.total;
            }
        });

        setOrderData(monthlyData);
    };

    const showModal = () => {
        form.setFieldsValue(userInfo);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            await updateUserInfo(userInfo.userID, values);
            setIsModalOpen(false);
            fetchUserInfo(userInfo.userID); // GỌI LẠI API ĐỂ LẤY DỮ LIỆU MỚI NHẤT
        }).catch(() => {
            notification.error({ message: 'Form has errors!', description: 'Please fix the errors before submitting.' });
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const columns = [
        { title: "Order code", dataIndex: "code", key: "code" },
        { title: "Order date", dataIndex: "orderDate", key: "orderDate" },
        { title: "Total", dataIndex: "total", key: "total", render: (text) => `${text} đ` },
        { title: "Status", dataIndex: "status", key: "status" },
    ];
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div style={{ padding: 20 }}>
            {/* User Info */}
            <Card style={{ textAlign: "center" }}>
                <Avatar size={100} icon={<UserOutlined />} />
                <Title level={3}>{userInfo.name}</Title>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px" }}>
                    <Text><b>Email: </b> {userInfo.email}</Text>
                    <Text><b>User name: </b> {userInfo.userName}</Text>
                    <Text><b>CI: </b> {userInfo.ci}</Text>
                    <Text><b>Phone: </b> {userInfo.phoneNumber}</Text>
                </div>
                <Button type="primary" icon={<EditOutlined />} onClick={showModal} style={{ marginTop: 10 }}>Edit</Button>
            </Card>

            {/* Order Statistics */}
            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                    <Card>
                        <Statistic title="Your total order" value={quantiyOrder} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="Total amount spent" value={amount} prefix={<DollarOutlined />} suffix="đ" />
                    </Card>
                </Col>
            </Row>
            <Card title="Monthly expenses in 2025" style={{ marginTop: 20 }}>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#1890ff" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>


            <Card title="Current orders" style={{ marginTop: 20 }}>
                <Table dataSource={filteredOrders} columns={columns} pagination={false} />
            </Card>

            <Modal
                title="Edit User Info"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter your email!" },
                            { type: "email", message: "Please enter a valid email!" }
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Full name"
                        rules={[
                            { required: true, message: "Please enter your full name!" },
                            { pattern: /^[A-Za-z\s]+$/, message: "Full name must not contain numbers or special characters!" },
                            { pattern: /^[A-Z]/, message: "Each word in the full name must start with a capital letter!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="userName"
                        label="User name"
                        rules={[
                            { required: true, message: "Please enter your user name!" },
                            { pattern: /^[A-Za-z][A-Za-z0-9]*$/, message: "User name must start with a letter and can contain numbers!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone"
                        rules={[
                            { required: true, message: "Please enter your phone number!" },
                            { pattern: /^[0-9]{10}$/, message: "Phone number must contain exactly 10 digits!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="ci"
                        label="CI"
                        rules={[
                            { required: true, message: "Please enter your CI!" },
                            { pattern: /^[0-9]{12}$/, message: "CI must contain exactly 12 digits!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>

            </Modal>
        </div>
    );
};

export default UserDashboard;