import { useQuery } from "@tanstack/react-query";
import {
  getAllCategory,
  getAllCategoryForProduct,
  getAllCategoryParent,
  getAllCategoryTrash,
  getAllClassification,
  getCategoryById,
} from "../../services/category";

const useCategoryQuery = (action, id, page) => {
  let queryKey = id ? ["CATEGORY_KEY", id] : ["CATEGORY_KEY", page];

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
        case "GET_ALL_CATEGORY_FOR_PRODUCT":
          return await getAllCategoryForProduct();
        case "GET_CLASSIFICATION_BY_ID":
          return await getAllClassification(id, page);
        case "GET_ALL_CATEGORY_PARENT":
          return await getAllCategoryParent();
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useCategoryQuery;
