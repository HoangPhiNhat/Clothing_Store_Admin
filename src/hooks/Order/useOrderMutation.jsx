import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmOder, rejectOder } from "../../services/order";

const useOrderMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (order) => {
      switch (action) {
        case "CONFIRM":
          return await confirmOder(order.id);
        case "REJECT":
          return await rejectOder(order.id);
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["ORDER_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useOrderMutation;
