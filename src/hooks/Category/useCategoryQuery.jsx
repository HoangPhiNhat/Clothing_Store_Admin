import { useQuery } from "@tanstack/react-query";
import { getAllCategory, getCategoryById } from "../../services/category";

const useCategoryQuery = (id, page) => {
  const queryKey = id ? ["CATEGORY_KEY", id] : ["CATEGORY_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log(page);
      const response = id
        ? await getCategoryById(id)
        : await getAllCategory(page);
      return response;
    },
  });
  return { data, ...rest };
};
export default useCategoryQuery;
