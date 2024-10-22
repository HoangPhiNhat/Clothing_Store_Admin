import { RedoOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Pagination, Popconfirm, Space, Table, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import Loading from "../../../components/base/Loading/Loading";

const TrashCategory = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pageCategory, setPageCategory] = useState(1);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const {
    data: categories,
    isLoading,
    isError,
  } = useCategoryQuery("GET_ALL_CATEGORY_TRASH", null, pageCategory);

  const { mutate: deleteCategory, isPending } = useCategoryMutation({
    action: "RESTORE",
    onSuccess: () => messageApi.success("Khôi phục danh mục thành công."),
    onError: (error) => message.error("Khôi phục danh mục thất bại. " + error),
  });

  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "category_code",
      rowScope: "row",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      width: "40%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (_, categories) => (categories.created_at),
      width: "20%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      render: (_, categories) => (categories.updated_at),
      width: "20%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, category) => (
        <Space size="small">
          <Popconfirm
            title="Khôi phục danh mục"
            description="Bạn có muốn khôi phục danh mục này không?"
            okText={isPending ? `Đang xóa` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              deleteCategory(category);
              setDeletingCategoryId(category.id);
            }}
          >
            <Button
              type="primary"
              danger
              loading={deletingCategoryId === category.id}
            >
              <RedoOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = (categories?.data.data || []).map((category, index) => ({
    key: category.id,
    index: index + 1,
    ...category,
  }));

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }
 if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh mục đã ẩn</h1>
        <Link to={"/admin/categories"}>
          <Button type="primary" disabled={isPending}>
            <RollbackOutlined />
            Danh mục
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        disabled={isPending}
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
