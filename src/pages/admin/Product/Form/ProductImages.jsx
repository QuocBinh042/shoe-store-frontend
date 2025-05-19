import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Upload, message, Modal, Button } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import CloudinaryImage from '../../../../utils/cloudinaryImage';

const ProductImages = ({
  product,
  onImagesUpdate,
  maxImages = 8
}) => {
  const [images, setImages] = useState(
    product?.imageURL ? product.imageURL.map(url => ({ url })) : []
  );

  useEffect(() => {
    if (product?.imageURL) {
      setImages(product.imageURL.map(url => ({ url })));
    } else {
      setImages([]);
    }
  }, [product]);

  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Sử dụng FileReader để tạo Data URL cho preview
  const handleImageUpload = (options) => {
    const { file } = options;
    if (!file.type.startsWith('image/')) {
      message.error('You can only upload image files!');
      return;
    }
    if (images.length >= maxImages) {
      message.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result là Data URL
      const newImage = { file, url: reader.result };
      const newImages = [...images, newImage];
      setImages(newImages);
      onImagesUpdate && onImagesUpdate(newImages);
      message.success('Image added successfully');
      setUploading(false);
    };
    reader.onerror = () => {
      message.error('Image preview failed');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesUpdate && onImagesUpdate(newImages);
  };

  const handlePreviewImage = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const renderImageWithActions = (imageObj, index) => (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      {imageObj.url.startsWith('data:') ? (
        <img
          src={imageObj.url}
          alt={`Product ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <CloudinaryImage
          publicId={imageObj.url.includes('project_ShoeStore/ImageProduct/') ? imageObj.url : `project_ShoeStore/ImageProduct/${imageObj.url}`}
          alt={`Product ${index + 1}`}
          options={{ width: 120, height: 120, crop: 'fill' }}
          style={{ borderRadius: 8, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
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
          onClick={() => handlePreviewImage(index)}
          style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveImage(index)}
          style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      </div>
    </div>
  );

  return (
    <Card style={{ marginBottom: 24, width: '100%' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Product Images</h3>
      </Row>

      <Row gutter={[16, 16]}>
        {images.map((imageObj, index) => (
          <Col key={index}>{renderImageWithActions(imageObj, index)}</Col>
        ))}

        {images.length < maxImages && (
          <Col>
            <Upload
              listType="picture-card"
              showUploadList={false}
              customRequest={handleImageUpload}
              disabled={uploading}
            >
              {uploadButton}
            </Upload>
          </Col>
        )}
      </Row>

      <Modal
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        {selectedImageIndex !== null && (
          images[selectedImageIndex].url.startsWith('data:') ? (
            <img
              src={images[selectedImageIndex].url}
              alt={`Full view ${selectedImageIndex + 1}`}
              style={{ width: '100%', maxHeight: 500, objectFit: 'contain' }}
            />
          ) : (
            <CloudinaryImage
              publicId={images[selectedImageIndex].url.includes('project_ShoeStore/ImageProduct/') ? 
                images[selectedImageIndex].url : 
                `project_ShoeStore/ImageProduct/${images[selectedImageIndex].url}`}
              alt={`Full view ${selectedImageIndex + 1}`}
              options={{ width: 600, crop: 'limit' }}
              style={{ width: '100%', maxHeight: 500, objectFit: 'contain' }}
            />
          )
        )}
      </Modal>
    </Card>
  );
};

export default ProductImages;
