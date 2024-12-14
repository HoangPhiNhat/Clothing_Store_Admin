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
import useShipperQuery from "../../hooks/Shipper/useShipperQuery";
import { formatMoney } from "../../systems/utils/formatMoney";
import ShipperOrderDetail from "./ShipperOrderDetail";
import StatusOrderDelivery from "./_components/StatusOrderDelivery";

const ShipperOrderDelivery = () => {
  const [pageOrder, setPageOrder] = useState(1);
  const [modelOpenDetail, setModelOpenDetail] = useState(false);
  const [productDetails, setProductDetails] = useState();
  const [modelOpenStatus, setModelOpenStatus] = useState(false);
  const [statusDelivery, setSatusDelivery] = useState(null);
  const [deliveryId, setDeliveryId] = useState(null);

  const { data: orders, isLoading } = useShipperQuery(
    "GET_ALL_ORDER_SHIPPING",
    null,
    pageOrder
  );

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
                  setModelOpenStatus(true);
                  setSatusDelivery("fail");
                  setDeliveryId(order.id);
                }}
              >
                <Button type="primary" danger>
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
                  setModelOpenStatus(true);
                  setSatusDelivery("success");
                  setDeliveryId(order.id);
                }}
              >
                <Button type="primary">
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

      {/* Model */}
      <StatusOrderDelivery
        open={modelOpenStatus}
        onCancel={() => setModelOpenStatus(false)}
        status={statusDelivery}
        deliveryId={deliveryId}
      />
    </>
  );
};

export default ShipperOrderDelivery;
