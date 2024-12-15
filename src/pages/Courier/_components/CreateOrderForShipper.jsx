/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Form, message, Modal, Table } from "antd";
import { createStyles } from "antd-style";

import { useState } from "react";
import { Link } from "react-router-dom";

import useShipmentMutation from "../../../hooks/Shipment/useShipmentMutation";
import useOrderQuery from "../../../hooks/Order/useOrderQuery";
import Loading from "../../../components/base/Loading/Loading";
import { formatMoney } from "../../../systems/utils/formatMoney";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const CreateOrderForShipper = ({ open, onCancel, id }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [ordersId, setOrdersId] = useState({});
  const { styles } = useStyle();

  const { data: orders, isLoading } = useOrderQuery("GET_ORDER_FOR_SHIPPER");

  const { mutate: createOrderForShipper, isPending } = useShipmentMutation({
    action: "CREATE",
    onSuccess: () => {
      onCancel();
      message.success("Thêm đơn hàng cho tài xế thành công");
    },
    onError: (error) => {
      message.error(`Lỗi khi thêm đơn hàng: ${error.response.data.message}`);
      console.log(error);
    },
  });

  //Table
  const columns = [
    {
      title: "Mã đơn hàng",
      key: "name",
      render: (_, order) => (
        <Link to={`/admin/orders/${order.id}`}>{order.order_code}</Link>
      ),
      width: "20%",
    },
    {
      title: "Tổng số tiền",
      key: "age",
      render: (_, order) => `${formatMoney(order.total_amount)}đ`,
      width: "20%",
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "order_address",
      width: "60%",
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
    createOrderForShipper({
      delivery_person_id: Number(id),
      order_id: ordersId,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <Modal
        width="100%"
        title="Thêm đơn hàng cho tài xế"
        open={open}
        onCancel={isPending ? null : onCancel}
        className="max-w-4xl w-full"
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
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Table select order */}
          <Form.Item
            name="ordersId"
            style={{
              margin: 0,
            }}
          >
            <Table
              className={styles.customTable}
              rowSelection={{
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                x: "max-content",
                y: 55 * 5,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateOrderForShipper;
