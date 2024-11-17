/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";

export const createCourier = async (courier) => {
  try {
    const res = await Author.post("/delivery-persons", courier);
    return res;
  } catch (error) {
    console.log("Create courier " + error);
    throw error;
  }
};
