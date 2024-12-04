import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, message, Pagination, Popconfirm, Space, Table } from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../components/base/Loading/Loading";
import useDisCountMutation from "../../../hooks/Discount/useDiscountMutation";
import useDiscountQuery from "../../../hooks/Discount/useDiscountQuery";
import { formatMoney } from "../../../systems/utils/formatMoney";

const DiscountDetail = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: products, isLoading } = useDiscountQuery(
    "GET_PRODUCTS_ON_DISCOUNT",
    id,
    page
  );

  const { mutate: deleteProduct, isPending } = useDisCountMutation({
    action: "DELETE_PRODUCT_OUT_DISCOUNT",
    onSuccess: () => {
      setDeleteProductId(null);
      messageApi.success("Xoá sản phẩm khỏi chiến dịch thành công.");
    },
    onError: (error) => {
      console.log(error);
      setDeleteProductId(null);
      messageApi.error(
        "Xoá sản phầm khỏi chiến dịch thất bại. " + error.response.data.message
      );
    },
  });

  const dataSource = (products?.data.data || []).map((product, index) => ({
    key: product.id,
    index: index + 1,
    ...product,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Ảnh",
      key: "image",
      width: "15%",
      render: (_, product) => <img src={product.thumbnail} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Giá sản phẩm",
      key: "regular_price",
      render: (_, product) => (
        <span>{`${formatMoney(product.regular_price)} đ`}</span>
      ),
    },
    // {
    //   title: "Giảm giá",
    //   dataIndex: "regular_price",
    //   key: "regular_price",
    // },
    {
      title: "Số lượng còn trong kho",
      dataIndex: "total_stock_quantity",
      key: "total_stock_quantity",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, product) => (
        <Space size="middle">
          <Popconfirm
            title="Xoá sản phẩm khỏi chiến dịch"
            description={"Bạn có muốn xoá sản phẩm khỏi chiến dịch không?"}
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              setDeleteProductId(product.id);
              const discount = { id: id, productId: product.id };
              deleteProduct(discount);
              // toggleStatusDiscount(discount);
            }}
          >
            <Button
              type="primary"
              danger
              loading={deleteProductId == product.id}
            >
              <DeleteOutlined />
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <Breadcrumb
            items={[
              {
                title: "Trang chủ",
              },
              {
                title: <a href="">Chi tiết chiến dịch</a>,
              },
            ]}
          />
          <h1 className="text-xl">Chi tiết chiến dịch giảm giá</h1>
        </div>
        <Link to={`addProduct`}>
          <Button type="primary" disabled={isPending}>
            <PlusCircleOutlined />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <Pagination
        current={page}
        disabled={isPending}
        className="mt-5"
        align="end"
        total={products?.data.total}
        pageSize={5}
        onChange={(page) => setPage(page)}
      />
    </>
  );
};

export default DiscountDetail;
