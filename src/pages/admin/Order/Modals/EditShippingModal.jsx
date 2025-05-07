import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EditShippingModal = ({ open, onCancel, onSubmit, initialValues, disabled }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Edit Shipping Information"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          disabled={disabled}
        >
          Save Changes
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        disabled={disabled}
      >
        <Form.Item
          name="address"
          label="Shipping Address"
          rules={[{ required: true, message: 'Please input shipping address!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="method"
          label="Shipping Method"
          rules={[{ required: true, message: 'Please input shipping method!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="trackingNumber"
          label="Tracking Number"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditShippingModal;
