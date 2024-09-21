/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";
export const getAllAttribute = async (productId) => {
  try {
    const response = await Author.get(`/products/${productId}/productAtts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAttribute = async (productId, attributes) => {
  try {
    const response = await Author.post(
      `/products/${productId}/productAtts`,
      attributes
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeAttribute = async (productId, attributeId) => {
  try {
    const response = await Author.delete(
      `/products/${productId}/productAtts/${attributeId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAttribute = async (productId, attributeId, attribute) => {
  try {
    const response = await Author.put(
      `/products/${productId}/productAtts/${attributeId}`,
      attribute
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
