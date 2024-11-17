import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreateDiscount from "./_components/CreateDiscount";

const Discounts = () => {
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const dataSource = [
    {
      key: "1",
      discounts_code: "D123",
      name: "Mike",
      status: "Kích hoạt",
      date_start: "20/10/2024",
      date_end: "20/11/2024",
      created_name: "Admin",
      discount_value:"20%"
    },
  ];

  const columns = [
    {
      title: "Mã chiến dịch",
      dataIndex: "discounts_code",
      key: "discounts_code",
    },
    {
      title: "Tên chiến dịch",
      key: "name",
      render: (_, discounts) => <Link to={`1`}>{discounts.name}</Link>,
    },
    {
      title: "Người tạo",
      dataIndex: "created_name",
      key: "created_name",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount_value",
      key: "discount_value",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, discounts) =>
        discounts.status === "Kích hoạt" ? (
          <Tag color="#87d068">{discounts.status}</Tag>
        ) : (
          <Tag color="#f50">Tạm dừng</Tag>
        ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
      key: "date_start",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "date_end",
      key: "date_end",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: () => (
        <Space size="middle">
          <Popconfirm
            title="Tạm dừng chiến dịch"
            description="Bạn có muốn tạm dừng chiến dịch này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              // APi reject
              // setRejectOrderPending(order.id);
              // rejectOrder(order);
            }}
          >
            <Button
              type="primary"
              danger
              // loading={rejectOrderPending === order.id}
              // disabled={confirmOrderPending === order.id}
            >
              <CloseCircleOutlined />
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Kích hoạt chiến dịch"
            description="Bạn có muốn kích hoạt chiến dịch này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              // API Confirm
              // setConfirmOrderPending(order.id);
              // confirmOrder(order);
            }}
          >
            <Button
              type="primary"
              // disabled={rejectOrderPending === order.id}
              // loading={confirmOrderPending === order.id}
            >
              <CheckCircleOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý chiến dịch giảm giá</h1>
        <Button type="primary" onClick={() => setModalCreateOpen(true)}>
          <PlusCircleOutlined
          // disabled={isPending}
          />
          Tạo chiến dịch
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />

      <CreateDiscount
        open={modalCreateOpen}
        onCancel={() => setModalCreateOpen(false)}
      />
    </>
  );
};

export default Discounts;
