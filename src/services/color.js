import instance from "../configs/axios";

export const getAllColor = async () => {
  try {
    const response = await instance.get(`/colors`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getColorById = async (colorId) => {
  try {
    const response = await instance.get(`/colors/${colorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createColor = async (color) => {
  try {
    const response = await instance.post(`/colors`, color);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeColor = async (colorId) => {
  try {
    const response = await instance.delete(`/colors/${colorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateColor = async (colorId, color) => {
  try {
    const response = await instance.put(`/colors/${colorId}`, color);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllColorTrash = async () => {
  try {
    const response = await instance.get(`/colors/trash`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const retoreColor = async (colorId) => {
  try {
    const response = await instance.delete(`/colors/${colorId}/retore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
