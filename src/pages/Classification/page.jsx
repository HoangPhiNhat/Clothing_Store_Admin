// import {
//   DeleteOutlined,
//   EditOutlined,
//   PlusCircleOutlined,
// } from "@ant-design/icons";

// import { Button, message, Pagination, Popconfirm, Space, Table } from "antd";
// import { useState } from "react";
// import { useParams } from "react-router-dom";

// import useClassificationMutation from "../../hooks/Classification/useClassificationMutation";
// import useClassificationQuery from "../../hooks/Classification/useClassificationQuery";
// import CreateClassification from "./_components/CreateClassification";
// import UpdateClassification from "./_components/UpdateClassification";
// import Loading from "../../components/base/Loading/Loading";

// const Classification = () => {
//   const { id } = useParams();
//   const [messageApi, contextHolder] = message.useMessage();
//   const [modalCreateOpen, setModalCreateOpen] = useState(false);
//   const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [pageCategory, setPageCategory] = useState(1);
//   const [deletingCategoryId, setDeletingCategoryId] = useState(null);

//   const { data: classification, isLoading } = useClassificationQuery(
//     "GET_CLASSIFICATION_BY_ID",
//     id,
//     pageCategory
//   );

//   const { mutate: deleteCategory, isPending } = useClassificationMutation({
//     action: "DELETE",
//     onSuccess: () => {
//       setDeletingCategoryId(null);
//       messageApi.success("Xóa danh mục phân loại thành công.");
//     },
//     onError: (error) => {
//       selectedCategory(null);
//       message.error("Xóa danh mục phân loại thất bại. " + error);
//     },
//   });

//   const handleModalUpdate = (category) => {
//     setSelectedCategory(category);
//     setModalUpdateOpen(true);
//   };

//   const columns = [
//     {
//       title: "Mã danh mục",
//       dataIndex: "category_code",
//     },
//     {
//       title: "Tên danh mục",
//       dataIndex: "name",
//       onFilter: (value, record) => record.name.indexOf(value) === 0,
//       sorter: (a, b) => a.name.localeCompare(b.name),
//       sortDirections: ["ascend", "descend"],
//       width: "40%",
//     },
//     {
//       title: "Ngày tạo",
//       dataIndex: "created_at",
//       render: (_, categories) => categories.created_at,
//       sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
//       sortDirections: ["ascend", "descend"],
//       width: "20%",
//     },
//     {
//       title: "Ngày cập nhật",
//       dataIndex: "updated_at",
//       render: (_, categories) => categories.updated_at,
//       sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
//       sortDirections: ["ascend", "descend"],
//       width: "20%",
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, category) => (
//         <Space size="small">
//           <Button
//             disabled={deletingCategoryId === category.id}
//             onClick={() => handleModalUpdate(category)}
//           >
//             <EditOutlined />
//           </Button>

//           <Popconfirm
//             title="Xóa danh mục"
//             description="Bạn có muốn xóa danh mục này không?"
//             okText={deletingCategoryId === category.id ? `Đang xóa` : `Có`}
//             cancelText="Không"
//             onConfirm={() => {
//               setDeletingCategoryId(category.id);
//               deleteCategory(category);
//               console.log();
//             }}
//           >
//             <Button
//               type="primary"
//               danger
//               loading={deletingCategoryId === category.id}
//             >
//               <DeleteOutlined />
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const dataSource = (classification?.data || []).map((category, index) => ({
//     key: category.id,
//     index: index + 1,
//     ...category,
//   }));

//   if (isLoading) return <Loading />;

//   return (
//     <>
//       {contextHolder}
//       <div className="flex items-center justify-between mb-5">
//         <h1 className="text-xl">Quản lý danh mục phân loại</h1>
//         <Button type="primary" onClick={() => setModalCreateOpen(true)}>
//           <PlusCircleOutlined disabled={isPending} />
//           Thêm
//         </Button>
//       </div>
//       <Table columns={columns} dataSource={dataSource} pagination={false} />
//       <Pagination
//         disabled={isPending}
//         current={pageCategory}
//         className="mt-5"
//         align="end"
//         total={classification.total}
//         pageSize={5}
//         onChange={(page) => setPageCategory(page)}
//       />
//       <CreateClassification
//         id={id}
//         open={modalCreateOpen}
//         onCancel={() => setModalCreateOpen(false)}
//       />
//       <UpdateClassification
//         open={modalUpdateOpen}
//         onCancel={() => setModalUpdateOpen(false)}
//         category={selectedCategory}
//       />
//     </>
//   );
// };

// export default Classification;
