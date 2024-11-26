/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";
export const getAllOrderShipping = async () => {
  try {
    const res = await Author.get(`orders/user`);
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

export const deliveryStatus = async (id, statusCode) => {
  try {
    const res = await Author.put(`orders/${id}/order-status`, {
      order_status: statusCode,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
