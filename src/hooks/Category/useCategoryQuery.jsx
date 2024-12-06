import { useQuery } from "@tanstack/react-query";
import {
  getAllCategory,
  getAllCategoryForProduct,
  getAllCategoryTrash,
  getCategoryById,
} from "../../services/category";

const useCategoryQuery = (action, id, page, size, sortField, sortOrder) => {
  const queryKey = id
    ? ["CATEGORY_KEY", id]
    : ["CATEGORY_KEY", page, size, sortField, sortOrder];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_CATEGORY":
          return await getAllCategory(page, size, { sortField, sortOrder });
        case "GET_CATEGORY_BY_ID":
          return await getCategoryById(id);
        case "GET_ALL_CATEGORY_TRASH":
          return await getAllCategoryTrash(page);
        case "GET_ALL_CATEGORY_FOR_PRODUCT":
          return await getAllCategoryForProduct();
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useCategoryQuery;
