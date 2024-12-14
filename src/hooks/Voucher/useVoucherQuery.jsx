import { useQuery } from "@tanstack/react-query";
import { getAllVoucher } from "../../services/voucher";

const useVoucherQuery = (
  action,
  id
) => {
  const queryKey = id
    ? ["VOUCHER_KEY", id]
    : ["VOUCHER_KEY"];
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_VOUCHER":
          return await getAllVoucher();
      
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};

export default useVoucherQuery;
