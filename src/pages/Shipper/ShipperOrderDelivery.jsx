import {
  CheckCircleOutlined,
  EyeOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useState } from "react";
import Loading from "../../components/base/Loading/Loading";
import useShippperMutation from "../../hooks/Shipper/useShipperMutation";
import useShipperQuery from "../../hooks/Shipper/useShipperQuery";
import { formatMoney } from "../../systems/utils/formatMoney";
import ShipperOrderDetail from "./ShipperOrderDetail";

const ShipperOrderDelivery = () => {
  const [pageOrder, setPageOrder] = useState(1);
  const [deliverySuccessId, setDeliverySuccessId] = useState(null);
  const [deliveryFailId, setDeliveryFailId] = useState(null);
  const [modelOpenDetail, setModelOpenDetail] = useState(false);
  const [productDetails, setProductDetails] = useState();

  const { data: orders, isLoading } = useShipperQuery(
    "GET_ALL_ORDER_SHIPPING",
    null,
    pageOrder
  );

  const { mutate: deliverySuccess, isPending: isPendingDeliverySuccess } =
    useShippperMutation({
      action: "DELIVERY_SUCCESS",
      onSuccess: () => {
        console.log("Success");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: deliveryFail, isPending: isPendingDeliveryFail } =
    useShippperMutation({
      action: "DELIVERY_FAIL",
      onSuccess: () => {
        console.log("Fail");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const dataSource = (orders?.data.data || []).map((order) => ({
    key: order.id,
    ...order,
  }));

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      key: "order_code",
    },
    {
      title: "Tổng số tiền",
      render: (_, order) => `${formatMoney(order.total_amount)} đ`,
      key: "total_amount",
    },
    {
      title: "Tiền ship",
      render: (_, order) => `${formatMoney(order.delivery_fee)} đ`,
      key: "delivery_fee",
    },
    {
      title: "Tên người nhận",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["user", "phone"],
      key: "phone",
    },
    {
      title: "Địa chỉ nhận hàng",
      dataIndex: "order_address",
      key: "address",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, order) =>
        order.order_status === "Đang giao" ? (
          <Space size="middle">
            <Tooltip title="Trả hàng">
              <Popconfirm
                title="Xác nhận đơn hàng"
                description="Bạn có muốn trả đơn hàng này không?"
                okText="Có"
                cancelText="Không"
                onConfirm={() => {
                  setDeliveryFailId(order.id);
                  deliveryFail(order.id);
                }}
              >
                <Button
                  type="primary"
                  danger
                  loading={deliveryFailId === order.id}
                  disabled={deliverySuccessId === order.id}
                >
                  <UndoOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>

            <Tooltip title="Hoàn thành.">
              <Popconfirm
                title="Xác nhận đơn hàng"
                description="Bạn có muốn hoàn thành đơn hàng này không?"
                okText="Có"
                cancelText="Không"
                onConfirm={() => {
                  setDeliverySuccessId(order.id);
                  deliverySuccess(order.id);
                }}
              >
                <Button
                  type="primary"
                  disabled={deliveryFailId === order.id}
                  loading={deliverySuccessId === order.id}
                >
                  <CheckCircleOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>

            <Tooltip title="Chi tiết đơn hàng.">
              <Button
                onClick={() => {
                  setModelOpenDetail(true);
                  setProductDetails(order.order_details);
                }}
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <Tooltip title="Chi tiết đơn hàng.">
            <Button
              onClick={() => {
                setModelOpenDetail(true);
                setProductDetails(order.order_details);
              }}
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
        ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Danh sách đơn hàng đang giao</a>,
          },
        ]}
      />

      {/* Title  */}
      <div className="flex items-center justify-between my-5">
        <h1 className="text-xl">Danh sách đơn hàng đang giao</h1>
      </div>

      {/* Table */}

      <Table dataSource={dataSource} columns={columns} pagination={false} />
      {/* Pagination */}
      <Pagination
        disabled={isPendingDeliverySuccess || isPendingDeliveryFail}
        className="mt-5"
        align="end"
        current={pageOrder}
        total={orders?.data.total}
        pageSize={5}
        onChange={(page) => setPageOrder(page)}
      />

      {/* Detail */}
      {modelOpenDetail && (
        <ShipperOrderDetail
          open={modelOpenDetail}
          onCancel={() => setModelOpenDetail(false)}
          products={productDetails}
        />
      )}
    </>
  );
};

export default ShipperOrderDelivery;
