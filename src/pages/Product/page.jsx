import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProductQuery from "../../hooks/Product/useProductQuery";
import { formatDate, formatDMY } from "../../systems/utils/formatDate";
import { formatMoney } from "../../systems/utils/formatMoney";

const ProductManagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: products,
    isLoading,
    error: productsError,
  } = useProductQuery(null, currentPage);
  // const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  // const filterOption = (input, item) =>
  //   item.name.toLowerCase().includes(input.toLowerCase()) ||
  //   item.category.name.toLowerCase().includes(input.toLowerCase());
  // const filteredData = products?.data?.filter((product) =>
  //   filterOption(searchText, product)
  // );
  // useEffect(() => {
  //   if (currentPage) {
  //     navigate(`?page=${currentPage}`, { replace: true });
  //   }
  // }, [currentPage]);

  const dataSource = products?.data?.map((product, index) => ({
    ...product,
    key: product.id,
    index: product.id,
  }));
console.log(products);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    // Add your delete logic here
    console.log("Deleting product with id:", id);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: "5%",
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: "15%",
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
      width: "25%",
      render: (name) => (
        <Link to={"detail"} className="text-slate-950 hover:underline">
          {name}
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
      title: "Create Date",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      render: (created_at) => (
        <div>{formatDate(created_at) + " " + formatDMY(created_at)}</div>
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "10%",
      render: (_, product) => (
        <div className=" ">
          <Space size="small">
            <Link to={`edit/${product.id}`}>
              <Button type="default" className="bg-[#fadd04] ">
                <EditOutlined />
              </Button>
            </Link>
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có muốn xóa sản phẩm này không?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(product.id)}
            >
              <Button type="primary" danger>
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
        updated_at: record.updated_at,
      },
    ];

    return (
      <Table columns={expandedColumns} dataSource={data} pagination={false} />
    );
  };

  return (
    <>
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
        current={currentPage}
        onChange={handlePageChange}
        total={products?.total}
        showSizeChanger={false}
        align="end"
      />
    </>
  );
};

export default ProductManagePage;
