import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Upload, Button, InputNumber, Select, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditVariantModal = ({ open, variant, onCancel, onFinish }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(variant?.image || '');

  useEffect(() => {
    if (variant) {
      form.setFieldsValue({
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        status: variant.status,
      });
      setImageUrl(variant.image);
    } else {
      form.resetFields();
      setImageUrl('');
    }
  }, [variant, form, open]);

  // Sử dụng Upload component của AntD để upload ảnh mới
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === 'done' || info.file.status === 'uploading') {
        // Sử dụng URL tạm thời cho demo; ở thực tế bạn sẽ lấy URL từ server trả về
        const url = URL.createObjectURL(info.file.originFileObj);
        setImageUrl(url);
        if (info.file.status === 'done') {
          message.success(`${info.file.name} uploaded successfully.`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    showUploadList: false,
    listType: 'picture-card',
  };

  const handleSubmit = (values) => {
    const updatedVariant = {
      ...variant,
      ...values,
      image: imageUrl,
    };
    onFinish(updatedVariant);
  };

  return (
    <Modal
      title="Edit Variant"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          {/* Left: Image Upload */}
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
                    <Option value="Red">
                      Red <span style={{ backgroundColor: 'red', display: 'inline-block', width: '10px', height: '10px', marginLeft: '5px' }}></span>
                    </Option>
                    <Option value="Blue">
                      Blue <span style={{ backgroundColor: 'blue', display: 'inline-block', width: '10px', height: '10px', marginLeft: '5px' }}></span>
                    </Option>
                    <Option value="Purple">
                      Purple <span style={{ backgroundColor: 'purple', display: 'inline-block', width: '10px', height: '10px', marginLeft: '5px' }}></span>
                    </Option>
                    <Option value="Green">
                      Green <span style={{ backgroundColor: 'green', display: 'inline-block', width: '10px', height: '10px', marginLeft: '5px' }}></span>
                    </Option>
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

        {/* Update Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Update Variant
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditVariantModal;
