import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Pagination,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useState } from "react";
import useCategoryMutation from "../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../hooks/Category/useCategoryQuery";
import CreateCategory from "./_components/CreateCategory";
import UpdateCategory from "./_components/UpdateCategory";

const Category = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pageCategory, setPageCategory] = useState(1);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [currentSize, setCurrentSize] = useState(10);

  // Sorting and filter
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const {
    data: categories,
    isLoading,
    isError,
  } = useCategoryQuery(
    "GET_ALL_CATEGORY",
    null,
    pageCategory,
    currentSize,
    sortField,
    sortOrder
  );

  const { mutate: deleteCategory, isPending } = useCategoryMutation({
    action: "DELETE",
    onSuccess: () => {
      setDeletingCategoryId(null);
      messageApi.success("Xóa danh mục thành công.");
    },
    onError: (error) => {
      setDeletingCategoryId(null);
      messageApi.error(
        "Xóa danh mục thất bại. " + error?.response.data.message
      );
    },
  });

  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "category_code",
      key: "category_code",
      rowScope: "row",
      sorter: true,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: "20%",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      width: "20%",
      sorter: true,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, category) => (
        <Space size="small">
          <Button
            disabled={deletingCategoryId === category.id}
            onClick={() => handleModalUpdate(category)}
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có muốn xóa danh mục này không?"
            okText={deletingCategoryId === category.id ? `Đang xóa` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              setDeletingCategoryId(category.id);
              deleteCategory(category);
            }}
          >
            <Button
              type="primary"
              danger
              loading={deletingCategoryId === category.id}
            >
              <DeleteOutlined />
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

  const handleModalUpdate = (category) => {
    setSelectedCategory(category);
    setModalUpdateOpen(true);
  };

  //Sort
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter) {
      setPageCategory(1);
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <div>
          <Breadcrumb
            items={[
              {
                title: "Trang chủ",
              },
              {
                title: "Danh sách danh mục",
              },
            ]}
          />
          <h1 className="text-xl">Quản lý danh mục</h1>
        </div>
        <Button type="primary" onClick={() => setModalCreateOpen(true)}>
          <PlusCircleOutlined disabled={isPending} />
          Thêm
        </Button>
      </div>

      <Table
        columns={columns}
        size="small"
        dataSource={dataSource}
        loading={isLoading}
        pagination={false}
        onChange={handleTableChange}
      />

      <Pagination
        disabled={isPending}
        className="mt-5"
        align="end"
        showSizeChanger
        current={pageCategory}
        total={categories?.data.total}
        pageSize={currentSize}
        onChange={(page) => setPageCategory(page)}
        pageSizeOptions={["10", "20", "50"]}
        onShowSizeChange={(_, size) => setCurrentSize(size)}
      />

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
