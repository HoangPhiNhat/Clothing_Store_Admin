import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";

const ProductManagePage = () => {
  const expandedRowRender = () => {
    const columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Status",
        key: "state",
        render: () => <Badge status="success" text="Finished" />,
      },
      {
        title: "Upgrade Status",
        dataIndex: "upgradeNum",
        key: "upgradeNum",
      }
    ];
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={true} />;
  };
  const columns = [
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "operation",
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
          {/* <Dropdown
            menu={{
              items,
            }}
          >
            <a>
              More <DownOutlined />
            </a>
          </Dropdown> */}
        </Space>
      ),
    },
  ];
  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i.toString(),
      name: "Screen",
      category: "iOS",
      description: "10.3.4.5654",
      price: 500,
      creator: "Jack",
      createdAt: "2014-12-24 23:12:00",
    });
  }
  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={data}
      />
   
    </>
  );
};
export default ProductManagePage;
