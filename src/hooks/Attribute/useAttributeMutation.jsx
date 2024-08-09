import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAttribute } from "../../services/productAttribute";


const useProductMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (product) => {
      switch (action) {
        case "DELETE":
          return await removeAttribute(product);
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
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
