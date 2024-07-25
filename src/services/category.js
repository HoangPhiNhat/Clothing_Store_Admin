import instance from "../configs/axios";

export const getAll = async () => {
  try {
    const response = await instance.get("/categories");
    console.log(response);

    return response.data; // []
  } catch (error) {
    return {
      data: [],
      status: 500,
      statusText: "error",
      config: {},
      headers: {},
      request: {},
    };
  }
};

export const remove = async (id) => {
  try {
    console.log(id);
    const response = await instance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getById = async (category) => {
  try {
    console.log(category);
    const response = await instance.get(`/categories/${category._id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const create = async (category) => {
  try {
    const response = await instance.post(`/categories`, category);
    return response.data;
  } catch (error) {
    throw error; // Bắt và ném lại lỗi để mutation có thể bắt được
  }
};

export const update = async (category) => {
  console.log(category);
  try {
    const response = await instance.put(`/categories/${category.id}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};
