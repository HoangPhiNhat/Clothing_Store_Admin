/* eslint-disable react/prop-types */
import { Button, Form, message, Modal, Table } from "antd";
import { useState } from "react";
import useShipmentMutation from "../../../hooks/Shipment/useShipmentMutation";
import useOrderQuery from "../../../hooks/Order/useOrderQuery";
import Loading from "../../../components/base/Loading/Loading";

const CreateOrderForShipper = ({ open, onCancel, id }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [ordersId, setOrdersId] = useState({});

  const { data: orders, isLoading } = useOrderQuery("GET_ORDER_FOR_SHIPPER");

  const { mutate: createOrderForShipper, isPending } = useShipmentMutation({
    action: "CREATE",
    onSuccess: () => {
      onCancel();
      messageApi.success("Thêm đơn hàng cho tài xế thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi thêm đơn hàng: ${error.response.data.message}`);
      console.log(error);
    },
  });

  //Table
  const columns = [
    {
      title: "Mã đơn hàng",
      key: "name",
      render: (_, order) => <span>{order.order_code}</span>,
    },
    {
      title: "Tổng số tiền",
      key: "age",
      render: (_, order) => <span>{order.total_amount}</span>,
    },
    {
      title: "Address",
      key: "address",
      render: () => <span>address</span>,
    },
  ];

  const data = orders?.data.map((order, index) => ({
    key: order.id,
    index: index + 1,
    ...order,
  }));

  //Order
  const rowSelection = {
    ordersId,
    onChange: (selectedKeys) => {
      setOrdersId(selectedKeys);
    },
  };

  const onFinish = () => {
    let orders = [];
    for (let orderId of ordersId) {
      orders.push({ order_id: Number(orderId) });
    }
    createOrderForShipper({ delivery_person_id: Number(id), orders: orders });
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm đơn hàng cho tài xế"
        open={open}
        onCancel={isPending ? null : onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => onFinish()}
            loading={isPending}
          >
            {isPending ? "Đang thêm..." : "Thêm đơn hàng"}
          </Button>,
        ]}
      >
        <Form
          disabled={isPending}
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Table select order */}
          <Form.Item name="ordersId">
            <Table
              rowSelection={{
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateOrderForShipper;
