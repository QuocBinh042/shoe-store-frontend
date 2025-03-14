import React, { useState } from 'react';
import { Card, Row, Col, Upload, message, Modal, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error(`${file.name} is not an image file.`);
  }
  return isImage || Upload.LIST_IGNORE;
};

const renderUploadDragger = (placeholder) => (
  <Upload.Dragger
    name="file"
    multiple={false}
    beforeUpload={beforeUpload}
    showUploadList={false}
    style={{
      border: '2px dashed #d9d9d9',
      borderRadius: 8,
      textAlign: 'center',
      padding: 24,
      minHeight: 180,
    }}
    onChange={(info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }}
  >
    <p style={{ marginBottom: 8 }}>
      <UploadOutlined style={{ fontSize: 32 }} />
    </p>
    <p style={{ marginBottom: 8, fontSize: 16 }}>{placeholder}</p>
    <Button type="link">Click to browse</Button>
  </Upload.Dragger>
);

const renderExistingImage = (imageUrl) => (
  <div
    style={{
      width: 120,
      height: 120,
      border: '1px solid #d9d9d9',
      borderRadius: 8,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <img
      src={imageUrl}
      alt="Existing product"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </div>
);

const renderMoreBox = (count, onClick) => (
  <div
    onClick={onClick}
    style={{
      width: 120,
      height: 120,
      border: '1px solid #d9d9d9',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 18,
      color: '#555',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    +{count}
  </div>
);

const ProductImages = ({ product }) => {
  // Lấy danh sách ảnh từ product; nếu chưa có thì mảng rỗng
  const images = product?.images || [];
  const isUpdate = images.length > 0;

  // State cho Modal hiển thị toàn bộ ảnh
  const [visible, setVisible] = useState(false);
  const handleOpenModal = () => setVisible(true);
  const handleCloseModal = () => setVisible(false);

  // Tính toán số ảnh hiển thị nếu cập nhật
  let displayImages = [];
  let moreCount = 0;
  if (images.length <= 4) {
    displayImages = images;
  } else {
    displayImages = images.slice(0, 3);
    moreCount = images.length - 3;
  }

  return (
    <Card style={{ marginBottom: 24, width: '100%' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Product Images</h3>
      </Row>

      {isUpdate ? (
        <Row gutter={32}>
          {/* Khu vực upload luôn bên trái */}
          <Col xs={24} sm={8}>
            {renderUploadDragger('Drop your image here')}
          </Col>
          {/* Khu vực hiển thị ảnh */}
          <Col xs={24} sm={16}>
            <Row gutter={[32, 16]}>
              {displayImages.map((src, index) => (
                <Col key={index}>
                  {renderExistingImage(src)}
                </Col>
              ))}
              {images.length > 4 && (
                <Col>
                  {renderMoreBox(moreCount, handleOpenModal)}
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      ) : (
        // Create mode: chỉ hiển thị 1 khu vực upload ảnh
        <Row>
          <Col span={24}>
            {renderUploadDragger('Drop your image here')}
          </Col>
        </Row>
      )}

      <Modal
        open={visible}
        onCancel={handleCloseModal}
        footer={null}
        title="All Product Images"
        width={500}
      >
        <Row gutter={[16, 16]}>
          {images.map((src, index) => (
            <Col key={index} xs={16} sm={8}>
              {renderExistingImage(src)}
            </Col>
          ))}
        </Row>
      </Modal>
    </Card>
  );
};

export default ProductImages;
