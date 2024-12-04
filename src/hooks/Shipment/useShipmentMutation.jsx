import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignOrderForShipper } from "../../services/order";

const useShipmentMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (order) => {
      switch (action) {
        case "CREATE":
          return await assignOrderForShipper(
            order.delivery_person_id,
            order.order_id
          );
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["SHIPMENT_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useShipmentMutation;
