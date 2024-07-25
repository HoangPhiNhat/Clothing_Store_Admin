import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Table, message } from "antd";
import React, { useState } from "react";
import useCategoryMutation from "../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../hooks/Category/useCategoryQuery";
import CreateCategory from "./_components/CreateCategory"; // Ensure this is the correct path
import UpdateCategory from "./_components/UpdateCategory";

const Category = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();
  const { data: categories, isLoading, error } = useCategoryQuery();

  const { mutate: deleteCategory } = useCategoryMutation({
    action: "DELETE",
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      messageApi.success("Xóa danh mục thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi xóa danh mục: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      rowScope: "row",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Name",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "60%",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "20%",

      render: (image) => (
        <>
          <img className="w-16" src={image} alt="" />
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, category) => (
        <Space size="middle">
          <Button onClick={() => hanldeModalUpdate(category)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có muốn danh mục này không?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteCategory(category._id)}
          >
            <Button type="primary" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = categories?.map((item, index) => ({
    key: item._id,
    index: index + 1,
    ...item,
  }));

  const hanldeModalUpdate = (category) => {
    setSelectedCategory(category);
    setModalUpdateOpen(true);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // Handle table change events if needed
  };

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh mục</h1>
        <Button type="primary" onClick={() => setModalCreateOpen(true)}>
          <PlusCircleOutlined />
          Thêm
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} onChange={onChange} />
      <CreateCategory
        open={modalCreateOpen}
        onCancel={() => setModalCreateOpen(false)}
      />
      <UpdateCategory
        open={modalUpdateOpen}
        onCancel={() => setModalUpdateOpen(false)}
        category={selectedCategory}
      />
    </>
  );
};

export default Category;
