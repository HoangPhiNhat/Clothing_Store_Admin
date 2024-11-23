/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";
const size = 5;

export const getAllDiscount = async (page) => {
  try {
    const res = await Author.get(`/campaigns?size=${size}&page=${page}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getProductsOnDiscount = async (id, page) => {
  try {
    const res = await Author.get(
      `/campaigns/${id}/show?size=${size}&page=${page}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllProductForAddDiscount = async (page, search) => {
  try {
    let api = `/campaigns/filter?size=${size}&page=${page}`;

    if (search.category_id) api += `&categoryId=${search.category_id}`;

    if (search.maxPrice) api += `&maxPrice=${search.maxPrice}`;
    if (search.minPrice) api += `&minPrice=${search.minPrice}`;

    if (search.minStockQuantity)
      api += `&minStockQuantity=${search.minStockQuantity}`;
    if (search.maxStockQuantity)
      api += `&maxStockQuantity=${search.maxStockQuantity}`;

    if (search.name) api += `$name=${search.name}`;

    const res = await Author.get(api);
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

export const deleteProductOutDiscount = async (capmpainId, productId) => {
  try {
    const res = await Author.delete(
      `/campaigns/${capmpainId}/product/${productId}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const addProductToDiscount = async (id, productsId) => {
  try {
    const res = await Author.post(`/campaigns/${id}/add-product`, {
      product_id: productsId,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
