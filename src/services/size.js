/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const getAllSize = async () => {
  try {
    const response = await Author.get(`/sizes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSizeById = async (sizeId) => {
  try {
    const response = await Author.get(`/sizes/${sizeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSize = async (size) => {
  try {
    const response = await Author.post(`/sizes`, size);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeSize = async (sizeId) => {
  try {
    const response = await Author.delete(`/sizes/${sizeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSize = async (sizeId, size) => {
  try {
    const response = await Author.put(`/sizes/${sizeId}`, size);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSizeTrash = async () => {
  try {
    const response = await Author.get(`/sizes/trash`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const retoreSize = async (sizeId) => {
  try {
    const response = await Author.delete(`/sizes/${sizeId}/retore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};