import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Statistic, Avatar, Typography, Button, Modal, Form, Input, notification } from "antd";
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { countOrderByUser, sumAmount, fetchOrderByUser } from "../../../services/orderService";
import { fetchUserInfoById, updateUserInfo } from "../../../services/userService";
import { authService } from "../../../services/authService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useSelector } from "react-redux";
import "./Account.scss";

const { Title, Text } = Typography;

const UserDashboard = () => {
    const [quantiyOrder, setQuantityOrder] = useState(0);
    const [amount, setAmount] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUseruserInfo] = useState({});
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const user = useSelector((state) => state.account.user);

    useEffect(() => {
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
        const fetchOrders = async (userId) => {
            const orders = await fetchOrderByUser(userId);
            processMonthlyData(orders);
            setFilteredOrders(orders.filter(order => order.status === "SHIPPED"));
        };
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

    const fetchUserInfo = async (userId) => {
        const userInfo = await fetchUserInfoById(userId);
        setUseruserInfo(userInfo.data);
    };

    const processMonthlyData = (orders) => {
        const monthlyData = Array.from({ length: 12 }, (_, index) => ({
            month: `${index + 1}`,
            amount: 0,
        }));

        orders.forEach(order => {
            const orderDate = new Date(order.orderResponse.orderDate);
            if (!isNaN(orderDate) && orderDate.getFullYear() === new Date().getFullYear()) {
                monthlyData[orderDate.getMonth()].amount += order.orderResponse.total;
            }
        });

        setOrderData(monthlyData);
    };

    const showEditModal = () => {
        form.setFieldsValue(userInfo);
        setIsEditModalOpen(true);
    };

    const showPasswordModal = () => {
        passwordForm.resetFields();
        setIsPasswordModalOpen(true);
    };

    const handleEditOk = () => {
        form.validateFields().then(async (values) => {
            await updateUserInfo(userInfo.userID, values);
            setIsEditModalOpen(false);
            fetchUserInfo(userInfo.userID); 
            notification.success({ message: 'Edit successfully!' });
        }).catch(() => {
            notification.error({ message: 'Form has errors!', description: 'Please fix the errors before submitting.' });
        });
    };

    const handlePasswordOk = () => {
        passwordForm.validateFields().then(async (values) => {
          const { currentPassword, newPassword, confirmPassword } = values;
          if (newPassword !== confirmPassword) {
            notification.error({
              message: 'Password mismatch!',
              description: 'New password and confirmation do not match.',
            });
            return;
          }
      
          try {
            await authService.changePassword({ currentPassword, newPassword });
            setIsPasswordModalOpen(false);
            notification.success({ message: 'Password updated successfully!' });
          } catch (error) {
            notification.error({
              message: 'Password update failed!',
              description: error.response.data.message || 'Something went wrong.',
            });
          }
        }).catch(() => {
          notification.error({
            message: 'Password update failed!',
            description: 'Please ensure passwords match and meet requirements.',
          });
        });
      };
      

    const handleCancel = (modalType) => {
        if (modalType === 'edit') setIsEditModalOpen(false);
        else setIsPasswordModalOpen(false);
    };

    const columns = [
        { title: "Order code", dataIndex: "code", key: "code" },
        { title: "Order date", dataIndex: "orderDate", key: "orderDate" },
        { title: "Total", dataIndex: "total", key: "total", render: (text) => `${text} đ` },
        { title: "Status", dataIndex: "status", key: "status" },
    ];
    const formattedOrders = filteredOrders.map(order => ({
        ...order,
        key: order.orderID
    }));

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <Card className="user-card">
                <Avatar size={120} icon={<UserOutlined />} />
                <Title level={3}>{userInfo.name}</Title>
                <div className="user-info">
                    <Text><b>Email: </b> {userInfo.email}</Text>
                    <Text><b>Phone: </b> {userInfo.phoneNumber}</Text>
                </div>
                <div className="button-group">
                    <Button type="primary" icon={<EditOutlined />} onClick={showEditModal}>Edit Profile</Button>
                    <Button type="default" icon={<LockOutlined />} onClick={showPasswordModal} style={{ marginLeft: 10 }}>Change Password</Button>
                </div>
            </Card>

            <Row gutter={24} className="stats-row">
                <Col span={12}>
                    <Card className="stat-card">
                        <Statistic title="Your total order" value={quantiyOrder} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card className="stat-card">
                        <Statistic title="Total amount spent" value={amount} prefix={<DollarOutlined />} suffix="đ" />
                    </Card>
                </Col>
            </Row>
            <Card title="Monthly expenses in 2025" className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#1890ff" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Current orders" className="table-card">
                <Table dataSource={formattedOrders} columns={columns} pagination={false} />
            </Card>

            <Modal
                title="Edit User Info"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={() => handleCancel('edit')}
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
                        name="phoneNumber"
                        label="Phone"
                        rules={[
                            { required: true, message: "Please enter your phone number!" },
                            { pattern: /^[0-9]{10}$/, message: "Phone number must contain exactly 10 digits!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Change Password"
                open={isPasswordModalOpen}
                onOk={handlePasswordOk}
                onCancel={() => handleCancel('password')}
            >
                <Form form={passwordForm} layout="vertical">
                    <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[{ required: true, message: "Please enter your current password!" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: "Please enter your new password!" },
                            { min: 6, message: "Password must be at least 6 characters!" }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        rules={[
                            { required: true, message: "Please confirm your new password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserDashboard;