import { useQuery } from "@tanstack/react-query";
import { getAllProductTrash, getProductAll, getProductById } from "../../services/product";

const useProductQuery = (action, id, page) => {
  const queryKey = id ? ["PRODUCT_KEY", id] : ["PRODUCT_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_PRODUCT":
          return await getProductAll(page);
        case "GET_PRODUCT_BY_ID":
          return await getProductById(id);
        case "GET_ALL_PRODUCT_TRASH":
          return await getAllProductTrash(page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useProductQuery;
