/* eslint-disable no-useless-catch */
import instance from "../configs/axios";
import Author from "../services/baseApi/AuthorApi";

let size = 10;

export const getProductAll = async (page, name) => {
  try {
    const response = await instance.get(
      `/products?name=${name}&page=${page}&size=${size}&sort=DESC`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProductTrash = async (page, name) => {
  try {
    const response = await Author.get(
      `/products/trash?name=${name}&page=${page}&size=${size}&sort=DESC`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeProduct = async (id) => {
  try {
    console.log(id);
    const response = await Author.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log(id);
    const response = await Author.get(`/products/${id}/show`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    const response = await Author.post(`/products`, product);
    console.log(response);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (product) => {
  console.log(product);
  try {
    const response = await Author.put(`/products/${product.id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreProduct = async (id) => {
  try {
    console.log(id);

    const response = await Author.put(`/products/${id}/restore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};