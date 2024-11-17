/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const getAllColor = async () => {
  try {
    const response = await Author.get(`/colors`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getColorById = async (colorId) => {
  try {
    const response = await Author.get(`/colors/${colorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createColor = async (color) => {
  try {
    const response = await Author.post(`/colors`, color);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeColor = async (colorId) => {
  try {
    const response = await Author.delete(`/colors/${colorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateColor = async (color) => {
  try {
    const response = await Author.put(`/colors/${color.id}`, color);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllColorTrash = async () => {
  try {
    const response = await Author.get(`/colors/trash`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const retoreColor = async (colorId) => {
  try {
    const response = await Author.delete(`/colors/${colorId}/retore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
