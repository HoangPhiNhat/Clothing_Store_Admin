import instance from "../configs/axios";

export const getCategories = async () => {
  try {
    const response = await instance.get("/categories");

    return response.data; // []
  } catch (error) {
    throw error;
  }
};

export const removeCategory = async (id) => {
  try {
    console.log(id);
    const response = await instance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCategoryById = async (category) => {
  try {
    console.log(category);
    const response = await instance.get(`/categories/${category._id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createCategory = async (category) => {
  try {
    const response = await instance.post(`/categories`, category);
    return response.data;
  } catch (error) {
    throw error; // Bắt và ném lại lỗi để mutation có thể bắt được
  }
};

export const updateCategory = async (category) => {
  console.log(category);
  try {
    const response = await instance.put(`/categories/${category.id}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};
