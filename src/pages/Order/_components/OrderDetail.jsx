import { Pagination, Table } from "antd";
import { useParams } from "react-router-dom";
import useOrderQuery from "../../../hooks/Order/useOrderQuery";
import { formatMoney } from "../../../systems/utils/formatMoney";
import { useState } from "react";
import Loading from "../../../components/base/Loading/Loading";

const OrderDetail = () => {
  const { id } = useParams();
  const [pageProduct, setPageProduct] = useState(0);

  const {
    data: order,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
  } = useOrderQuery("GET_ORDER_BY_ID", id, null, false);

  const {
    data: products,
    isLoading: isLoadingProduct,
    isError: isErrorProducts,
  } = useOrderQuery("GET_PRODUCTS_FOR_ORDER_ID", id, pageProduct, true);

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
        <img className="w-24 h-24 object-cover" src={thumbnail} alt={product.name} />
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
      width: "10%",
      render: (unit_price) => <div>{formatMoney(unit_price)}đ</div>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
    },
    {
      title: "Thành tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (total_amount) => <div>{formatMoney(total_amount)}đ</div>,
      width: "15%",
    },
  ];

  if (isErrorOrder) return <h1>Error order</h1>;
  if (isErrorProducts) return <h1>Error products</h1>;
  if (isLoadingOrder) return <Loading />;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold">Chi tiết đơn hàng</h1>
        </div>
        <div>
          <h3>Mã đơn hàng: {order?.data.order_code}</h3>
          <h3>Tên khách hàng: {order?.data.user.name} </h3>
          {order?.data.user.phone ? (
            <h3>Số điện thoại: {order?.data.user.phone}</h3>
          ) : (
            <h3>Email: {order?.data.user.email}</h3>
          )}
          <h3>Địa chỉ: {order?.data.order_address}</h3>
          <h3>
            <span>
              Tổng số tiền : {formatMoney(order?.data.total_amount)} đ
            </span>{" "}
            - <span>Phương thức thanh toán: {order?.data.payment_method} </span>
          </h3>
          <h3>Trạng thái đơn hàng: {order?.data.order_status}</h3>
          <h3>Trạng thái thanh toán: {order?.data.payment_status}</h3>
        </div>
        <div className="flex items-center justify-between mb-5 mt-5">
          <h1 className="text-base font-medium">Danh sách sản phẩm</h1>
        </div>
      </div>

      <Table
        loading={isLoadingProduct}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />

      {/* pagging */}

      <Pagination
        // disabled={isPending}
        className="mt-5"
        align="end"
        defaultCurrent={1}
        total={products?.data.total}
        pageSize={5}
        onChange={(page) => setPageProduct(page)}
      />
    </>
  );
};

export default OrderDetail;
