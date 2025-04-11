import React, { useEffect } from 'react';
import { Modal, Form, InputNumber, Select, Typography } from 'antd';

const { Text } = Typography;

const EditOrderItemModal = ({ open, onCancel, onSubmit, initialValues, colorOptions = [], sizeOptions = [] }) => {
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
      title={<Text strong style={{ fontSize: 18 }}>Edit Order Item</Text>}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save"
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
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Quantity is required' }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="color" label="Color">
          <Select placeholder="Select color" allowClear>
            {colorOptions.map((color) => (
              <Select.Option key={color} value={color}>{color}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="size" label="Size">
          <Select placeholder="Select size" allowClear>
            {sizeOptions.map((size) => (
              <Select.Option key={size} value={size}>{size}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOrderItemModal;
