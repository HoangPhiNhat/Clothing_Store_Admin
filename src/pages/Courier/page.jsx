import {
  EyeOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Table, Tooltip } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/base/Loading/Loading";

import CreateCourier from "./_components/CreateCourier";
import useCourierQuery from "../../hooks/Courier/useCourierQuery";

const Courier = () => {
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const { data: couriers, isLoading } = useCourierQuery(
    "GET_ALL_COURIER",
    null,
    1
  );

  const dataSource = (couriers?.data.data || []).map((courier, index) => ({
    key: courier.id,
    index: index + 1,
    ...courier,
  }));

  const columns = [
    {
      title: "ID #",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hình đại diện",
      dataIndex: "avatar",
      align: "center",
      render: (_, couriers) =>
        couriers.user.avatar !== null ? (
          <img src={couriers.user.avatar} />
        ) : (
          <Avatar size={48} icon={<UserOutlined />} />
        ),
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      render: (_, couriers) => <span>{couriers.user.name}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      render: (_, couriers) => <span>{couriers.user.phone}</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (_, couriers) => <span>{couriers.user.address}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, couriers) => (
        <Tooltip title="Thông tin tài xế.">
          <Link to={`${couriers.id}`}>
            <Button>
              <EyeOutlined />
            </Button>
          </Link>
        </Tooltip>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Danh sách tài xế</a>,
          },
        ]}
      />
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Quản lý tài xế</h1>
        <Button type="primary" onClick={() => setModalCreateOpen(true)}>
          <PlusCircleOutlined />
          Thêm tài xế
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
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
