import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Spin, Table } from "antd";
import useOrderQuery from "../../hooks/Order/useOrderQuery";
import useOrderMutation from "../../hooks/Order/useOrderMutation";

const Order = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: confirmOrder, isPendingConfirm } = useOrderMutation({
    action: "CONFIRM",
    onSuccess: () => messageApi.success("Xác nhận đơn hàng thành công."),
    onError: (error) => message.error("Xác nhận đơn hàng thất bại. " + error.response.data.message),
  });

  const { mutate: rejectOrder, isPendingReject } = useOrderMutation({
    action: "REJECT",
    onSuccess: () => messageApi.success("Từ chối đơn hàng thành công."),
    onError: (error) => message.error("Từ chối đơn hàng thất bại. " + error.response.data.message),
  });

  const {
    data: orders,
    isLoading,
    isError,
  } = useOrderQuery("GET_ALL_ORDER", null, 1);

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
      render: (_, order) => `${order.total_amount}VND`,
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
        <Space size="small">
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
      {isLoading || isPendingConfirm || isPendingReject && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}

      {/* Main content */}
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý danh mục</h1>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={false}
      />
    </>
  );
};

export default Order;
