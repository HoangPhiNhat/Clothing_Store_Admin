import axios from "axios";

export const uploadFileCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qirecrzg");
    formData.append("folder", "clothing_shop");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dqxshljwn/upload",
      formData
    );
    return response.data.url;
  } catch (error) {
    throw error;
  }
};
