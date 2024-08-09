/* eslint-disable no-undef */
/* eslint-disable no-useless-catch */
import instance from "../configs/axios";

export const getAllAttribute = async (productId) => {
    try {
        console.log(productId);
        const response = await instance.get(`/products/${productId}/productAtts`);
        console.log(response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeProduct = async (id) => {
    try {
        console.log(id);
        const response = await instance.delete(`/products/${data.product_id}/productAtts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getProductById = async (data) => {
    try {
        console.log(product);
        const response = await instance.get(`/products/${data.product_id}/productAtts/${data.id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const createProduct = async (data) => {
    try {
        const response = await instance.post(`/products/${data.product_id}/productAtts`, product);
        return response.data;
    } catch (error) {
        throw error; // Bắt và ném lại lỗi để mutation có thể bắt được
    }
};

export const updateProduct = async (data) => {
    console.log(product);
    try {
        const response = await instance.put(`/products/${data.product_id}/productAtts/${product.id}`, product);
        return response.data;
    } catch (error) {
        throw error;
    }
};