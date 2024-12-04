/* eslint-disable no-useless-catch */
import instance from "../configs/axios";
import Author from "../services/baseApi/AuthorApi";

let size = 5;

export const getProductAll = async (page, name) => {
  try {
    let api = `/products?page=${page}&size=${size}&sort=DESC`;
    if (name) api += `&name=${name}`;
    const response = await instance.get(api);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProductTrash = async (page, name) => {
  try {
    let api = `/products/trash?page=${page}&size=${size}&sort=DESC`;
    if (name) api += `&name=${name}`;
    const response = await Author.get(api);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeProduct = async (id) => {
  try {
    const response = await Author.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await Author.get(`/products/${id}/show`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    const response = await Author.post(`/products`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await Author.put(`/products/${product.id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreProduct = async (id) => {
  try {
    const response = await Author.put(`/products/${id}/restore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
