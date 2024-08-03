import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "../../services/product";

const useProductQuery = (id, page = 1) => {
  const queryKey = id ? ["PRODUCT_KEY", id] : ["PRODUCT_KEY", page];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      return id ? await getProductById(id) : await getProducts(page);
    },
    keepPreviousData: true,
  });
  return { data, ...rest };
};

export default useProductQuery;
