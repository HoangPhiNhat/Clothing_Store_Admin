/* eslint-disable no-useless-catch */
import instance from "../configs/axios";
import Author from "../services/baseApi/AuthorApi";
let size = 5;

export const getAllCategoryForProduct = async () => {
  try {
    let queryCategory = `/campaigns/category`;
    return await Author.get(queryCategory);
  } catch (error) {
    console.log(error);
    throw error;
    // window.location.href = "/admin/page500";
  }
};

export const getAllCategory = async (page) => {
  try {
    let queryCategory = `/categories?sort=DESC&size=${size}`;
    if (page) queryCategory += `&page=${page}`;
    return await instance.get(queryCategory);
  } catch (error) {
    console.log(error);
    // window.location.href = "/admin/page500";
  }
};

export const getAllCategoryTrash = async (page) => {
  try {
    let queryCategory = `/categories/trash?sort=DESC&size=${size}`;
    if (page) queryCategory += `&page=${page}`;
    return await Author.get(queryCategory);
  } catch (error) {
    throw error;
  }
};

export const removeCategory = async (category) => {
  try {
    const response = await Author.delete(`/categories/${category.id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (category) => {
  try {
    console.log(category);
    const response = await instance.get(`/categories/${category.id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const response = await Author.post(`/categories`, category);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (category) => {
  try {
    const response = await Author.put(`/categories/${category.id}`, category);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleStatusCategory = async (category) => {
  try {
    const response = await Author.put(
      `/categories/${category.id}/toggle-status`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClassification = async (id, page) => {
  try {
    let query = `/categories/${id}/children?size=${size}`;
    if (page) query += `&page=${page}`;
    const response = await instance.get(query);
    return response.data;
  } catch (error) {
    throw error;
  }
};
