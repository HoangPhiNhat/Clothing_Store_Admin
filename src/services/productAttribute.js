import instance from "../configs/axios";

export const getAllAttribute = async (productId) => {
  try {
    console.log(productId);
    const response = await instance.get(`/products/${productId}/productAtts`);
    console.log(response);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async ({ productId, attributes }) => {
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

export const removeAttribute = async (productId, attributeId, sizeId) => {
  try {
    console.log(productId);
    console.log(attributeId);
    console.log(sizeId);
    const response = await instance.delete(
      `/products/${productId}/productAtts/${attributeId}/size/${sizeId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAttributeById = async (productId, attributeId, sizeId) => {
  try {
    console.log(productId);
    console.log(attributeId);
    console.log(sizeId);
    const response = await instance.get(
      `/products/${productId}/productAtts/${attributeId}/size/${sizeId}/show`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAttribute = async (
  attribute,
  productId,
  attributeId,
  sizeId
) => {
  try {
    const response = await instance.put(
      `/products/${productId}/productAtts/${attributeId}/size/${sizeId}`,
      attribute
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
