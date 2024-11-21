/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";
const size = 5;

export const getAllDiscount = async (page) => {
  try {
    const res = await Author.get(`/campaigns?size${size}&page=${page}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getProductsOnDiscount = async (id, page) => {
  try {
    const res = await Author.get(
      `/campaigns/${id}/show?size${size}&page=${page}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllProductForAddDiscount = async (page) => {
  try {
    const res = await Author.get(`/campaigns/filter?size${size}&page=${page}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createDiscount = async (discount) => {
  try {
    const res = await Author.post("/campaigns", discount);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateDiscount = async (discount) => {
  try {
    const res = await Author.put(`/campaigns/${discount.id}`, discount);
    return res;
  } catch (error) {
    throw error;
  }
};

export const toggleStatusDiscount = async (id) => {
  try {
    const res = await Author.put(`/campaigns/${id}/toggle-status`);
    return res;
  } catch (error) {
    throw error;
  }
};
