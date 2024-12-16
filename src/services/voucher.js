/* eslint-disable no-useless-catch */
import Author from "./baseApi/AuthorApi";

export const getAllVoucher = async () => {
  try {
    let queryVoucher = `/vouchers`;
    return await Author.get(queryVoucher);
  } catch (error) {
    throw error;
  }
};

export const createVoucher = async (voucher) => {
  try {
    const response = await Author.post(`/vouchers`, voucher);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleStatusVoucher = async (voucher) => {
  try {
    console.log(voucher);
    
    const response = await Author.put(`/vouchers/${voucher}/toggle-status`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const updateVoucher = async (voucher) => {
  try {
    const response = await Author.put(`/vouchers/${voucher.id}`, voucher);
    return response;
  } catch (error) {
    throw error;
  }
};