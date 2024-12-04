// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   createCategory,
//   removeCategory,
//   updateCategory,
// } from "../../services/category";

// const useClassificationMutation = ({ action, onSuccess, onError }) => {
//   const queryClient = useQueryClient();

//   const { mutate, ...rest } = useMutation({
//     mutationFn: async (category) => {
//       switch (action) {
//         case "CREATE":
//           return await createCategory(category);
//         case "DELETE":
//           return await removeCategory(category);
//         case "UPDATE":
//           return await updateCategory(category);
//         default:
//           return null;
//       }
//     },
//     onSuccess: () => {
//       onSuccess && onSuccess();
//       queryClient.invalidateQueries({
//         queryKey: ["GET_CLASSIFICATION"],
//       });
//     },
//     onError: (error) => {
//       onError && onError(error);
//       console.log(error);
//     },
//   });

//   return { mutate, ...rest };
// };

// export default useClassificationMutation;
