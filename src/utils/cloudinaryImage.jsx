import React from 'react';
import { buildCloudinaryUrl } from './helper';

const CloudinaryImage = ({ publicId, alt, options = {}, style = {}, className = '' }) => {
  const imageUrl = buildCloudinaryUrl(publicId, options);
  return (
    
    <img
      src={imageUrl}
      alt={alt}
      style={style}
      className={className}
    />
  );
};

export default CloudinaryImage;
