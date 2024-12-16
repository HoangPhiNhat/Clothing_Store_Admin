/* eslint-disable no-unused-vars */
import {
  EyeFilled,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/base/Loading/Loading";
import useDiscountQuery from "../../hooks/Discount/useDiscountQuery";
import CreateDiscount from "./_components/CreateDiscount";
import useDisCountMutation from "../../hooks/Discount/useDiscountMutation";

const getDescription = (status) => {
  if (status === "pause") {
    return "Bạn có muốn tiếp tục chiến dịch này không?";
  }
  if (status === "active") {
    return "Bạn có muốn tạm dừng chiến dịch này không?";
  }
};

const Discounts = () => {
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [toggleStatus, setToggleStatus] = useState(null);

  const { data: discounts, isLoading } = useDiscountQuery(
    "GET_ALL_DISCOUNT",
    null,
    page
  );

  const { mutate: toggleStatusDiscount, isPending } = useDisCountMutation({
    action: "TOGGLE_STATUS",
    onSuccess: () => {
      setToggleStatus(null);
      messageApi.success("Thay đổi trạng thái chiến dịch thành công.");
    },
    onError: (error) => {
      messageApi.error(
        "Thay đổi trạng thái chiến dịch thất bại. " +
          error.response.data.message
      );
    },
  });

  const dataSource = (discounts?.data.data || []).map((discount, index) => ({
    key: discount.id,
    index: index + 1,
    ...discount,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên chiến dịch",
      key: "name",
      render: (_, discounts) => (
        <Link to={`${discounts.id}`}>{discounts.name}</Link>
      ),
    },
    // {
    //   title: "Người tạo",
    //   dataIndex: "created_name",
    //   key: "created_name",
    // },
    {
      title: "Giảm giá",
      dataIndex: "discount_percentage",
      key: "discount_percentage",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, discounts) => {
        switch (discounts.status) {
          case "pending":
            return <Tag color="purple">Chờ kích hoạt</Tag>;
          case "active":
            return <Tag color="green">Hoạt động</Tag>;
          case "pause":
            return <Tag color="gold">Tạm dừng</Tag>;
          case "complete":
            return <Tag color="red">Kết thúc</Tag>;
        }
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, discount) =>
        discount.status === "active" || discount.status === "pause" ? (
          <Space size="middle">
            <Popconfirm
              title="Tạm dừng chiến dịch"
              description={getDescription(discount.status)}
              okText="Có"
              cancelText="Không"
              onConfirm={() => {
                setToggleStatus(discount.id);
                toggleStatusDiscount(discount);
              }}
            >
              <Button
                type="primary"
                danger
                loading={toggleStatus == discount.id}
              >
                {discount.status === "active" && <PauseCircleOutlined />}
                {discount.status === "pause" && <PlayCircleOutlined />}
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Tooltip title="Chi tiết chiến dịch.">
            <Link to={`${discount.id}`}>
              <Button>
                <EyeFilled />
              </Button>
            </Link>
          </Tooltip>
        ),
    },
  ];

  if (isLoading) return <Loading />;

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
                title: <a href="">Danh sách chiến dịch</a>,
              },
            ]}
          />
          <h1 className="text-xl">Quản lý chiến dịch giảm giá</h1>
        </div>
        <Button
          type="primary"
          disabled={isPending}
          onClick={() => setModalCreateOpen(true)}
        >
          <PlusCircleOutlined />
          Tạo chiến dịch
        </Button>
      </div>
      <Table
        size="small"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Pagination
        current={page}
        disabled={isPending}
        className="mt-5"
        align="end"
        total={discounts?.data.total}
        pageSize={5}
        onChange={(page) => setPage(page)}
      />

      <CreateDiscount
        open={modalCreateOpen}
        onCancel={() => setModalCreateOpen(false)}
      />
    </>
  );
};

export default Discounts;
