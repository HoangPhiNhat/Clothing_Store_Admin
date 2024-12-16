/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const getAllOrderShipping = async (page, status) => {
  try {
    const res = Author.get(
      `orders/delivery-person?size=5&page=${page}&status=${status}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllShipment = async () => {
  try {
    const res = await Author.get(`shipments/user`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllOrderShipperHistory = async (page) => {
  try {
    const res = await Author.get(
      `orders/delivery-person/history?size=5&page=${page}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateStatusShipments = async (id, status) => {
  try {
    const res = await Author.put(`shipments/${id}/status`, {
      status,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const deliveryStatus = async (id, statusCode, note, image) => {
  try {
    const res = await Author.put(`orders/${id}/order-status`, {
      order_status: statusCode,
      note,
      image,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export const getAllShipperStatusOnline = async () => {
  try {
    const res = await Author.get("delivery-persons?status=online");
    return res;
  } catch (error) {
    throw error;
  }
};
