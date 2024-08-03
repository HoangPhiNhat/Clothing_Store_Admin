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
      console.log(1);
      console.log(action);
      
      switch (action) {
        case "GET_ALL_CATEGORY":
          return await getAllCategory(page);
        case "GET_BY_ID":
          return await getCategoryById(id);
        case "GET_ALL_TRASH":
          return await getAllCategoryTrash(page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useCategoryQuery;
