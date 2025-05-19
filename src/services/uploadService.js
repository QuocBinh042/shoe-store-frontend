import { apiClient } from './apiService';

export const uploadImage = async (file, productId, publicId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (productId) {
    formData.append("productId", productId);
  }
  if (publicId) {
    formData.append("publicId", publicId);
  }
  
  try {
    const response = await apiClient.post("cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
