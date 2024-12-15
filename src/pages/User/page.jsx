import {
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useState } from "react";
import useUserQuery from "../../hooks/User/useUserQuery";
import useUserMutation from "../../hooks/User/useUserMutation";

const User = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pageCategory, setPageCategory] = useState(1);
  const [toggleUserId, setToggleUserId] = useState(null);
  const [currentSize, setCurrentSize] = useState(10);

  const {
    data: users,
    isLoading,
    isError,
  } = useUserQuery("GET_ALL_USER", null, pageCategory, currentSize);
  console.log(users?.data);

  const { mutate: toggleStatusUser, isPending } = useUserMutation({
    action: "TOGGLE",
    onSuccess: (success) => {
      console.log(success);

      setToggleUserId(null);
      messageApi.success("Chuyển trạng thái thành công.");
    },
    onError: (error) => {
      setToggleUserId(null);
      messageApi.error(
        "Xóa danh mục thất bại. " + error?.response.data.message
      );
    },
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "name",
      width: "20%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_blocked",
      key: "is_blocked",
      width: "10%",
      render: (_, user) =>
        user.is_blocked === false ? (
          <Tag color="success" className="font-medium">
            Hoạt động
          </Tag>
        ) : (
          <Tag color="error" className="font-medium">
            Đã chặn
          </Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: "20%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      width: "20%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, user) => (
        <Space size="small">
          <Popconfirm
            title={
              user.is_blocked === false ? "Chặn tài khoản" : "Bỏ chặn tài khoản"
            }
            description={
              user.is_blocked === false
                ? "Bạn có chắc chặn tài khoản này không?"
                : "Bạn có chắc bỏ chặn tài khoản này không?"
            }
            okText={toggleUserId === user.id ? `Đang xóa` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              setToggleUserId(user.id);
              toggleStatusUser(user.id);
            }}
          >
            {user.is_blocked === false ? (
              <Button type="primary" danger loading={toggleUserId === user.id}>
                <LockOutlined />
              </Button>
            ) : (
              <Button type="primary" loading={toggleUserId === user.id}>
                <UnlockOutlined />
              </Button>
            )}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = (users?.data.data || []).map((user, index) => ({
    key: user.id,
    index: index + 1,
    ...user,
  }));

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
                title: "Danh sách tài khoản",
              },
            ]}
          />
          <h1 className="text-xl">Quản lý tài khoản</h1>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={false}
      />

      <Pagination
        disabled={isPending}
        className="mt-5"
        align="end"
        showSizeChanger
        current={pageCategory}
        total={users?.data.total}
        pageSize={currentSize}
        onChange={(page) => setPageCategory(page)}
        pageSizeOptions={["10", "20", "50"]}
        onShowSizeChange={(_, size) => setCurrentSize(size)}
      />
    </>
  );
};

export default User;
