import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourier, updateCourier } from "../../services/courier";

const useCourierMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (courier) => {
      switch (action) {
        case "CREATE":
          return await createCourier(courier);
        case "UPDATE":
          return await updateCourier(courier);
        case "DELETE":
          return null;
        default:
          return null;
      }
    },
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
      queryClient.invalidateQueries({
        queryKey: ["COURIER_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useCourierMutation;
