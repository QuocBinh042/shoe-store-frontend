import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Upload, Button, InputNumber, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { COLOR_OPTIONS, SIZE_OPTIONS, STATUS_PRODUCT_OPTIONS } from '../../../../constants/productConstant';
import CloudinaryImage from '../../../../utils/cloudinaryImage';
import { uploadImage } from '../../../../services/uploadService';

const { Option } = Select;

const EditVariantModal = ({ open, variant, onCancel, onFinish, productId }) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null); // publicId hoặc url cũ
  const [imageFile, setImageFile] = useState(null); // file mới chọn
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isStatusWarning, setIsStatusWarning] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [originalStatus, setOriginalStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (variant) {
        const initialStatus = variant.status || 'AVAILABLE';
        form.setFieldsValue({
          size: variant.size.replace('SIZE_', ''),
          color: variant.color.toLowerCase(),
          stock: variant.stockQuantity || variant.stock || 0,
          status: initialStatus,
        });
        setImage(variant.image || null);
        setImageFile(null);
        setOriginalStatus(initialStatus);
      } else {
        form.setFieldsValue({
          size: '',
          color: '',
          stock: 0,
          status: 'AVAILABLE',
        });
        setImage(null);
        setImageFile(null);
        setOriginalStatus('AVAILABLE');
      }
      setIsStatusWarning(false);
      setPendingStatus(null);
    }
  }, [variant, form, open]);

  const shouldWarn = (status, stock) => {
    if (stock > 0 && (status === 'UNAVAILABLE' || status === 'DISCONTINUED')) {
      return true;
    }
    return false;
  };

  const handleStatusChange = (value) => {
    const stock = form.getFieldValue('stock');
    if (shouldWarn(value, stock)) {
      setIsStatusWarning(true);
      setPendingStatus(value);
    } else {
      form.setFieldsValue({ status: value });
      setIsStatusWarning(false);
      setPendingStatus(null);
    }
  };

  const handleConfirmWarning = () => {
    form.setFieldsValue({ status: pendingStatus });
    setIsStatusWarning(false);
    setPendingStatus(null);
  };

  const handleCancelWarning = () => {
    form.setFieldsValue({ status: originalStatus });
    setIsStatusWarning(false);
    setPendingStatus(null);
  };

  const handleImageSelect = ({ file }) => {
    if (!file.type.startsWith('image/')) {
      message.error('You can only upload image files!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return;
    }
    setImageFile(file);
    setImage(null); // Đánh dấu là ảnh mới, không dùng ảnh cũ nữa
  };

  const handleVariantFinish = async (values) => {
    if (isStatusWarning) {
      message.error('Please confirm or cancel the status change before submitting.');
      return;
    }
    let finalImage = image;
    if (imageFile) {
      setUploading(true);
      try {
        const color = values.color.toUpperCase();
        const publicId = `${productId}/product${productId}_${color}`;
        const response = await uploadImage(imageFile, productId, publicId); // uploadImage cần nhận publicId nếu có
        finalImage = response.data.public_id;
        if (finalImage.includes('project_ShoeStore/ImageProduct/')) {
          finalImage = finalImage.replace('project_ShoeStore/ImageProduct/', '');
        }
        if (!finalImage.startsWith('/')) {
          finalImage = '/' + finalImage;
        }
        console.log("finalImage after upload:", finalImage);
        message.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        console.error('Error response data:', error.response?.data);
        message.error('Failed to upload image');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const formattedValues = {
      ...(variant && { productDetailID: variant.productDetailID }),
      size: `SIZE_${values.size}`,
      color: values.color.toUpperCase(),
      stockQuantity: values.stock,
      status: values.status || 'AVAILABLE',
      image: finalImage, // Đường dẫn đúng định dạng
    };
    onFinish(formattedValues);
    onCancel();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
  };

  const handlePreviewImage = () => {
    setPreviewVisible(true);
  };

  const renderImageWithActions = () => {
    return (
      <div style={{ position: 'relative', width: '100%', height: 120, marginBottom: 8 }}>
        {imageFile ? (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Variant"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
          />
        ) : image ? (
          <CloudinaryImage
            publicId={image.includes('project_ShoeStore/ImageProduct/') ? image : `project_ShoeStore/ImageProduct/${image}`}
            alt="Variant"
            options={{ width: 120, height: 120, crop: 'fill' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={handlePreviewImage}
            style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemoveImage}
            style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
          />
        </div>
      </div>
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={variant ? 'Edit Variant' : 'Add Variant'}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleVariantFinish}>
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label="Image">
              {(image || imageFile) ? (
                renderImageWithActions()
              ) : (
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  customRequest={handleImageSelect}
                  disabled={uploading}
                >
                  {uploadButton}
                </Upload>
              )}
            </Form.Item>
          </Col>
          <Col span={14}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="size"
                  label="Size"
                  rules={[{ required: true, message: 'Please select size' }]}
                >
                  <Select placeholder="Select size">
                    {SIZE_OPTIONS.map((size) => (
                      <Option key={size.value} value={size.value}>
                        {size.label}
                      </Option>
                    ))}
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
                    {COLOR_OPTIONS.map((color) => (
                      <Option key={color.value} value={color.value}>
                        <Space>
                          {color.label}
                          <span
                            style={{
                              display: 'inline-block',
                              width: 16,
                              height: 16,
                              backgroundColor: color.color,
                              borderRadius: '50%',
                              border: '1px solid #ddd',
                              transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        </Space>
                      </Option>
                    ))}
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
                  <Select
                    placeholder="Select status"
                    onChange={handleStatusChange}
                  >
                    {STATUS_PRODUCT_OPTIONS.map(opt => (
                      <Select.Option key={opt.value} value={opt.value}>
                        <Tag color={opt.color}>{opt.label}</Tag>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {isStatusWarning && (
              <Row>
                <Col span={24}>
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#fffbe6', 
                    border: '1px solid #ffe58f', 
                    borderRadius: '4px' 
                  }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        Status{' '}
                        <Tag color={STATUS_PRODUCT_OPTIONS.find(opt => opt.value === pendingStatus)?.color} style={{ fontSize: '12px' }}>
                          {STATUS_PRODUCT_OPTIONS.find(opt => opt.value === pendingStatus)?.label || pendingStatus}
                        </Tag>{' '}
                        may not match inventory ({form.getFieldValue('stock')} units).
                      </p>
                      <Space size="small">
                        <Button type="primary" size="small" onClick={handleConfirmWarning}>
                          Confirm
                        </Button>
                        <Button size="small" onClick={handleCancelWarning}>
                          Cancel
                        </Button>
                      </Space>
                    </Space>
                  </div>
                </Col>
              </Row>
            )}
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

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={600}
      >
        {image && (
          <CloudinaryImage
            publicId={image.includes('project_ShoeStore/ImageProduct/') ? image : `project_ShoeStore/ImageProduct/${image}`}
            alt="Variant Preview"
            options={{ width: 600, crop: 'limit' }}
            style={{ width: '100%', maxHeight: 500, objectFit: 'contain' }}
          />
        )}
      </Modal>
    </Modal>
  );
};

export default EditVariantModal;