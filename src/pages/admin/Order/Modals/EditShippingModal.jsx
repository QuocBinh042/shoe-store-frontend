import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Radio } from 'antd';

const EditShippingModal = ({ open, onCancel, onSubmit, initialValues, disabled }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        shippingAddress: initialValues.shippingAddress || '',
        shippingMethod: initialValues.shippingMethod || 'Normal',
        trackingNumber: initialValues.trackingNumber || '',
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

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
        disabled={disabled}
      >
        <Form.Item
          name="shippingAddress"
          label="Shipping Address"
          rules={[{ required: true, message: 'Please input shipping address!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="shippingMethod"
          label="Shipping Method"
          rules={[{ required: true, message: 'Please select shipping method!' }]}
        >
          <Radio.Group className="shipping-options">
            <Radio value="Normal">Normal</Radio>
            <Radio value="Express">Express</Radio>
          </Radio.Group>
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
