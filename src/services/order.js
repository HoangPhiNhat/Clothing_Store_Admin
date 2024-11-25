/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

let size = 5;

export const getAllOrder = async (page) => {
  try {
    let queryOrder = `orders?sort=DESC&size=${size}`;
    if (page) queryOrder += `&page=${page}`;
    return await Author.get(queryOrder);
  } catch (error) {
    throw error;
  }
};

export const getOrderForShipper = async () => {
  try {
    const res = await Author.get("/orders/status");
    return res;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await Author.get(`orders/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductsForOrderId = async (id, page) => {
  try {
    const response = await Author.get(
      `orders/${id}/products?page=${page}&size=5`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const confirmOder = async (id) => {
  try {
    const response = await Author.put(`/orders/${id}/order-status`, {
      order_status: "Chờ lấy hàng",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectOder = async (id) => {
  try {
    const response = await Author.put(`/orders/${id}/order-status`, {
      order_status: "Đã huỷ",
    });
    return response;
  } catch (error) {
    throw error;
  }
};
