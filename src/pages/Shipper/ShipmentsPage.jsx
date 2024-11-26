import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table } from "antd";
import useShipperQuery from "../../hooks/Shipper/useShipperQuery";
import Loading from "../../components/base/Loading/Loading";
import useShippperMutation from "../../hooks/Shipper/useShipperMutation";
import { useState } from "react";
import ShipmentsDetail from "./ShipmentsDetail";

const ShipmentsPage = () => {
  const [idUpdateStatus, setIdUpdateStatus] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [modalGetOrderOpen, setModalGetOrderOpen] = useState(false);
  const [orders, setOrders] = useState();

  const { data: shipments, isLoading } = useShipperQuery("GET_ALL_SHIPMENT");
  const { mutate: updateStatusShipment } = useShippperMutation({
    action: "START_SHIPMENT",
    onSuccess: () => {
      messageApi.success("Bắt đầu lô hàng thành công.");
    },
    onError: (error) => {
      messageApi.error(
        "Bắt đầu lô hàng thất bại. " + error.response.data.message
      );
    },
  });

  const dataSource = (shipments?.data || []).map((shipment) => ({
    key: shipment.id,
    ...shipment,
  }));

  const columns = [
    {
      title: "Mã lô hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo lô hàng",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, shipment) => (
        <Space size="small">
          <Popconfirm
            title="Thay đổi trạng thái lô hàng"
            description="Bắt đầu giao hàng ?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              setIdUpdateStatus(shipment.id);
              updateStatusShipment(shipment.id);
            }}
          >
            <Button
              type="primary"
              danger
              loading={idUpdateStatus == shipment.id}
            >
              <CheckCircleOutlined />
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            onClick={() => {
              setModalGetOrderOpen(true);
              setOrders(shipment.shipment_details);
            }}
          >
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} />
      <ShipmentsDetail
        open={modalGetOrderOpen}
        onCancel={() => setModalGetOrderOpen()}
        orders={orders}
      />
    </>
  );
};

export default ShipmentsPage;
