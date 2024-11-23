import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProductToDiscount,
  createDiscount,
  deleteProductOutDiscount,
  toggleStatusDiscount,
  updateDiscount,
} from "../../services/discount";

const useDisCountMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (discount) => {
      switch (action) {
        case "CREATE":
          return await createDiscount(discount);
        case "CREATE_PRODUCT_FOR_DISCOUNT":
          return await addProductToDiscount(discount.id, discount.product_id);
        case "UPDATE":
          return await updateDiscount(discount);
        case "TOGGLE_STATUS":
          return await toggleStatusDiscount(discount.id);
        case "DELETE_PRODUCT_OUT_DISCOUNT":
          return await deleteProductOutDiscount(
            discount.id,
            discount.productId
          );
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["DISCOUNT_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useDisCountMutation;
