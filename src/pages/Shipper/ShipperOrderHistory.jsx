import { Breadcrumb, Button, Pagination, Table, Tag, Tooltip } from "antd";
import { useState } from "react";
import Loading from "../../components/base/Loading/Loading";
import useShipperQuery from "../../hooks/Shipper/useShipperQuery";
import { formatMoney } from "../../systems/utils/formatMoney";
import { EyeOutlined } from "@ant-design/icons";
import ShipperOrderDetail from "./ShipperOrderDetail";

const ShipperOrderHistory = () => {
  const [pageOrder, setPageOrder] = useState(1);
  const [modelOpenDetail, setModelOpenDetail] = useState(false);
  const [productDetails, setProductDetails] = useState();

  const { data: orders, isLoading } = useShipperQuery(
    "GET_ALL_ORDER_HISTORY",
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
      title: "Trạng thái đơn hàng",
      key: "order_status",
      render: (_, order) =>
        order.order_status == "Đã giao" ? (
          <Tag color="#87d068">Giao hàng thành công</Tag>
        ) : (
          <Tag color="#f50">Trả hàng</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, order) => (
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
            title: <a href="">Lịch sử giao hàng</a>,
          },
        ]}
      />

      {/* Title  */}
      <div className="flex items-center justify-between my-5">
        <h1 className="text-xl">Lịch sử giao hàng</h1>
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
    </>
  );
};

export default ShipperOrderHistory;
