/* eslint-disable no-unsafe-optional-chaining */
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Space, Table } from "antd";
import { useState, useMemo } from "react";
import Loading from "../../components/base/Loading/Loading";
import useShippperMutation from "../../hooks/Shipper/useShipperMutation";
import useShipperQuery from "../../hooks/Shipper/useShipperQuery";
import { formatMoney } from "../../systems/utils/formatMoney";

const ShippingPage = () => {
  const [idDeleverySuccess, setidDeleverySuccess] = useState(null);
  const [idDeleveryFail, setidDeleveryFail] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: shippings, isLoading } = useShipperQuery(
    "GET_ALL_ORDER_SHIPPING"
  );

  const { mutate: deliverySucess, isPending: isPendingDeliverySucess } =
    useShippperMutation({
      action: "DELIVERY_SUCCESS",
      onSuccess: () => {
        setidDeleverySuccess(null);
        messageApi.success("Cập nhật trạng thái đã giao hàng thành công.");
      },
      onError: (error) => {
        setidDeleverySuccess(null);
        messageApi.error(
          "Cập nhật trạng thái đã giao hàng thất bại. " +
            error.response.data.message
        );
        console.log(error);
      },
    });

  const { mutate: deliveryFail, isPending: isPendingDeliveryFail } =
    useShippperMutation({
      action: "DELIVERY_FAIL",
      onSuccess: () => {
        setidDeleveryFail(null);
        messageApi.success("Cập nhật trạng thái trả hàng thành công.");
      },
      onError: (error) => {
        setidDeleveryFail(null);
        messageApi.error(
          "Cập nhật trạng thái trả hàng thất bại. " +
            error.response.data.message
        );
        console.log(error);
      },
    });

  const { mutate: updateStatusShipment } = useShippperMutation({
    action: "END_SHIPMENT",
    onSuccess: () => {
      messageApi.success("Kết thúc lô hàng thành công.");
    },
    onError: (error) => {
      messageApi.error(
        "Kết thúc lô hàng thất bại. " + error.response.data.message
      );
    },
  });

  const dataSource = useMemo(
    () =>
      (shippings?.data[0] ? shippings?.data[0].shipment_details : [] || []).map((shipping, index) => ({
        key: index,
        ...shipping.order,
      })),
    [shippings]
  );

  const hasPendingOrders = useMemo(
    () => dataSource.some((item) => item.order_status === "Đang giao"),
    [dataSource]
  );

  const columns = [
    {
      title: "Mã đơn hàng",
      key: "order_code",
      dataIndex: "order_code",
    },
    {
      title: "Trạng thái đơn hàng",
      key: "order_status",
      dataIndex: "order_status",
    },
    {
      title: "Tổng số tiền",
      key: "total_amount",
      render: (_, shipping) => `${formatMoney(shipping.total_amount)}đ`,
    },
    {
      title: "Tên người nhận",
      dataIndex: ["user", "name"],
      key: "user_name",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["user", "phone"],
      key: "user_phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: ["user", "address"],
      key: "user_address",
    },
    {
      title: "Hành động",
      key: "name",
      align: "center",
      render: (_, shipping) => (
        <Space size="small">
          <Popconfirm
            title="Thay đổi trạng thái đơn hàng"
            description="Trả hàng ?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              setidDeleveryFail(shipping.id);
              deliveryFail(shipping.id);
            }}
          >
            <Button
              type="primary"
              danger
              loading={idDeleveryFail === shipping.id}
              disabled={isPendingDeliverySucess}
            >
              <CloseCircleOutlined />
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Thay đổi trạng thái đơn hàng"
            description="Giao hàng thành công ?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              setidDeleverySuccess(shipping.id);
              deliverySucess(shipping.id);
            }}
          >
            <Button
              type="primary"
              disabled={isPendingDeliveryFail}
              loading={idDeleverySuccess === shipping.id}
            >
              <CheckCircleOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <div className="flex mt-5 justify-center">
        <Button
          type="primary"
          onClick={() => updateStatusShipment(shippings?.data[0].shipment_id)}
          disabled={hasPendingOrders}
        >
          Hoàn thành lô hàng
        </Button>
      </div>
    </>
  );
};

export default ShippingPage;
