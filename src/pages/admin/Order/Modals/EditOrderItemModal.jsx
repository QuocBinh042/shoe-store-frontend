import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd';
import { updateOrderDetail } from '../../../../services/orderDetailService';

const EditOrderItemModal = ({
  open,
  onCancel,
  initialValues,
  colorOptions,
  sizeOptions,
  disabled,
  orderDetailId,    
  reloadOrderDetail,  
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("values", values)
      const updatedItem = await updateOrderDetail(orderDetailId, {
        color: values.color,
        size: values.size,
        quantity: values.qty,
      });
      console.log("updatedItem", updatedItem)
      message.success('Order item updated successfully');
      
      // Wait for the reload to complete before closing modal
      if (typeof reloadOrderDetail === 'function') {
        await reloadOrderDetail();
      }
      
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update order item');
    }
  };

  return (
    <Modal
      title="Edit Order Item"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
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
