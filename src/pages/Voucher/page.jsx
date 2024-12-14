import {
  DeleteOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import { useState } from "react";
import useVoucherQuery from "../../hooks/Voucher/useVoucherQuery";
import { Link } from "react-router-dom";
import { formatMoney } from "../../systems/utils/formatMoney";
import CreateVoucher from "./_components/CreateVoucher";
import UpdateVoucher from "./_components/UpdateVoucher";
import useVoucherMutation from "../../hooks/Voucher/useVoucherMutation";

const Voucher = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  // const [pageCategory, setPageCategory] = useState(1);
  const [toggleVoucherId, setToggleVoucherId] = useState(null);
  // const [currentSize, setCurrentSize] = useState(10);

  // // Sorting and filter
  // const [sortField, setSortField] = useState(null);
  // const [sortOrder, setSortOrder] = useState(null);

  const {
    data: vouchers,
    isLoading,
    isError,
  } = useVoucherQuery("GET_ALL_VOUCHER", null);
  console.log(vouchers);

  const { mutate: toggleVoucher, isPending } = useVoucherMutation({
    action: "TOGGLE",
    onSuccess: () => {
      setToggleVoucherId(null);
      messageApi.success("Chuyển trạng thái phiếu thành công.");
    },
    onError: (error) => {
      setToggleVoucherId(null);
      messageApi.error(
        "Chuyển trạng thái phiếu thất bại. " + error?.response.data.message
      );
    },
  });

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "voucher_code",
      key: "voucher_code",
      sorter: true,
      width: "10%",
      render: (_, voucher) => (
        <div className="text-slate-950 hover:underline">
          {voucher.voucher_code}
        </div>
      ),
    },
    {
      title: "Tên phiếu",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "20%",
      render: (_, voucher) => (
        <Link
          to={`${voucher.id}/attributes`}
          className="text-slate-950 hover:underline"
        >
          {voucher.name}
        </Link>
      ),
    },
    {
      title: "Giá giảm",
      width: "10%",
      render: (_, voucher) => (
        <span className="font-normal">
          {formatMoney(voucher.discount_value)}{" "}
          {voucher.discount_type == "percentage" ? "%" : "Vnđ"}
        </span>
      ),
      dataIndex: "discount_value",
      sorter: true,
    },
    // {
    //   title: "Loại giảm",
    //   render: (_, voucher) => (
    //     <span className="font-normal">
    //       {voucher.discount_type == "percentage" ? "%" : "Vnđ"}
    //     </span>
    //   ),
    //   dataIndex: "discount_type",
    //
    //   sorter: true,
    // },
    {
      title: "Giá giảm tối đa",
      dataIndex: "max_discount",
      width: "12%",
      key: "max_discount",
      sorter: true,
      render: (_, voucher) =>
        voucher.discount_type === "percentage" ? (
          <div>{formatMoney(voucher.max_discount)} Vnđ</div>
        ) : (
          ""
        ),
    },
    {
      title: "Đơn tối thiếu",
      width: "12%",
      dataIndex: "min_order_value",
      key: "min_order_value",
      sorter: true,
      render: (voucher) => <div>{voucher}</div>,
    },
    {
      title: "Số phiếu",
      width: "12%",
      render: (_, voucher) => (
        <span className="font-normal ">{voucher.usage_limit}</span>
      ),
      dataIndex: "usage_limit",
      sorter: true,
    },
    {
      title: "Trạng thái",
      render: (_, voucher) =>
        voucher.status === "pending" ? (
          <Tag color="processing" className="font-medium">
            Chưa bắt đầu
          </Tag>
        ) : voucher.status === "active" ? (
          <Tag color="success" className="font-medium">
            Đang diễn ra
          </Tag>
        ) : voucher.status === "pause" ? (
          <Tag color="warning" className="font-medium">
            Tạm dừng
          </Tag>
        ) : (
          <Tag color="default" className="font-medium">
            Đã hết hạn
          </Tag>
        ),
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, voucher) => (
        <Space size="small">
          <Button
            disabled={toggleVoucherId === voucher.id}
            onClick={() => handleModalUpdate(voucher)}
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Chuyển trạng thái phiếu"
            description="Bạn có muốn trạng thái phiếu này không?"
            okText={toggleVoucherId === voucher.id ? `Đang chuyển` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              setToggleVoucherId(voucher.id);
              toggleVoucher(voucher.id);
            }}
          >
            {voucher.status === "active" ? (
              <Button
                type="primary"
                danger
                loading={toggleVoucherId === voucher.id}
              >
                <PauseCircleOutlined />
              </Button>
            ) : voucher.status === "pause" ? (
              <Button
                type="primary"
                danger
                loading={toggleVoucherId === voucher.id}
              >
                <PlayCircleOutlined />
              </Button>
            ) : (
              ""
            )}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const expandedColumns = [
      {
        title: "Ngày bắt đầu",
        dataIndex: "start_date",
        key: "start_date",
        width: "20%",
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "end_date",
        key: "end_date",
        width: "20%",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
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
        start_date: record.start_date,
        end_date: record.end_date,
        description: record.description,
        created_at: record.created_at,
        updated_at: record.updated_at,
      },
    ];

    return (
      <Table columns={expandedColumns} dataSource={data} pagination={false} />
    );
  };

  const dataSource = (vouchers?.data || []).map((category, index) => ({
    key: category.id,
    index: index + 1,
    ...category,
  }));

  const handleModalUpdate = (voucher) => {
    setSelectedVoucher(voucher);
    setModalUpdateOpen(true);
  };

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <div>
          <Breadcrumb
            items={[
              {
                title: "Trang chủ",
              },
              {
                title: "Danh sách phiếu",
              },
            ]}
          />
          <h1 className="text-xl">Quản lý phiếu</h1>
        </div>
        <Button type="primary" onClick={() => setModalCreateOpen(true)}>
          <PlusCircleOutlined disabled={isPending} />
          Thêm
        </Button>
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        // disabled={isPending}
        className="mt-5"
        align="end"
        showSizeChanger
        // current={pageCategory}
        total={vouchers?.data.total}
        // pageSize={currentSize}
        // onChange={(page) => setPageCategory(page)}
        // pageSizeOptions={["10", "20", "50"]}
        // onShowSizeChange={(_, size) => setCurrentSize(size)}
      />
      <CreateVoucher
        open={modalCreateOpen}
        onCancel={() => setModalCreateOpen(false)}
      />
      <UpdateVoucher
        open={modalUpdateOpen}
        onCancel={() => setModalUpdateOpen(false)}
        voucher={selectedVoucher}
      />
    </>
  );
};

export default Voucher;
