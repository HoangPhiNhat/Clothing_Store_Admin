import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, message, Pagination, Popconfirm, Space, Table } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/base/Loading/Loading";
import useOrderMutation from "../../hooks/Order/useOrderMutation";
import useOrderQuery from "../../hooks/Order/useOrderQuery";
import { formatMoney } from "../../systems/utils/formatMoney";

const Order = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageOrder, setPageOrder] = useState(1);
  const [rejectOrderPending, setRejectOrderPending] = useState(null);
  const [confirmOrderPending, setConfirmOrderPending] = useState(null);

  const { mutate: confirmOrder, isPending: isPendingConfirm } =
    useOrderMutation({
      action: "CONFIRM",
      onSuccess: () => {
        messageApi.success("Xác nhận đơn hàng thành công.");
        setDefaultStatePending();
      },
      onError: (error) => {
        message.error(
          "Xác nhận đơn hàng thất bại. " + error.response.data.message
        );
        setDefaultStatePending();
      },
    });

  const setDefaultStatePending = () => {
    setConfirmOrderPending(null);
    setRejectOrderPending(null);
  };

  const { mutate: rejectOrder, isPending: isPendingReject } = useOrderMutation({
    action: "REJECT",
    onSuccess: () => {
      messageApi.success("Từ chối đơn hàng thành công.");
      setDefaultStatePending();
    },
    onError: (error) => {
      setDefaultStatePending();
      message.error(
        "Từ chối đơn hàng thất bại. " + error.response.data.message
      );
    },
  });

  const {
    data: orders,
    isLoading,
    isError,
  } = useOrderQuery("GET_ALL_ORDER", null, pageOrder, false);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      render: (_, orders) => (
        <Link to={`${orders.id}`}>{orders.order_code}</Link>
      ),
      with: "5%",
    },
    {
      title: "Người đặt",
      render: (_, orders) => orders.user.name,
      width: "10%",
    },
    {
      title: "Trạng thái đặt hàng",
      dataIndex: "order_status",
      render: (_, orders) => (
        <span
          className={
            orders.order_status === "Đã huỷ"
              ? "text-white bg-red-500 px-2 py-1 rounded-md"
              : orders.order_status === "Chờ xác nhận"
              ? "text-white bg-yellow-400 px-2 py-1 rounded-md"
              : "text-white bg-green-500 px-2 py-1 rounded-md"
          }
        >
          {orders.order_status}
        </span>
      ),
      width: "15%",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment_method",
      width: "10%",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "payment_status",
      width: "10%",
    },
    {
      title: "Tổng số tiền",
      render: (_, order) => `${formatMoney(order.total_amount)}đ`,
      width: "10%",
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      width: "10%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      width: "10%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, order) => (
        <Space size="middle">
          <Popconfirm
            title="Xác nhận đơn hàng"
            description="Bạn có muốn từ chối đơn hàng này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              // APi reject
              setRejectOrderPending(order.id);
              rejectOrder(order);
            }}
          >
            <Button
              type="primary"
              danger
              loading={rejectOrderPending === order.id}
              disabled={confirmOrderPending === order.id}
            >
              <CloseCircleOutlined />
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Xác nhận đơn hàng"
            description="Bạn có muốn xác nhận đơn hàng này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              // API Confirm
              setConfirmOrderPending(order.id);
              confirmOrder(order);
            }}
          >
            <Button
              type="primary"
              disabled={rejectOrderPending === order.id}
              loading={confirmOrderPending === order.id}
            >
              <CheckCircleOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = (orders?.data.data || []).map((order, index) => ({
    key: order.id,
    index: index + 1,
    ...order,
  }));

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }
  if (isLoading) return <Loading />;

  return (
    <>
      {/* Main content */}
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh sách đặt hàng</h1>
      </div>

      <Table columns={columns} dataSource={dataSource} pagination={false} />

      <Pagination
        disabled={isPendingConfirm || isPendingReject}
        className="mt-5"
        align="end"
        defaultCurrent={1}
        total={orders?.data.total}
        pageSize={5}
        onChange={(page) => setPageOrder(page)}
      />
    </>
  );
};

export default Order;
