/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const getAllAttribute = async (productId, page, size, sort) => {
  try {
    let queryAttribute = `/products/${productId}/productAtts?size=${size}&page=${page}`;
    if (sort.sortField && sort.sortOrder)
      queryAttribute += `&sortField=${sort.sortField}&sort=${sort.sortOrder}`;

     return await Author.get(queryAttribute);
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const createAttribute = async (productId, attributes) => {
  try {
    console.log(productId);
    const response = await Author.post(
      `/products/${Number(productId)}/productAtts`,
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
