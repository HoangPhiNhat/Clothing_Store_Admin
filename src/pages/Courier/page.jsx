import { EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useState } from "react";
import CreateCourier from "./_components/CreateCourier";

const Courier = () => {
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const dataSource = [
    {
      key: 1,
      id: "#1",
      avatar: "image.jpg",
      name: "Quang Phuc",
      vehicleId: "NFQ 542",
      phoneNumber: "0123456789",
    },
  ];

  const columns = [
    {
      title: "ID #",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hình đại diện",
      dataIndex: "avatar",
      key: "avatar",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã phương tiện",
      dataIndex: "vehicleId",
      key: "vehicleId",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Hành động",
      key: "vehicleId",
      align: "center",
      render: () => (
        <Button>
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý tài xế</h1>
        <Button
          type="primary"
          onClick={() => setModalCreateOpen(true)}
        >
          <PlusCircleOutlined
          //  disabled={isPending}
          />
          Thêm
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        className="text-center"
        pagination={false}
      />
      {/* Pagination */}

      {/* Create courier */}
      <CreateCourier
        open={modalCreateOpen}
        onCancel={() => setModalCreateOpen(false)}
      />
    </>
  );
};

export default Courier;
