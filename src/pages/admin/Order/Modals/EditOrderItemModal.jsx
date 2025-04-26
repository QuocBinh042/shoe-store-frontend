import React from 'react';
import { Modal, Form, Input, Button, Select, InputNumber } from 'antd';

const EditOrderItemModal = ({ 
  open, 
  onCancel, 
  onSubmit, 
  initialValues, 
  colorOptions, 
  sizeOptions,
  disabled 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Edit Order Item"
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
          name="color"
          label="Color"
          rules={[{ required: true, message: 'Please select color!' }]}
        >
          <Select options={colorOptions.map(color => ({ label: color, value: color }))} />
        </Form.Item>
        <Form.Item
          name="size"
          label="Size"
          rules={[{ required: true, message: 'Please select size!' }]}
        >
          <Select options={sizeOptions.map(size => ({ label: size, value: size }))} />
        </Form.Item>
        <Form.Item
          name="qty"
          label="Quantity"
          rules={[{ required: true, message: 'Please input quantity!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOrderItemModal;
