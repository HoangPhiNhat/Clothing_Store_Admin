import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  removeProduct,
  restoreProduct,
  updateProduct,
} from "../../services/product";

const useProductMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: async (product) => {
      switch (action) {
        case "CREATE":
          return await createProduct(product);
        case "DELETE":
          return await removeProduct(product);
        case "UPDATE":
          return await updateProduct(product);
        case "RESTORE":
          return await restoreProduct(product);
        default:
          return null;
      }
    },
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
      queryClient.invalidateQueries({
        queryKey: ["PRODUCT_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useProductMutation;
