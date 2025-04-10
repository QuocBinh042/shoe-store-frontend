// src/pages/admin/Order/modals/EditCustomerModal.jsx

import React, { useEffect } from 'react';
import { Modal, Form, Input, Typography } from 'antd';

const { Text } = Typography;

const EditCustomerModal = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.setFieldsValue(initialValues);
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={<Text strong style={{ fontSize: 18 }}>Edit Customer Information</Text>}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save Changes"
      cancelText="Cancel"
      styles={{ body: { padding: 24 } }}
      style={{ top: 100 }}
    >
      <Form
        form={form}
        layout="vertical"
        validateTrigger="onBlur"
      >
        <Form.Item
          name="customerName"
          label="Full Name"
          rules={[]}
        >
          <Input disabled placeholder="Customer Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Email is not valid' },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Phone number is required' },
            { pattern: /^\d{9,12}$/, message: 'Phone number must be 9-12 digits' },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCustomerModal;
