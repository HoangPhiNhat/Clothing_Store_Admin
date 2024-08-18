import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
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
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductQuery from "../../hooks/Product/useProductQuery";
import { formatDate, formatDMY } from "../../systems/utils/formatDate";
import { formatMoney } from "../../systems/utils/formatMoney";
import useProductMutation from "../../hooks/Product/useProductMutation";

const ProductManagePage = () => {
  const [pageProduct, setPageProduct] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const [deletingProductId, setDeletingProductId] = useState(null);

  const { data: products, isLoading } = useProductQuery(
    "GET_ALL_PRODUCT",
    null,
    pageProduct
  );
  const navigate = useNavigate();

  const { mutate: deleteProduct, isPending } = useProductMutation({
    action: "DELETE",
    onSuccess: (data) => {
      messageApi.success(data.message);
      console.log("Deleted attribute:", data);
    },
    onError: (error) =>
      message.error("Xóa sản phẩm thất bại: " + error.response.data.message),
  });
  // const [searchText, setSearchText] = useState("");

  // const filterOption = (input, item) =>
  //   item.name.toLowerCase().includes(input.toLowerCase()) ||
  //   item.category.name.toLowerCase().includes(input.toLowerCase());
  // const filteredData = products?.data?.`filter((product) =>
  //   filterOption(searchText, product)
  // );

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
          <img className="w-20" src={thumbnail} alt="" />
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
          to={`${product.id}/attributes`}
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
              okText="Yes"
              cancelText="No"
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
      <h1 className="text-2xl font-medium mb-2">List Product</h1>
      <div className="flex justify-between">
        <Input
          placeholder="Search by name or category"
          // value={searchText}
          // onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />
        <Link to="add">
          <Button type="primary">
            <PlusCircleOutlined />
            Add Product
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

export default ProductManagePage;
