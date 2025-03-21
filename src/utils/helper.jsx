const cloudinaryConfig = {
  cloudName: 'dowsceq4o',
  secure: true,          
};

export const buildCloudinaryUrl = (publicId, options = {}) => {
  let transformations = [];

  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  const transformationStr = transformations.join(',');  
  const baseUrl = cloudinaryConfig.secure
    ? 'https://res.cloudinary.com'
    : 'http://res.cloudinary.com';

  if (transformationStr) {
    return `${baseUrl}/${cloudinaryConfig.cloudName}/image/upload/${transformationStr}/${publicId}`;
  }
  return `${baseUrl}/${cloudinaryConfig.cloudName}/image/upload/${publicId}`;
};


export function currencyFormat(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " ₫";
}
