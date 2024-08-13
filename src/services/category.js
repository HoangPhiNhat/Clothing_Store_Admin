/* eslint-disable no-useless-catch */
import instance from "../configs/axios";
import { PAGING } from "../systems/constants";
const size = PAGING.SIZE;

export const getAllCategory = async (page) => {
  try {
    let queryCategory = `/categories?sort=DESC&size=${size}`;
    if (page) queryCategory += `&page=${page}`;
    return await instance.get(queryCategory);
  } catch (error) {
    throw error;
  }
};

export const getAllCategoryTrash = async (page) => {
  try {
    let queryCategory = `/categories/trash?sort=DESC&size=${size}`;
    if (page) queryCategory += `&page=${page}`;
    return await instance.get(queryCategory);
  } catch (error) {
    throw error;
  }
};

export const removeCategory = async (category) => {
  try {
    const response = await instance.delete(`/categories/${category.id}`);
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
    const response = await instance.post(`/categories`, category);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (category) => {
  try {
    const response = await instance.put(`/categories/${category.id}`, category);
    return response;
  } catch (error) {
    throw error;
  }
};

export const restoreCategory = async (category) => {
  try {
    const response = await instance.put(`/categories/${category.id}/restore`);
    return response.data;
  } catch (error) {
    throw error;
  }
}