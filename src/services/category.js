/* eslint-disable no-useless-catch */
import instance from "../configs/axios";
let size = 5;
export const getAllCategory = async (page) => {
  try {
    let queryCategory = `/categories?size=${size}`;
    if (page) queryCategory += `&page=${page}`;
    return await instance.get(`${queryCategory}&sort=DESC`);
  } catch (error) {
    throw error;
  }
};

export const removeCategory = async (category) => {
  try {
    const response = await instance.delete(`/categories/${category.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (category) => {
  try {
    console.log(category);
    const response = await instance.get(`/categories/${category.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createCategory = async (category) => {
  try {
    const response = await instance.post(`/categories`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (category) => {
  console.log(category);
  try {
    const response = await instance.put(`/categories/${category.id}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};
