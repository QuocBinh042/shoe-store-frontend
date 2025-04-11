import React, { useEffect } from 'react';
import { Modal, Form, Input, Typography, Select } from 'antd';

const { Text } = Typography;

const EditShippingModal = ({ open, onCancel, onSubmit, initialValues }) => {
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
      title={<Text strong style={{ fontSize: 18 }}>Edit Shipping Info</Text>}
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
          name="address"
          label="Shipping Address"
          rules={[{ required: true, message: 'Address is required' }]}
        >
          <Input.TextArea rows={2} placeholder="Enter shipping address" />
        </Form.Item>

        <Form.Item
          name="method"
          label="Shipping Method"
          rules={[{ required: true, message: 'Shipping method is required' }]}
        >
          <Select placeholder="Select method">
            <Select.Option value="Free Shipping">Free Shipping</Select.Option>
            <Select.Option value="Standard Shipping">Standard Shipping</Select.Option>
            <Select.Option value="Express Shipping">Express Shipping</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="trackingNumber"
          label="Tracking Number"
        >
          <Input placeholder="Optional tracking number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditShippingModal;
