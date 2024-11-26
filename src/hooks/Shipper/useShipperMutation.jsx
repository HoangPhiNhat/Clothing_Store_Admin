import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryStatus, updateStatusShipments } from "../../services/shipper";

const useShippperMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (shipments) => {
      switch (action) {
        case "START_SHIPMENT":
          return await updateStatusShipments(shipments, "Đang giao hàng");
        case "END_SHIPMENT":
          return await updateStatusShipments(shipments, "Hoàn thành giao hàng");
        case "DELIVERY_SUCCESS":
          return await deliveryStatus(shipments, "Đã giao");
        case "DELIVERY_FAIL":
          return await deliveryStatus(shipments, "Trả hàng");
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["SHIPPER"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useShippperMutation;
