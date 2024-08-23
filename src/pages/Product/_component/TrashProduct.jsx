import {
  RedoOutlined,
  RollbackOutlined
} from "@ant-design/icons";
import {
  Button,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from "antd";
import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import useProductQuery from "../../../hooks/Product/useProductQuery";
import { formatDate, formatDMY } from "../../../systems/utils/formatDate";
import { formatMoney } from "../../../systems/utils/formatMoney";

const TrashProduct = () => {
  const [pageProduct, setPageProduct] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [restorProductId, setRestoringProductId] = useState(null);

  const { data: products, isLoading } = useProductQuery(
    "GET_ALL_PRODUCT_TRASH",
    null,
    pageProduct
  );
  const navigate = useNavigate();

  const { mutate: restoreProduct, isPending } = useProductMutation({
    action: "RESTORE",
    onSuccess: (data) => {
      messageApi.success(data.message);
      console.log("Restore attribute:", data);
    },
    onError: (error) =>
      message.error(
        "Khôi phục sản phẩm thất bại: " + error.response.data.message
      ),
  });

  useEffect(() => {
    if (pageProduct) {
      navigate(`?page=${pageProduct}`, { replace: true });
    }
  }, [pageProduct]);
  const dataSource = products?.data?.map((product, index) => ({
    ...product,
    key: product.id,
    index: index + 1,
  }));

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: "10%",
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: "20%",
      render: (thumbnail) => (
        <>
          <img className="w-24 h-24 object-cover" src={thumbnail} alt="" />
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (_, product) => (
        <Link
          to={`/admin/products/${product.id}/attributes`}
          className="text-slate-950 hover:underline"
        >
          {product.name}
        </Link>
      ),
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: "10%",
    },
    {
      title: "Regular price",
      dataIndex: "regular_price",
      key: "regular_price",
      width: "10%",
      render: (regular_price) => <div>{formatMoney(regular_price)}đ</div>,
    },
    {
      title: "Reduced price",
      dataIndex: "reduced_price",
      key: "reduced_price",
      width: "10%",
      render: (reduced_price) => <div>{formatMoney(reduced_price)}đ</div>,
    },
    {
      title: "Action",
      key: "operation",
      width: "10%",
      render: (_, product) => (
        <div className="">
          <Space size="small">
            <Popconfirm
              title="Khôi phục sản phẩm"
              description="Bạn có muốn khôi phục sản phẩm này không?"
              okText={
                isPending & (restorProductId === product.id) ? `Đang xóa` : `Có`
              }
              cancelText="Không"
              onConfirm={() => {
                restoreProduct(product.id);
                setRestoringProductId(product.id);
              }}
            >
              <Button
                loading={restorProductId === product.id}
                type="primary"
                danger
              >
                <RedoOutlined />
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const expandedColumns = [
      {
        title: "Material",
        dataIndex: "material",
        key: "material",
        width: "20%",
      },
      {
        title: "Description",
        dataIndex: "long_description",
        key: "long_description",
        width: "60%",
      },
      {
        title: "Create Date",
        dataIndex: "created_at",
        key: "created_at",
        width: "15%",
        render: (created_at) => (
          <div>{formatDate(created_at) + " " + formatDMY(created_at)}</div>
        ),
      },
      {
        title: "Update Date",
        dataIndex: "updated_at",
        key: "updated_at",
        width: "20%",
        render: (updated_at) => (
          <div>{formatDate(updated_at) + " " + formatDMY(updated_at)}</div>
        ),
      },
    ];

    const data = [
      {
        key: record.key,
        material: record.material,
        long_description: record.long_description,
        created_at: record.created_at,
        updated_at: record.updated_at,
      },
    ];

    return (
      <Table columns={expandedColumns} dataSource={data} pagination={false} />
    );
  };

  return (
    <>
      {contextHolder}
      <h1 className="text-2xl font-medium mb-2">Quản lý sản phẩm đã ẩn</h1>
      <div className="flex justify-between">
        <Input
          placeholder="Search by name or category"
          style={{ width: 300, marginBottom: 16 }}
        />
        <Link to="/admin/products">
          <Button type="primary" disabled={isPending}>
            <RollbackOutlined />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        disabled={isPending}
        current={pageProduct}
        onChange={(page) => {
          setPageProduct(page);
        }}
        total={products?.data.total}
        showSizeChanger={false}
        align="end"
      />
    </>
  );
};

export default TrashProduct;
