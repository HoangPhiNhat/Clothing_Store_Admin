import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tooltip,
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
  const [currentSize, setCurrentSize] = useState(10);
  const [rejectOrderPending, setRejectOrderPending] = useState(null);
  const [confirmOrderPending, setConfirmOrderPending] = useState(null);
  const [orderId, setOrderId] = useState([]);

  // Sorting and filter
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [search, setSearch] = useState(null);

  const setDefaultSorterFilter = () => {
    setSortField(null);
    setSortOrder(null);
    setSearch(null);
  };

  const setDefaultStatePending = () => {
    setConfirmOrderPending(null);
    setRejectOrderPending(null);
    setRejectOrderPending(null);
  };

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

  const { mutate: confirmListOrder, isPending: isPendingConfirmList } =
    useOrderMutation({
      action: "CONFIRM-LIST",
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

  const { mutate: rejectListOrder, isPending: isPendingRejectList } =
    useOrderMutation({
      action: "REJECT-LIST",
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
  } = useOrderQuery(
    "GET_ALL_ORDER",
    null,
    pageOrder,
    false,
    currentSize,
    sortField,
    sortOrder,
    search
  );

  //Sort
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter) {
      setPageOrder(1);
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      rowScope: "row",
      sorter: true,
      render: (_, orders) => (
        <Tooltip title="Xem chi tiết đơn hàng.">
          <Link to={`${orders.id}`}>{orders.order_code}</Link>
        </Tooltip>
      ),
      with: "5%",
    },
    {
      title: "Người đặt",
      dataIndex: "user_id",
      rowScope: "row",
      sorter: true,
      render: (_, orders) => orders.user.name,
      width: "15%",
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      rowScope: "row",
      sorter: true,
      render: (_, order) => (
        <div className="font-normal">{order.created_at}</div>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "order_status",
      rowScope: "row",
      sorter: true,
      render: (_, orders) => (
        <span
          className={
            orders.order_status === "Đã huỷ" ||
            orders.order_status === "Chưa nhận hàng"
              ? "text-white bg-red-500 px-2 py-1 rounded-md text-xs"
              : orders.order_status === "Chờ xác nhận"
              ? "text-white bg-yellow-400 px-2 py-1 rounded-md text-xs"
              : orders.order_status === "Trả hàng"
              ? "text-white bg-red-500 px-2 py-1 rounded-md text-xs"
              : "text-white bg-green-500 px-2 py-1 rounded-md text-xs"
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
      render: (_, order) => (
        <div className="font-normal">{order.payment_method}</div>
      ),
      rowScope: "row",
      sorter: true,
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "payment_status",
      rowScope: "row",
      sorter: true,
      width: "15%",
      render: (_, orders) => (
        <span
          className={
            orders.payment_status === "Thanh toán thất bại"
              ? "text-white bg-red-500 px-2 py-1 rounded-md text-xs"
              : orders.payment_status === "Chưa thanh toán"
              ? "text-white bg-yellow-400 px-2 py-1 rounded-md text-xs"
              : "text-white bg-green-500 px-2 py-1 rounded-md text-xs"
          }
        >
          {orders.payment_status}
        </span>
      ),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "total_amount",
      rowScope: "row",
      sorter: true,
      render: (_, order) => (
        <div className="font-normal">{formatMoney(order.total_amount)}đ</div>
      ),
      width: "10%",
    },

    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, order) => {
        if (
          order.order_status === "Chờ xác nhận" &&
          order.payment_status !== "Thanh toán thất bại"
        ) {
          return (
            <Space size="middle">
              <Tooltip title="Từ chối đơn hàng">
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
              </Tooltip>

              <Tooltip title="Xác nhận đơn hàng.">
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
              </Tooltip>
            </Space>
          );
        } else {
          return (
            <Tooltip title="Chi tiết đơn hàng">
              <Link to={`${order.id}`}>
                <Button>
                  <EyeOutlined />
                </Button>
              </Link>
            </Tooltip>
          );
        }
      },
    },
  ];

  const dataSource = (orders?.data.data || []).map((order, index) => ({
    key: order.id,
    index: index + 1,
    ...order,
  }));

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setOrderId(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.order_status !== "Chờ xác nhận" ||
        record.payment_status === "Thanh toán thất bại", // Điều kiện để disable checkbox
    }),
  };

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }
  if (isLoading) return <Loading />;

  return (
    <>
      {/* Breadcrumb */}
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Danh sách đơn hàng</a>,
          },
        ]}
      />

      {/* Title  */}
      <div className="flex items-center justify-between my-5">
        <h1 className="text-xl">Quản lý danh sách đơn hàng</h1>
      </div>

      <div className="flex justify-between">
        <div className="flex justify-between">
          <Input
            onPressEnter={(e) => {
              console.log(e.target.value);
              setSearch(e.target.value);
            }}
            onBlur={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn hàng"
            style={{ width: 300, marginBottom: 16 }}
          />
          <Button
            className="mx-2"
            type="primary"
            disabled={
              isPendingConfirm ||
              isPendingReject ||
              isPendingConfirmList ||
              isPendingRejectList
            }
            onClick={() => setDefaultSorterFilter()}
          >
            Xoá bộ lọc
          </Button>
        </div>

        <div>
          {orderId.length > 0 && (
            <Space>
              <Button
                type="primary"
                danger
                disabled={
                  isPendingConfirm || isPendingReject || isPendingRejectList
                }
                loading={isPendingRejectList}
                onClick={() => rejectListOrder(orderId)}
              >
                Từ chối đơn hàng
              </Button>
              <Button
                type="primary"
                disabled={
                  isPendingConfirm || isPendingReject || isPendingRejectList
                }
                loading={isPendingConfirmList}
                onClick={() => confirmListOrder(orderId)}
              >
                Xác nhận đơn hàng
              </Button>
            </Space>
          )}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        onChange={handleTableChange}
        size="small"
        rowSelection={{
          ...rowSelection,
        }}
      />

      {/* Pagination */}
      <Pagination
        disabled={isPendingConfirm || isPendingReject}
        className="mt-5"
        align="end"
        current={pageOrder}
        total={orders?.data.total}
        pageSize={currentSize}
        pageSizeOptions={["10", "20", "50"]}
        onShowSizeChange={(_, size) => setCurrentSize(size)}
        onChange={(page) => setPageOrder(page)}
      />
    </>
  );
};

export default Order;
