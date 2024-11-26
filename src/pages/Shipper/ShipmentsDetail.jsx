/* eslint-disable react/prop-types */
import { Modal, Table } from "antd";
import { formatMoney } from "../../systems/utils/formatMoney";

const ShipmentsDetail = ({ open, onCancel, orders }) => {
  const dataSource = (orders || []).map((order, index) => ({
    key: order.order_id,
    index: index + 1,
    ...order.order,
  }));

  const columns = [
    {
      title: "Mã đơn hàng",
      key: "order_code",
      dataIndex: "order_code",
      width: "5%",
    },
    {
      title: "Tổng số tiền",
      key: "total_amount",
      width: "5%",
      render: (_, order) => `${formatMoney(Number(order.total_amount))}đ`,
    },
    {
      title: "Địa chỉ giao hàng",
      key: "order_address",
      dataIndex: "order_address",
      width: "15%",
    },
    {
      title: "Lưu ý",
      key: "note",
      dataIndex: "note",
      width: "15%",
    },
  ];

  return (
    <Modal
      title="Danh sách đơn hàng"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
    >
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </Modal>
  );
};

export default ShipmentsDetail;
