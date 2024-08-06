import instance from "../configs/axios";
let size = 5;

export const getProducts = async (page) => {
  try {
    const response = await instance.get(`/products?page=${page}&size=${size}&sort=DESC`);
console.log(response);

    
    return response.data; // Trả về dữ liệu từ phản hồi API
  } catch (error) {
    throw error;
  }
};

export const removeProduct = async (id) => {
  try {
    console.log(id);
    const response = await instance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log(id);
    const response = await instance.get(`/products/getById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createProduct = async (product) => {
  try {
    const response = await instance.post(`/products`, product);
    return response.data;
  } catch (error) {
    throw error; // Bắt và ném lại lỗi để mutation có thể bắt được
  }
};

export const updateProduct = async (product) => {
  console.log(product);
  try {
    const response = await instance.put(`/products/${product.id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};
