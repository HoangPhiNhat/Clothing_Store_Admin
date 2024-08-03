import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { Link } from "react-router-dom";
import { product_attributes, products } from "../../../data-example.js";

const ProductAttribute = () => {
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
    },
    {
      title: "Color",
      dataIndex: "color_id",
      key: "color_id",
      width: "15%",
    },
    {
      title: "Size",
      dataIndex: "size_id",
      key: "size_id",
      width: "15%",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: "15%",
      // sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      // sortDirections: ["descend", "ascend"],
      // defaultSortOrder: "descend", // This will sort by newest first by default
      // render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },

    {
      title: "Action",
      key: "operation",
      width: "10%",
      render: () => (
        <div className=" ">
          <Space size="small">
            <Button type="default" className="bg-[#fadd04]" >
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

  const dataSource = product_attributes.map((product, index) => ({
    ...product,
    key: product.id,
    index: index + 1,
  }));

  return (
    <>
      <h1 className="text-2xl font-medium mb-2">Product Attributes</h1>
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
