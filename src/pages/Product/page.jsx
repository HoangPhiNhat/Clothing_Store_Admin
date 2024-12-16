import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
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
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/base/Loading/Loading";
import useDebounce from "../../hooks/customHook/useDebounce";
import useProductMutation from "../../hooks/Product/useProductMutation";
import useProductQuery from "../../hooks/Product/useProductQuery";
import { formatMoney } from "../../systems/utils/formatMoney";

const ProductManagePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageProduct, setPageProduct] = useState(1);
  const [currentSize, setCurrentSize] = useState(10);

  // Sorting and filter
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [searchKey, setSearhKey] = useState("");
  const debouncedSearchKey = useDebounce(searchKey, 1000);

  const { data: products, isLoading } = useProductQuery(
    "GET_ALL_PRODUCT",
    null,
    pageProduct,
    debouncedSearchKey,
    currentSize,
    sortField,
    sortOrder
  );
  console.log(products);

  const { mutate: deleteProduct } = useProductMutation({
    action: "DELETE",
    onSuccess: (data) => {
      setDeletingProductId(null);
      messageApi.success(data.message);
    },
    onError: (error) => {
      setDeletingProductId(null);
      message.error("Xóa sản phẩm thất bại: " + error.response.data.message);
    },
  });

  //Sort
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter) {
      setPageProduct(1);
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "ASC" : "DESC");
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };
  const dataSource = products?.data.data.map((product) => ({
    ...product,
    key: product.id,
  }));

  const columns = [
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
      rowScope: "row",
      sorter: true,
      width: "25%",
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
      render: (_, product) => (
        <span className="font-normal">{product.category.name}</span>
      ),
      dataIndex: "category_id",
      rowScope: "row",
      sorter: true,
      width: "15%",
    },
    {
      title: "Giá gốc",
      dataIndex: "regular_price",
      key: "regular_price",
      sorter: true,
      width: "15%",
      render: (regular_price) => <div>{formatMoney(regular_price)}đ</div>,
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "reduced_price",
      key: "reduced_price",
      width: "15%",
      sorter: true,
      render: (reduced_price) => <div>{formatMoney(reduced_price)}đ</div>,
    },
    {
      title: "Hành động",
      key: "operation",
      width: "10%",
      render: (_, product) => (
        <div className="">
          <Space size="small">
            <Link to={`${product.id}/edit`}>
              <Button
                disabled={deletingProductId === product.id}
                type="default"
                className="bg-[#fadd04] "
              >
                <EditOutlined />
              </Button>
            </Link>
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có muốn xóa sản phẩm này không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => {
                deleteProduct(product.id);
                setDeletingProductId(product.id);
              }}
            >
              <Button
                loading={deletingProductId === product.id}
                type="primary"
                danger
              >
                <DeleteOutlined />
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
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: "Danh sách sản phẩm",
          },
        ]}
      />
      <h1 className="text-2xl font-medium mb-2">Quản lý sản phẩm</h1>
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
        <Link to="add">
          <Button type="primary">
            <PlusCircleOutlined />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        size="small"
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        pagination={false}
        onChange={handleTableChange}
      />

      <Pagination
        className="mt-5"
        align="end"
        showSizeChanger
        current={pageProduct}
        total={products?.data.total}
        pageSize={currentSize}
        onChange={(page) => setPageProduct(page)}
        pageSizeOptions={["5", "10", "20", "50"]}
        onShowSizeChange={(_, size) => setCurrentSize(size)}
      />
    </>
  );
};

export default ProductManagePage;
