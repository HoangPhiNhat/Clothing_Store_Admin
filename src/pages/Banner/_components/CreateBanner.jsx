// /* eslint-disable react/prop-types */
// import { Button, Form, Input, message, Modal } from "antd";
// import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
// import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
// import { extractPublicId, uploadFileCloudinary } from "../../../services/cloudinary";
// import { useState } from "react";

// const CreateBanner = ({ open, onCancel }) => {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [form] = Form.useForm();
//   const inputRef = useAutoFocus(open);
//   const [publicIds, setPublicIds] = useState([]);
//   const [isPending, setIsPending] = useState(false);

//   const { mutate: createCategory, isPending: createPending } = useCategoryMutation({
//     action: "CREATE",
//     onSuccess: () => {
//       form.resetFields();
//       onCancel();
//       messageApi.success("Thêm danh mục thành công");
//     },
//     onError: (error) => {
//       messageApi.error(`Lỗi khi thêm danh mục: ${error.response.data.message}`);
//       console.log(error);
//     },
//   });

//  const onFinish = async (values) => {
//     try {
//       setIsPending(true);
//       const { attributes, ...data } = values;
//       const thumbnail = await uploadFileCloudinary(data.thumbnail[0].thumbUrl);
//       const productResponse = {
//         ...data,
//         thumbnail: thumbnail,
//       };
//       const publicIdProduct = extractPublicId(thumbnail);
//       console.log(publicIdProduct);

//       setPublicIds((prev) => [...prev, publicIdProduct]);
//       console.log(attributes);

//       const attributesWithImages = await Promise.all(
//         attributes.map(async (attribute) => {
//           if (attribute?.image?.fileList[0]?.thumbUrl) {
//             const imageUrl = await uploadFileCloudinary(
//               attribute?.image?.fileList[0].thumbUrl
//             );
//             const publicIdAttrbutes = extractPublicId(imageUrl);
//             setPublicIds((prev) => [...prev, publicIdAttrbutes]);
//             return {
//               ...attribute,
//               image: imageUrl,
//             };
//           }

//           return attribute;
//         })
//       );
//       const finalData = {
//         ...productResponse,
//         product_att: attributesWithImages,
//       };

//     //   createProduct(finalData);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsPending(false);
//     }
//   };

//   return (
//     <>
//       {contextHolder}
//       <Modal
//         title="Thêm danh mục"
//         open={open}
//         onCancel={createPending ? null : onCancel}
//         footer={[
//           <Button key="cancel" onClick={onCancel}>
//             Hủy
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={() => form.submit()}
//             loading={createPending}
//           >
//             {createPending ? "Đang thêm..." : "Thêm"}
//           </Button>,
//         ]}
//       >
//         <Form
//           disabled={createPending}
//           form={form}
//           name="basic"
//           style={{ maxWidth: 600 }}
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//           autoComplete="off"
//         >
//           <Form.Item
//             className="w-full"
//             name="name"
//             rules={[
//               {
//                 required: true,
//                 message: "Vui lòng nhập danh mục!",
//               },
//               {
//                 min: 6,
//                 message: "Tên danh mục phải dài hơn 6 kí tự.",
//               },
//             ]}
//           >
//             <Input ref={inputRef} />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default CreateBanner;
