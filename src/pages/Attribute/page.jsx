import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Pagination, Popconfirm, Space, Table } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../../../data-example.js";
import useAttributeQuery from "../../hooks/Attribute/useAttributeQuery.jsx";

const ProductAttribute = () => {
  const { id } = useParams();
  const { data: attributes, isLoading, error } = useAttributeQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      rowScope: "row",
      width: "5%",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (image) => (
        <>
          <img className="w-20" src={image} alt="" />
        </>
      ),
    },
    {
      title: "Color",
      dataIndex: "color_name",
      key: "color_name",
      width: "15%",
    },
    {
      title: "Size",
      dataIndex: "size_name",
      key: "size_name",
      width: "15%",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: "15%",
    },

    {
      title: "Action",
      key: "operation",
      width: "10%",
      render: () => (
        <div className=" ">
          <Space size="small">
            <Button type="default" className="bg-[#fadd04]">
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete attribute"
              description="Do you want to delete this attribute??"
              okText="Yes"
              cancelText="No"
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

  const dataSource = attributes.map((attribute, index) => ({
    ...attribute,
    key: index + 1,
    index: index + 1,
  }));

  return (
    <>
      <h1 className="text-2xl font-medium mb-2">Các thuộc tính của sản phẩm</h1>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Pagination
        className="mt-4"
        align="end"
        total={products.length}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
      />
    </>
  );
};

export default ProductAttribute;
