import instance from "../configs/axios";

export const getAllSize = async () => {
  try {
    const response = await instance.get(`/sizes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSizeById = async (sizeId) => {
  try {
    const response = await instance.get(`/sizes/${sizeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSize = async (size) => {
  try {
    const response = await instance.post(`/sizes`, size);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeSize = async (sizeId) => {
  try {
    const response = await instance.delete(`/sizes/${sizeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSize = async (sizeId, size) => {
  try {
    const response = await instance.put(`/sizes/${sizeId}`, size);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSizeTrash = async () => {
  try {
    const response = await instance.get(`/sizes/trash`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const retoreSize = async (sizeId) => {
  try {
    const response = await instance.delete(`/sizes/${sizeId}/retore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};