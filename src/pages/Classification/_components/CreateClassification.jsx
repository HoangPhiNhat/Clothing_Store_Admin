// /* eslint-disable react/prop-types */
// import { Button, Form, Input, message, Modal } from "antd";
// import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
// import useClassificationMutation from "../../../hooks/Classification/useClassificationMutation";

// const CreateClassification = ({ open, onCancel, id }) => {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [form] = Form.useForm();
//   const inputRef = useAutoFocus(open);

//   const { mutate: createCategory, isPending } = useClassificationMutation({
//     action: "CREATE",
//     onSuccess: () => {
//       form.resetFields();
//       onCancel();
//       messageApi.success("Thêm danh mục phân loại thành công");
//     },
//     onError: (error) => {
//       messageApi.error(
//         `Lỗi khi thêm danh mục phân loại: ${error.response.data.message}`
//       );
//       console.log(error);
//     },
//   });

//   const onFinish = (values) => {
//     let parentsId = [];
//     parentsId.push(id);

//     values = { ...values, parent_id: parentsId };

//     console.log(values);
//     createCategory(values);
//   };

//   return (
//     <>
//       {contextHolder}
//       <Modal
//         title="Thêm danh mục"
//         open={open}
//         onCancel={isPending ? null : onCancel}
//         footer={[
//           <Button key="cancel" onClick={onCancel}>
//             Hủy
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={() => form.submit()}
//             loading={isPending}
//           >
//             {isPending ? "Đang thêm..." : "Thêm danh mục"}
//           </Button>,
//         ]}
//       >
//         <Form
//           disabled={isPending}
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
//             label="Tên danh mục"
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

// export default CreateClassification;
