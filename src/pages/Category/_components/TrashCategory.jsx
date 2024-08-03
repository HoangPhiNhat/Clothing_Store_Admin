/* eslint-disable no-unused-vars */
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Pagination, Popconfirm, Space, Table, message } from "antd";
import { useState } from "react";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";

const TrashCategory = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageCategory, setPageCategory] = useState(1);

  const {
    data: categories,
    isLoading,
    isError,
  } = useCategoryQuery("GET_ALL_TRASH", null, pageCategory);

  const { mutate: deleteCategory } = useCategoryMutation({
    action: "DELETE",
    onSuccess: () => messageApi.success("Xóa danh mục thành công."),
    onError: (error) => message.error("Xóa danh mục thất bại. " + error),
  });

  console.log(categories.data);
  
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      rowScope: "row",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "60%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, category) => (
        <Space size="small">
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có muốn danh mục này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteCategory(category)}
          >
            <Button type="primary" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = categories?.data.map((category, index) => ({
    key: category.id,
    index: index + 1,
    ...category,
  }));

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh mục đã ẩn</h1>
        <Button type="primary">
          <PlusCircleOutlined />
          Thêm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={false}
      />

      <Pagination
        className="mt-5"
        align="end"
        defaultCurrent={1}
        total={categories?.data.total}
        pageSize={5}
        onChange={(page) => setPageCategory(page)}
      />
    </>
  );
};

export default TrashCategory;
