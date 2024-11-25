/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const getOrderByShipmentId = async (id) => {
  try {
    const res = await Author.get(`/shipment-details/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
