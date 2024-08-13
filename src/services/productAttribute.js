import instance from "../configs/axios";

export const getAllAttribute = async (productId,page,limit) => {
  try {
    const response = await instance.get(`/products/${productId}/productAtts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAttribute = async (productId, attributes) => {
  try {
    const response = await instance.post(
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
    const response = await instance.delete(
      `/products/${productId}/productAtts/${attributeId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAttribute = async (productId, attributeId, attribute) => {
  try {
    const response = await instance.put(
      `/products/${productId}/productAtts/${attributeId}`,
      attribute
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
