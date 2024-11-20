/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";
const size = 5;

export const getAllCourier = async (page) => {
  try {
    const res = await Author.get(`/delivery-persons?page=${page}&size=${size}`);
    return res;
  } catch (error) {
    console.log("Get all courier " + error);

    throw error;
  }
};

export const getCourierById = async (id) => {
  try {
    const res = await Author.get(`/delivery-persons/${id}`);
    return res;
  } catch (error) {
    console.log("Get courier by id : " + error);
    throw error;
  }
};

export const createCourier = async (courier) => {
  try {
    const res = await Author.post("/delivery-persons", courier);
    return res;
  } catch (error) {
    console.log("Create courier " + error);
    throw error;
  }
};

export const updateCourier = async (courier) => {
  try {
    const res = await Author.put(`/delivery-persons/${courier.id}`, courier);
    return res;
  } catch (error) {
    console.log("Update courier " + error);
    throw error;
  }
};
