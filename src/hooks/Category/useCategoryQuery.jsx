import { useQuery } from "@tanstack/react-query";
import {
  getAllCategory,
  getAllCategoryTrash,
  getCategoryById,
} from "../../services/category";

const useCategoryQuery = (action, id, page) => {
  const queryKey = id ? ["CATEGORY_KEY", id] : ["CATEGORY_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_CATEGORY":
          return await getAllCategory(page);
        case "GET_CATEGORY_BY_ID":
          return await getCategoryById(id);
        case "GET_ALL_CATEGORY_TRASH":
          return await getAllCategoryTrash(page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useCategoryQuery;
