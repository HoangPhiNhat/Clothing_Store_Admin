// import {
//   DeleteOutlined,
//   EditOutlined,
//   PlusCircleOutlined,
// } from "@ant-design/icons";
// import {
//   Breadcrumb,
//   Button,
//   Pagination,
//   Popconfirm,
//   Space,
//   Table,
//   message,
// } from "antd";
// import { useState } from "react";
// import useBannerQuery from "../../hooks/Banner/useBannerQuery";
// const Banner = () => {
//   const [messageApi, contextHolder] = message.useMessage();

//   // const [modalCreateOpen, setModalCreateOpen] = useState(false);
//   // const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
//   // const [selectedCategory, setSelectedCategory] = useState(null);
//   const [pageCategory, setPageCategory] = useState(1);
//   const [deletingCategoryId, setDeletingCategoryId] = useState(null);
//   const [currentSize, setCurrentSize] = useState(10);

//   const {
//     data: banners,
//     isLoading,
//     isError,
//   } = useBannerQuery(
//     "GET_ALL_BANNER",
//     null,
//     pageCategory,
//     currentSize,
//   );
// console.log(banners);

//   // const { mutate: deleteCategory, isPending } = useCategoryMutation({
//   //   action: "DELETE",
//   //   onSuccess: () => {
//   //     setDeletingCategoryId(null);
//   //     messageApi.success("Xóa danh mục thành công.");
//   //   },
//   //   onError: (error) => {
//   //     setDeletingCategoryId(null);
//   //     messageApi.error(
//   //       "Xóa danh mục thất bại. " + error?.response.data.message
//   //     );
//   //   },
//   // });

//   const columns = [
//     {
//       title: "Ảnh sản phẩm",
//       dataIndex: "image",
//       key: "image",
//       width: "15%",
//       render: (image, product) => (
//         <img
//           className="w-24 h-24 object-cover"
//           src={image}
//           alt={product.title}
//         />
//       ),
//     },
//     {
//       title: "Tiêu đề",
//       dataIndex: "title",
//       key: "title",
//       rowScope: "row",
//     },
//     {
//       title: "Mô tả",
//       dataIndex: "description",
//       key: "description",
//       width: "20%",
//     },
//     {
//       title: "Mức ưu tiên",
//       dataIndex: "priority",
//       key: "priority",
//       width: "10%",
//     },
//     {
//       title: "Ngày bắt đầu",
//       dataIndex: "start_date",
//       key: "start_date",
//       width: "20%",
//     },
//     {
//       title: "Ngày kết thúc",
//       dataIndex: "end_date",
//       key: "end_date",
//       width: "20%",
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, banner) => (
//         <Space size="small">
//           <Button
//             disabled={deletingCategoryId === banner.id}
//             // onClick={() => handleModalUpdate(banner)}
//           >
//             <EditOutlined />
//           </Button>

//           <Popconfirm
//             title="Xóa danh mục"
//             description="Bạn có muốn xóa danh mục này không?"
//             okText={deletingCategoryId === banner.id ? `Đang xóa` : `Có`}
//             cancelText="Không"
//             onConfirm={() => {
//               // setDeletingCategoryId(banner.id);
//               // deleteCategory(banner);
//             }}
//           >
//             <Button
//               type="primary"
//               danger
//               loading={deletingCategoryId === banner.id}
//             >
//               <DeleteOutlined />
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const dataSource = (banners?.data || []).map((banner, index) => ({
//     key: banner.id,
//     index: index + 1,
//     ...banner,
//   }));

//   // const handleModalUpdate = (banner) => {
//   //   setSelectedCategory(banner);
//   //   setModalUpdateOpen(true);
//   // };

//   // if (isError) {
//   //   return <div>Error: {isError.message}</div>;
//   // }

//   return (
//     <>
//       {contextHolder}
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <Breadcrumb
//             items={[
//               {
//                 title: "Trang chủ",
//               },
//               {
//                 title: "Danh sách danh mục",
//               },
//             ]}
//           />
//           <h1 className="text-xl">Quản lý danh mục</h1>
//         </div>
//         {/* <Button type="primary" onClick={() => setModalCreateOpen(true)}>
//           <PlusCircleOutlined disabled={isPending} />
//           Thêm
//         </Button> */}
//       </div>

//       <Table
//         columns={columns}
//         dataSource={dataSource}
//         loading={isLoading}
//         pagination={false}
//       />

//       <Pagination
//         // disabled={isPending}
//         className="mt-5"
//         align="end"
//         showSizeChanger
//         current={pageCategory}
//         // total={banners?.data.total}
//         pageSize={currentSize}
//         onChange={(page) => setPageCategory(page)}
//         pageSizeOptions={["10", "20", "50"]}
//         onShowSizeChange={(_, size) => setCurrentSize(size)}
//       />

//       {/* <CreateCategory
//         open={modalCreateOpen}
//         onCancel={() => setModalCreateOpen(false)}
//       /> */}
//       {/* <UpdateCategory
//         open={modalUpdateOpen}
//         onCancel={() => setModalUpdateOpen(false)}
//         banner={selectedCategory}
//       /> */}
//     </>
//   );
// };

// export default Banner;
