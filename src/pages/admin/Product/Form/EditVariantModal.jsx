import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Upload, Button, InputNumber, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditVariantModal = ({ open, variant, onCancel, onFinish, productId }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (variant) {
        form.setFieldsValue({
          size: variant.size.replace('SIZE_', ''),
          color: variant.color.toLowerCase(),
          stock: variant.stockQuantity || variant.stock || 0,
          status: variant.status || 'Enabled',
        });
        setImageUrl(variant.image || '');
      } else {
        form.setFieldsValue({
          size: '',
          color: '',
          stock: 0,
          status: 'Enabled',
        });
        setImageUrl('');
      }
      setImageFile(null);
    }
  }, [variant, form, open]);

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return false;
    },
    showUploadList: false,
    listType: 'picture-card',
  };

  const handleVariantFinish = (values) => {
    const formattedValues = {
      ...(variant && { productDetailID: variant.productDetailID }),
      size: `SIZE_${values.size}`,
      color: values.color.toUpperCase(),
      stockQuantity: values.stock,
      status: values.status || 'Enabled',
      ...(imageFile && { imageFile }), // Nếu cần gửi file ảnh
    };
    onFinish(formattedValues); // Trả dữ liệu về ProductForm
    onCancel(); // Đóng modal
  };

  return (
    <Modal
      title={variant ? 'Edit Variant' : 'Add Variant'}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleVariantFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Image">
              <Upload {...uploadProps}>
                {imageUrl ? (
                  <img src={imageUrl} alt="variant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <PlusOutlined style={{ fontSize: 32 }} />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="size"
                  label="Size"
                  rules={[{ required: true, message: 'Please select size' }]}
                >
                  <Select placeholder="Select size">
                    <Option value="38">38</Option>
                    <Option value="39">39</Option>
                    <Option value="40">40</Option>
                    <Option value="41">41</Option>
                    <Option value="42">42</Option>
                    <Option value="43">43</Option>
                    <Option value="44">44</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="color"
                  label="Color"
                  rules={[{ required: true, message: 'Please select color' }]}
                >
                  <Select placeholder="Select color">
                    <Option value="Red">Red</Option>
                    <Option value="Blue">Blue</Option>
                    <Option value="Purple">Purple</Option>
                    <Option value="Green">Green</Option>
                    <Option value="Black">Black</Option>
                    <Option value="White">White</Option>
                    <Option value="Pink">Pink</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="stock"
                  label="Stock"
                  rules={[{ required: true, message: 'Please enter stock' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter stock" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="Select status">
                    <Option value="Enabled">Enabled</Option>
                    <Option value="Disabled">Disabled</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {variant ? 'Update Variant' : 'Add Variant'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditVariantModal;