/* eslint-disable react/prop-types */
import { Button, message, Modal, Table } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../components/base/Loading/Loading";
import useOrderMutation from "../../../hooks/Order/useOrderMutation";
import useOrderQuery from "../../../hooks/Order/useOrderQuery";

const ChooseShipper = ({ open, onCancel, orderId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: shippers, isLoading } = useOrderQuery(
    "GET_ALL_SHIPPER_STATUS_ONLINE"
  );

  const [selectedShipperId, setSelectedShipperId] = useState(null);

  const { mutate: assignOrderForShipper, isPending } = useOrderMutation({
    action: "ASSIGN_ORDER_FOR_SHIPPER",
    onSuccess: () => {
      onCancel();
      message.success("Chọn tài xế cho đơn hàng thành công.");
    },
    onError: (error) => {
      console.log(error);
      message.error("Chọn tài xế cho đơn hàng thất bại.");
    },
  });

  const columns = [
    {
      title: "Tên tài xế",
      render: (_, shipper) => (
        <Link to={`/admin/couriers/${shipper.id}`}>{shipper.user.name}</Link>
      ),
      key: "name",
      width: "30%",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["user", "phone"],
      key: "phone",
      width: "30%",
    },
    {
      title: "Biển số xe",
      dataIndex: ["vehicle", "license_plate"],
      key: "license_plate",
      width: "40%",
    },
  ];

  const data = (shippers?.data || []).map((shipper) => ({
    key: shipper.id,
    ...shipper,
  }));

  if (isLoading) return <Loading />;

  const handleSubmit = () => {
    if (selectedShipperId) {
      const data = { shipperId: selectedShipperId, orderId: [orderId] };
      assignOrderForShipper(data);
    } else {
      messageApi.error("Vui lòng chọn tài xế.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Chọn tài xế"
        open={open}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel} disabled={isPending}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
          >
            Tạo đơn hàng cho tài xế
          </Button>,
        ]}
      >
        <Table
          rowSelection={{
            type: "radio",
            onChange: (selectedRowKeys) => {
              setSelectedShipperId(selectedRowKeys[0]);
            },
          }}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default ChooseShipper;
