/* eslint-disable no-useless-catch */
import Author from "./baseApi/AuthorApi";

export const getAllUser = async (page, size) => {
  try {
    let queryUser = `/users?size=${size}&page=${page}&sort=DESC`;

    return await Author.get(queryUser);
  } catch (error) {
    throw error;
  }
};

export const toggleStatusUser = async (user) => {
  try {
    const response = await Author.put(`/users/${user}/toggle-blacklist`);
    return response;
  } catch (error) {
    throw error;
  }
};
