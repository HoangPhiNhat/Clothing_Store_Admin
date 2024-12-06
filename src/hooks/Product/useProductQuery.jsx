import { useQuery } from "@tanstack/react-query";
import {
  getAllProductTrash,
  getProductAll,
  getProductById,
} from "../../services/product";

const useProductQuery = (
  action,
  id,
  page,
  name,
  size,
  sortField,
  sortOrder
) => {
  const queryKey = id
    ? ["PRODUCT_KEY", id]
    : ["PRODUCT_KEY", page, name, size, sortField, sortOrder];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_PRODUCT":
          return await getProductAll(page, name, size, sortField, sortOrder);
        case "GET_PRODUCT_BY_ID":
          return await getProductById(id);
        case "GET_ALL_PRODUCT_TRASH":
          return await getAllProductTrash(
            page,
            name,
            size,
            sortField,
            sortOrder
          );
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useProductQuery;
