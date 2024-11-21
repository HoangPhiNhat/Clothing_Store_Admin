import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDiscount,
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
        case "UPDATE":
          return await updateDiscount(discount);
        case "TOGGLE_STATUS":
          return await toggleStatusDiscount(discount.id);
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["CATEGORY_KEY"],
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
