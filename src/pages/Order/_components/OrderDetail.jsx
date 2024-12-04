import { Breadcrumb, Pagination, Steps, Table } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
      render: (thumbnail, product) => (
        <img
          className="w-24 h-24 object-cover"
          src={thumbnail}
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

  const statusOrderConfirm = order?.data.order_status_histories[0];
  const statusDeliveryPending = order?.data.order_status_histories[1];
  const statusDelivery = order?.data.order_status_histories[2];
  const statusDeliveryCompletion = order?.data.order_status_histories[3];
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

  //Shipper detail
  const shipperDetail = order?.data.delivery_person;

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
        responsive
        current={current}
        status={status}
        items={[
          {
            title: "Chờ xác nhận",
            description: statusOrderConfirm
              ? `${statusOrderConfirm.status} ${statusOrderConfirm.created_at}`
              : "",
          },
          {
            title: "Chọn tài xế",
            disabled: current !== 1,
            onClick: () => {
              if (current === 1) {
                setModalCreateOpen(true);
              }
            },
            description: (
              <>
                {shipperDetail && (
                  <h4>
                    {shipperDetail.user.name} - {shipperDetail.user.phone}
                  </h4>
                )}
              </>
            ),
          },
          {
            title: "Chờ lấy hàng",
            description:
              statusDeliveryPending && statusDeliveryPending.created_at,
          },
          {
            title: "Đang giao hàng",
            description: statusDelivery ? statusDelivery.created_at : "",
          },
          {
            title: "Hoàn thành giao hàng",
            description:
              statusDeliveryCompletion &&
              `${statusDeliveryCompletion.status} - ${statusDeliveryCompletion.created_at}`,
          },
        ]}
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
