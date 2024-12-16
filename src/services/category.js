/* eslint-disable no-useless-catch */
import instance from "../configs/axios";
import Author from "./baseApi/AuthorApi";
import { PAGING } from "../systems/constants";
const size = PAGING.SIZE;

export const getAllCategoryForProduct = async () => {
  try {
    let queryCategory = `/categories`;
    return await Author.get(queryCategory);
  } catch (error) {
    throw error;
  }
};

export const getAllCategory = async (page, size, sort) => {
  try {
    let queryCategory = `/categories?size=${size}&page=${page}`;
    if (sort.sortField && sort.sortOrder)
      queryCategory += `&sortField=${sort.sortField}&sort=${sort.sortOrder}`;

    return await instance.get(queryCategory);
  } catch (error) {
    throw error;
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
    const response = await Author.get(`/categories/${category.id}`);
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

export const restoreCategory = async (category) => {
  try {
    const response = await Author.put(`/categories/${category.id}/restore`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
