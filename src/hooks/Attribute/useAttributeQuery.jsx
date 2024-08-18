import { useQuery } from "@tanstack/react-query";
import { getAllAttribute } from "../../services/productAttribute";

const useAttributeQuery = (productId) => {
  const queryKey = ["ATTRIBUTE_KEY", productId];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      return await getAllAttribute(productId);
    },
    keepPreviousData: true,
    enabled: !!productId,
    cacheTime: 0,
  });

  return { data, ...rest };
};

export default useAttributeQuery;
