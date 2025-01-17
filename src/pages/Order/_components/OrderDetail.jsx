import { Breadcrumb, Pagination, Steps, Table, Tag } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../components/base/Loading/Loading";
import useOrderQuery from "../../../hooks/Order/useOrderQuery";
import { formatMoney } from "../../../systems/utils/formatMoney";
import ChooseShipper from "./ChooseShipper";

const OrderDetail = () => {
  const { id } = useParams();
  const [pageProduct, setPageProduct] = useState(0);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const { data: order, isLoading: isLoadingOrder } = useOrderQuery(
    "GET_ORDER_BY_ID",
    id,
    null,
    false
  );

  //Shipper detail
  const shipperDetail = order?.data.delivery_person;

  const { data: products, isLoading: isLoadingProduct } = useOrderQuery(
    "GET_PRODUCTS_FOR_ORDER_ID",
    id,
    pageProduct,
    true
  );

  const dataSource = products?.data.data?.map((product) => ({
    ...product,
    key: product.id,
  }));

  const columns = [
    {
      title: "Ảnh sản phẩm",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: "20%",
      render: (_, product) => (
        <img
          className="w-24 h-24 object-cover"
          src={product.thumbnail}
          alt={product.name}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "name",
      width: "20%",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: "10%",
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
      width: "10%",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "unit_price",
      key: "unit_price",
      width: "15%",
      render: (unit_price) => <div>{formatMoney(unit_price)}đ</div>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      align: "center",
    },
    {
      title: "Thành tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      render: (total_amount) => <div>{formatMoney(total_amount)}đ</div>,
      width: "15%",
    },
  ];

  if (isLoadingOrder) return <Loading />;

  const statusOrderConfirm = order?.data.order_status_histories[1];
  const statusDeliveryPending = order?.data.order_status_histories[2];
  const statusDelivery = order?.data.order_status_histories[3];
  const statusDeliveryCompletion = order?.data.order_status_histories[4];
  const userConfirm = order?.data.order_status_histories[5];
  let current = 0;
  let status = "process";

  //Status steps
  if (statusOrderConfirm) {
    if (statusOrderConfirm.status == "Đã xác nhận") {
      current = 1;
    } else {
      status = "error";
    }
  }

  if (statusDeliveryPending && status != "error") {
    status = "process";
    current = 2;
  }

  if (statusDelivery && status != "error") {
    status = "process";
    current = 3;
  }

  if (statusDeliveryCompletion && status != "error") {
    if (statusDeliveryCompletion.status == "Đã giao") {
      current = 4;
      status = "finish";
    } else {
      current = 4;
      status = "error";
    }
  }

  if (userConfirm && status != "error") {
    if (userConfirm.status == "Đã nhận hàng") {
      current = 5;
      status = "finish";
    } else {
      current = 5;
      status = "error";
    }
  }

  const steps = [
    {
      title: statusOrderConfirm?.status || "Chờ xác nhận",
      description: statusOrderConfirm
        ? `${statusOrderConfirm.created_at} ${
            statusOrderConfirm.status === "Đã Huỷ"
              ? `- ${statusOrderConfirm.note}`
              : ""
          }`
        : "",
    },
    {
      title: "Chọn tài xế",
      disabled: current !== 1,
      onClick: () => current === 1 && setModalCreateOpen(true),
      description: shipperDetail ? (
        <Link to={`/admin/couriers/${shipperDetail.id}`}>
          <h4>
            {shipperDetail.user.name} - {shipperDetail.user.phone}
          </h4>
        </Link>
      ) : null,
    },
    {
      title: statusDelivery ? "Đã lấy hàng" : "Chờ lấy hàng",
      description: statusDeliveryPending?.created_at || "",
    },
    {
      title: statusDelivery ? "Đang giao hàng" : "Giao hàng",
      description: statusDelivery?.created_at || "",
    },
    {
      title: statusDeliveryCompletion?.status || "Trạng thái giao hàng",
      description: statusDeliveryCompletion && (
        <>
          {statusDeliveryCompletion.created_at}{" "}
          {statusDeliveryCompletion.status === "Trả hàng" ? (
            statusDeliveryCompletion.note
          ) : (
            <img
              className="h-16 w-16"
              src={statusDeliveryCompletion.image}
              alt={statusDeliveryCompletion.status}
            />
          )}
        </>
      ),
    },
    {
      title: userConfirm?.status || "Người dùng xác nhận",
      description: userConfirm?.created_at || "",
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-5"
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="/admin/orders">Danh sách đơn hàng</a>,
          },
          {
            title: order?.data.order_code,
          },
        ]}
      />

      {/* Step */}
      <Steps
        size="small"
        responsive
        current={current}
        status={status}
        items={steps}
      />

      {/* Info */}
      <div className="mt-5">
        <div>
          <h1 className="text-xl font-semibold">Thông tin người nhận hàng</h1>
          <h3>Tên khách hàng: {order?.data.user.name} </h3>
          {order?.data.user.phone ? (
            <h3>Số điện thoại: {order?.data.user.phone}</h3>
          ) : (
            <h3>Email: {order?.data.user.email}</h3>
          )}
          <h3>Địa chỉ: {order?.data.order_address}</h3>
          <h3>Phương thức thanh toán: {order?.data.payment_method}</h3>
          <h3>
            Trạng thái thanh toán:{" "}
            {order?.data.payment_status === "Thanh toán thất bại" ? (
              <Tag color="#f50">{order?.data.payment_status}</Tag>
            ) : order?.data.payment_status === "Chưa thanh toán" ? (
              <Tag color="gold">{order?.data.payment_status}</Tag>
            ) : (
              <Tag color="#87d068">{order?.data.payment_status}</Tag>
            )}
          </h3>
        </div>
      </div>

      {/* List product */}
      <div>
        <div className="flex items-center justify-between mb-5 mt-5">
          <h1 className="text-xl font-semibold">Danh sách sản phẩm</h1>
        </div>
        <Table
          loading={isLoadingProduct}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          footer={() => (
            <h3 className="text-end text-lg">
              Tổng số tiền : {formatMoney(order?.data.total_amount)} đ
            </h3>
          )}
        />
      </div>

      {/* Pagging */}
      <Pagination
        className="mt-5"
        align="end"
        defaultCurrent={1}
        total={products?.data.total}
        pageSize={5}
        onChange={(page) => setPageProduct(page)}
      />

      {/* Choose shipper */}
      {modalCreateOpen && (
        <ChooseShipper
          open={modalCreateOpen}
          onCancel={() => setModalCreateOpen(false)}
          orderId={id}
        />
      )}
    </>
  );
};

export default OrderDetail;
