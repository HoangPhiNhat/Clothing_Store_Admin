import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  Button,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/base/Loading/Loading";
import useOrderMutation from "../../hooks/Order/useOrderMutation";
import useOrderQuery from "../../hooks/Order/useOrderQuery";
import { formatMoney } from "../../systems/utils/formatMoney";

const Order = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageOrder, setPageOrder] = useState(1);

  const { mutate: confirmOrder, isPending: isPendingConfirm } =
    useOrderMutation({
      action: "CONFIRM",
      onSuccess: () => messageApi.success("Xác nhận đơn hàng thành công."),
      onError: (error) =>
        message.error(
          "Xác nhận đơn hàng thất bại. " + error.response.data.message
        ),
    });

  const { mutate: rejectOrder, isPending: isPendingReject } = useOrderMutation({
    action: "REJECT",
    onSuccess: () => messageApi.success("Từ chối đơn hàng thành công."),
    onError: (error) =>
      message.error(
        "Từ chối đơn hàng thất bại. " + error.response.data.message
      ),
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
      width: "10%",
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
      width: "15%",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      width: "15%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, order) => (
        <Space size="middle">
          <Link
            to={`${order.id}`}
            className="inline-flex items-center border-2 border-red-500 bg-white rounded-md p-2 hover:bg-gray-200 transition"
          >
            <EyeTwoTone />
          </Link>

          <Popconfirm
            title="Xác nhận đơn hàng"
            description="Bạn có muốn từ chối đơn hàng này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              // APi reject
              rejectOrder(order);
            }}
          >
            <Button type="primary" danger>
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
              confirmOrder(order);
            }}
          >
            <Button type="primary">
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

  return (
    <>
      {/* Page loading */}
      {isLoading || isPendingConfirm || (isPendingReject && <Loading />)}

      {/* Main content */}
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh sách đặt hàng</h1>
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
        total={orders?.data.total}
        pageSize={5}
        onChange={(page) => setPageOrder(page)}
      />
    </>
  );
};

export default Order;
