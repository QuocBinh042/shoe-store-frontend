import React from 'react';
import { Modal, Input, Form } from 'antd';

const CancelOrderModal = ({ visible, onCancel, onConfirm, loading }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values.reason);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Cancel Order"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Confirm Cancel"
      okButtonProps={{ danger: true }}
    >
      <Form form={form}>
        <Form.Item
          name="reason"
          label="Cancellation Reason"
          rules={[{ required: true, message: 'Please enter a reason for cancellation' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Please provide a reason for canceling this order..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CancelOrderModal; 