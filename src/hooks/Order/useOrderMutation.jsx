import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignOrderForShipper,
  confirmOder,
  rejectOder,
  returnOder,
  deliveredOder,
  confirmOderList,
  rejectOderList,
} from "../../services/order";

const useOrderMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (order) => {
      switch (action) {
        case "CONFIRM":
          return await confirmOder(order.id);
        case "REJECT":
          return await rejectOder(order.id);
        case "CONFIRM-LIST":
          return await confirmOderList(order);
        case "REJECT-LIST":
          return await rejectOderList(order);
        case "RETURN":
          return await returnOder(order.id);
        case "DELIVERED":
          return await deliveredOder(order.id);
        case "ASSIGN_ORDER_FOR_SHIPPER":
          return await assignOrderForShipper(order.shipperId, order.orderId);
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
