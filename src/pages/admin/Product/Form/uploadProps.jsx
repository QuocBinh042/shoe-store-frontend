import { useState } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage, buildCloudinaryUrl } from '../../../../services/uploadService';

const uploadProps = (fileList, setFileList) => ({
  name: 'file',
  multiple: true,
  listType: 'picture-card',
  fileList: fileList,
  onChange: ({ fileList: newFileList }) => {
    setFileList(newFileList);
  },
  beforeUpload: (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
    return true;
  },
  customRequest: async ({ file, onSuccess, onError }) => {
    try {
      const response = await uploadImage(file);
      const cloudinaryUrl = buildCloudinaryUrl(response.public_id);
      
      onSuccess({
        url: cloudinaryUrl,
        public_id: response.public_id
      });
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed');
      onError(error);
    }
  },
  onRemove: (file) => {
    // Optional: Implement delete from Cloudinary if needed
    const { public_id } = file;
    // You might want to add a service method to delete image from Cloudinary
  },
  onPreview: async (file) => {
    let src = file.url || file.thumbUrl;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.writeln(image.outerHTML);
  }
});

export default uploadProps;