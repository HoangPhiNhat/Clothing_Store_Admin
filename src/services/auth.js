/* eslint-disable no-useless-catch */
import UnAuthor from "../services/baseApi/UnAuthorApi";
// import instance from "../configs/axios";
// import axios from "axios";
import Author from "../services/baseApi/AuthorApi";
// const url = "/auth";

export const signIn = async (user) => {
  try {
    console.log(user);
    
    return await UnAuthor.post("/login", user);
  } catch (error) {
    throw error;
  }
};

export const signUp = (user) => {
  return UnAuthor.post(`/register`, user);
};

export const refreshToken = async () => {
  try {
    const data = await UnAuthor.post(`/refresh`, {
      refresh_token: localStorage.getItem("refresh"), // Thêm refresh token vào body
    });
    localStorage.setItem("access", data.access_token);
    localStorage.setItem("refresh", data.refresh_token);
  } catch (error) {
    throw error;
  }
};

export const toggelStatusUser = async (user) => {
  try {
    return await Author.put(`/users/${user}/toggle-blacklist`);
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = Author.post("auth/logout");

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    return res;
  } catch (error) {
    throw error;
  }
};

export const getStatusShipper = async () => {
  try {
    const res = Author.get("delivery-persons/statusForShipper");
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateStatusShipper = async (status) => {
  try {
    const res = Author.put("delivery-persons/statusForShipper", { status });
    return res;
  } catch (error) {
    throw error;
  }
};
