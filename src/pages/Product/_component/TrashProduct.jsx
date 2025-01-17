import { RedoOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatMoney } from "../../../systems/utils/formatMoney";
import Loading from "../../../components/base/Loading/Loading";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import useProductQuery from "../../../hooks/Product/useProductQuery";
import useDebounce from "../../../hooks/customHook/useDebounce";

const TrashProduct = () => {
  const [pageProduct, setPageProduct] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [restorProductId, setRestoringProductId] = useState(null);
  const navigate = useNavigate();
  const [searchKey, setSearhKey] = useState("");
  const debouncedSearchKey = useDebounce(searchKey, 1000);
  const { data: products, isLoading } = useProductQuery(
    "GET_ALL_PRODUCT_TRASH",
    null,
    pageProduct,
    debouncedSearchKey
  );

  const { mutate: restoreProduct, isPending } = useProductMutation({
    action: "RESTORE",
    onSuccess: (data) => {
      console.log(data.id);

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
      title: "Mã sản phẩm",
      dataIndex: "sku",
      key: "sku",
      width: "10%",
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: "15%",
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
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (_, product) => (
        <Link
          to={`${product.id}/attributes`}
          className="text-slate-950 hover:underline"
        >
          {product.name}
        </Link>
      ),
    },
    {
      title: "Danh mục",
      key: "Category",
      render: ({ category }) => <span>{category.name}</span>,
      width: "15%",
    },
    {
      title: "Giá gốc",
      dataIndex: "regular_price",
      key: "regular_price",
      width: "10%",
      render: (regular_price) => <div>{formatMoney(regular_price)}đ</div>,
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "reduced_price",
      key: "reduced_price",
      width: "10%",
      render: (reduced_price) => <div>{formatMoney(reduced_price)}đ</div>,
    },
    {
      title: "Hành động",
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
        title: "Chất liệu",
        dataIndex: "material",
        key: "material",
        width: "20%",
      },
      {
        title: "Mô tả",
        dataIndex: "long_description",
        key: "long_description",
        width: "40%",
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        key: "created_at",
        width: "20%",
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updated_at",
        key: "updated_at",
        width: "20%",
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

  if (isLoading) return <Loading />;

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Danh sách sản phẩm ẩn</a>,
          },
        ]}
      />
      <h1 className="text-2xl font-medium mb-2">Quản lý sản phẩm đã ẩn</h1>
      {contextHolder}
      <div className="flex justify-between">
        <Input
          placeholder="Tìm kiếm theo tên và danh mục"
          style={{ width: 300, marginBottom: 16 }}
          value={searchKey}
          onChange={(e) => {
            setSearhKey(e.target.value);
            setPageProduct(1);
          }}
        />
        <Link to="/admin/products">
          <Button type="primary" disabled={isPending}>
            <RollbackOutlined />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        defaultCurrent={1}
        current={pageProduct}
        onChange={(page) => {
          setPageProduct(page);
        }}
        total={products?.total}
        showSizeChanger={false}
        align="end"
      />
    </>
  );
};

export default TrashProduct;
