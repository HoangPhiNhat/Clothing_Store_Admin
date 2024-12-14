import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  createVoucher, toggleStatusVoucher, updateVoucher } from "../../services/voucher";


const useVoucherMutation = ({ action, onSuccess, onError }) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (voucher) => {
      console.log(voucher);
      
      switch (action) {
        case "CREATE":
          return await createVoucher(voucher);
        case "UPDATE":
          return await updateVoucher(voucher);
        case "TOGGLE":
          return await toggleStatusVoucher(voucher);
        default:
          return null;
      }
    },
    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["VOUCHER_KEY"],
      });
    },
    onError: (error) => {
      onError && onError(error);
      console.log(error);
    },
  });

  return { mutate, ...rest };
};

export default useVoucherMutation;
