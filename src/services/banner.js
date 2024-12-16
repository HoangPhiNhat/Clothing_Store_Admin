/* eslint-disable no-useless-catch */
import Author from "./baseApi/AuthorApi";

export const getAllBanner = async () => {
  try {
    let queryBanner = `/banners`;
    return await Author.get(queryBanner);
  } catch (error) {
    throw error;
  }
};

export const removeBanner = async (banner) => {
  try {
    const response = await Author.delete(`/banners/${banner.id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBannerById = async (banner) => {
  try {
    const response = await Author.get(`/banners/${banner.id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const createBanner = async (banner) => {
  try {
    const response = await Author.post(`/banners`, banner);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateBanner = async (banner) => {
  try {
    const response = await Author.put(`/banners/${banner.id}`, banner);
    return response;
  } catch (error) {
    throw error;
  }
};


export const toggleStatusBanner = async (banner) => {
  try {
    const response = await Author.put(`/banners/${banner}`);
    return response;
  } catch (error) {
    throw error;
  }
};
