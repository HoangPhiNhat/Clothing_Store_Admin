/* eslint-disable react/prop-types */
import { Modal, Table, Tag } from "antd";
import Loading from "../../../components/base/Loading/Loading";
import useShipmentDetailQuery from "../../../hooks/ShipmentDetail/useShipmentDetailQuery";

const GetOrderForShipment = ({ open, onCancel, idShipment }) => {
  const { data: orders, isLoading } = useShipmentDetailQuery(
    "GET_SHIPMENT_BY_COURIER_ID",
    idShipment
  );

  // Chuẩn bị dữ liệu nguồn cho bảng
  const dataSource = (orders?.data || []).map((order, index) => ({
    key: order.id,
    index: index + 1,
    ...order,
  }));

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      render: (_, order) => order.order?.order_code || "N/A",
    },
    {
      title: "Trạng thái giao hàng",
      key: "orderStatus",
      render: (_, order) => {
        switch (order.order?.order_status) {
          case "Chờ lấy hàng":
            return <Tag color="magenta">Chờ lấy hàng</Tag>;
          case "Đang giao":
            return <Tag color="gold">Đang giao hàng</Tag>;
          case "Đã giao":
            return <Tag color="green">Đã giao hàng</Tag>;
          case "Trả hàng":
            return <Tag color="red">Trả hàng</Tag>;
          default:
            return <Tag color="purple">Không xác định</Tag>;
        }
      },
    },
    {
      title: "Tổng số tiền",
      key: "totalAmount",
      render: (_, order) =>
        order.order?.total_amount?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) || "0 VND",
    },
  ];

  // Hiển thị loading nếu đang tải dữ liệu
  if (isLoading) return <Loading />;

  // Hiển thị modal với bảng dữ liệu
  return (
    <Modal
      title="Danh sách đơn hàng"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </Modal>
  );
};

export default GetOrderForShipment;
