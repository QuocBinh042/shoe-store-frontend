import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EditDetail = ({ open, onCancel, customer, handleSave }) => {
  const [form] = Form.useForm();

  // Khi customer thay đổi, set giá trị lên form
  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        avatar: customer.avatar,
        name: customer.name,
        email: customer.email,
        username: customer.username,
        phone: customer.phone,
      });
    } else {
      form.resetFields();
    }
  }, [customer, form]);

  // Hàm xử lý khi submit form
  const onFinish = (values) => {
    handleSave(values);
  };

  return (
    <Modal
      title="Edit Customer Details"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Avatar" name="avatar">
          <Input placeholder="Enter avatar URL" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Save Changes
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDetail;
