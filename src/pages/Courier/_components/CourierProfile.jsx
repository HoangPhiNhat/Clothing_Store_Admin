import {
  CheckOutlined,
  EditOutlined,
  LockOutlined,
  PlusCircleOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  message,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loading from "../../../components/base/Loading/Loading";
import useCourierMutation from "../../../hooks/Courier/useCourierMutation";
import useCourierQuery from "../../../hooks/Courier/useCourierQuery";
import useShipmentQuery from "../../../hooks/Shipment/useShipmentQuery";
import CreateOrderForShipper from "./CreateOrderForShipper";
import { formatMoney } from "../../../systems/utils/formatMoney";

const CourierProfile = () => {
  const [editable, setEditable] = useState(false); // Trạng thái Edit
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const [statusCourier, setStatusCourier] = useState();
  const [pageShipment, setPageShipment] = useState(1);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  // Fetch dữ liệu tài xế
  const { data: courier, isLoading } = useCourierQuery(
    "GET_COURIER_BY_ID",
    id,
    null
  );

  // Mapping dữ liệu vào Form khi dữ liệu thay đổi
  useEffect(() => {
    if (courier && courier.data) {
      // Kiểm tra dữ liệu và gán giá trị cho form
      const { user, vehicle } = courier.data;
      const initialValues = {
        personal: {
          name: user?.name || "",
          phone_number: user?.phone || "",
          email: user?.email || "",
          address: user?.address || "",
        },
        vehicle: {
          vehicle_name: vehicle?.vehicle_name || "",
          license_plate: vehicle?.license_plate || "",
        },
      };
      setStatusCourier(user.is_blocked);
      form.setFieldsValue(initialValues);
    }
  }, [courier, form]);

  // Hàm xử lý cập nhật thông tin
  const { mutate: updateCourier, isPending } = useCourierMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật thông tin tài xế thành công.");
      setEditable(false);
    },
    onError: (error) => {
      messageApi.error(
        `Cập nhật thông tin tài xế thất bại. ${error.response.data.message}`
      );
    },
  });

  const onFinish = (values) => {
    updateCourier({ id, ...values });
  };

  //Block account shipper
  const { mutate: toggleAccoutCourier, isPending: isPendingBlockAccount } =
    useCourierMutation({
      action: "TOGGLE_ACCOUNT_COURIER",
      onSuccess: () => {
        if (statusCourier) {
          messageApi.success("Mở khoá tài khoản thành công.");
        } else {
          messageApi.success("Khoá tài khoản thành công.");
        }
      },
      onError: (error) => {
        if (statusCourier) {
          messageApi.error(
            "Mở khoá tài khoản thất bại. ",
            error.response.data.message
          );
        } else {
          messageApi.error(
            "Khoá tài khoản thất bại. ",
            error.response.data.message
          );
        }
      },
    });

  // Style cho Input khi không ở chế độ Edit
  const inputStyle = editable
    ? {}
    : { border: "none", backgroundColor: "transparent", pointerEvents: "none" };

  // Data shipment-detail
  const { data: shipmentDetails, isLoading: isLoadingShipment } =
    useShipmentQuery("GET_SHIPMENT_BY_COURIER_ID", id, pageShipment);

  const dataSource = (shipmentDetails?.data.data || []).map(
    (shipmentDetail, index) => ({
      key: shipmentDetail.id,
      index: index + 1,
      ...shipmentDetail,
    })
  );

  const columns = [
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      render: (_, order) => (
        <Link to={`/admin/orders/${order.id}`}>{order.order_code}</Link>
      ),
    },
    {
      title: "Trạng thái giao hàng",
      key: "status",
      align: "center",
      render: (_, shipment) => {
        switch (shipment.order_status) {
          case "Chờ xác nhận":
            return <Tag color="warning">Chờ xác nhận</Tag>;
          case "Đã xác nhận":
            return <Tag color="success">Đã xác nhận</Tag>;
          case "Chờ lấy hàng":
            return <Tag color="blue">Chờ lấy hàng</Tag>;
          case "Đang giao":
            return <Tag color="blue">Đang giao hàng</Tag>;
          case "Đã giao":
            return <Tag color="success">Đã giao hàng</Tag>;
          case "Trả hàng":
            return <Tag color="red">Trả hàng</Tag>;
          case "Đã huỷ":
            return <Tag color="red">Đã huỷ bởi admin</Tag>;
        }
      },
    },
    {
      title: "Ngày mua",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Tổng số tiền",
      key: "total_amount",
      render: (_, shipment) => `${formatMoney(shipment.total_amount)} đ`,
    },
  ];

  if (isLoading || isLoadingShipment) return <Loading />;

  return (
    <>
      {contextHolder}
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="/admin/couriers">Danh sách tài xế</a>,
          },
          {
            title: <a>{id}</a>,
          },
        ]}
      />
      <div className="p-4 bg-gray-100 h-screen">
        <div className="grid grid-cols-10 gap-4 h-full">
          {/* Profile */}
          <Form
            form={form}
            onFinish={onFinish}
            disabled={isPending || isPendingBlockAccount}
            className="col-span-3 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
          >
            <div className="relative">
              <Avatar
                size={120}
                src={courier?.data?.user.avatar || null}
                className="mb-4"
              ></Avatar>
            </div>

            <div className="mt-6 w-full">
              <Row gutter={24}>
                <Col span={8}>
                  <label>Trạng thái</label>
                </Col>
                <Col span={16}>
                  <Tag
                    color={
                      courier?.data?.status === "online"
                        ? "green"
                        : courier?.data.status === "offline"
                        ? "red"
                        : "blue"
                    }
                    className="text-center"
                  >
                    {courier?.data.status === "online"
                      ? "Hoạt động"
                      : courier?.data.status === "offline"
                      ? "Không hoạt động"
                      : "Đang giao hàng"}
                  </Tag>
                </Col>
              </Row>

              {/* Personal Information Fields */}
              <Row gutter={24}>
                <Col span={8} className="flex items-center">
                  <label>Tên tài xế</label>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={["personal", "name"]}
                    className="mt-5"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên tài xế!" },
                    ]}
                  >
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8} className="flex items-center">
                  <label>Số điện thoại</label>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={["personal", "phone_number"]}
                    className="mt-5"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                    ]}
                  >
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8} className="flex items-center">
                  <label>Email</label>
                </Col>
                <Col span={16}>
                  <Form.Item name={["personal", "email"]}>
                    <Input disabled style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8} className="flex items-center">
                  <label>Địa chỉ</label>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={["personal", "address"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ!" },
                    ]}
                  >
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Vehicle Information Fields */}
              <Row gutter={24}>
                <Col span={8} className="flex items-center">
                  <label>Phương tiện</label>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={["vehicle", "vehicle_name"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên phương tiện!",
                      },
                    ]}
                  >
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8} className="flex items-center">
                  <label>Biển số xe</label>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name={["vehicle", "license_plate"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập biển số xe!" },
                    ]}
                  >
                    <Input style={inputStyle} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="flex justify-between items-center mt-6 w-full">
              <Popconfirm
                title="Thay đổi trạng thái tài khoản"
                description={
                  statusCourier
                    ? "Bạn có mở khoá này không?"
                    : "Bạn có khoá này không?"
                }
                okText={
                  isPendingBlockAccount
                    ? statusCourier
                      ? `Đang mở khoá`
                      : `Đang khoá`
                    : `Có`
                }
                cancelText="Không"
                onConfirm={() => {
                  console.log(courier?.data.user_id);
                  toggleAccoutCourier(courier?.data.user_id);
                }}
              >
                <Button
                  disabled={isPending}
                  icon={statusCourier ? <UnlockOutlined /> : <LockOutlined />}
                  type="primary"
                  danger={!statusCourier}
                >
                  {statusCourier ? "Mở khoá tài khoản" : "Khoá tài khoản"}
                </Button>
              </Popconfirm>

              <Button
                loading={isPending}
                icon={editable ? <CheckOutlined /> : <EditOutlined />}
                type="default"
                disabled={isPendingBlockAccount}
                onClick={() => {
                  if (editable) form.submit();
                  setEditable(!editable);
                }}
              >
                {editable ? "Lưu" : "Cập nhật"}
              </Button>
            </div>
          </Form>

          {/* List order */}
          <div className="col-span-7 bg-white rounded-lg shadow-lg p-6">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold mb-4">
                  Danh sách đơn hàng
                </h2>
                <Button type="primary" onClick={() => setModalCreateOpen(true)}>
                  <PlusCircleOutlined />
                  Tạo đơn hàng cho tài xế
                </Button>
              </div>
            </div>
            <div>
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />

              <Pagination
                disabled={isPending || isPendingBlockAccount}
                className="mt-5"
                align="end"
                total={shipmentDetails?.data.total}
                pageSize={5}
                current={pageShipment}
                onChange={(page) => setPageShipment(page)}
              />
            </div>
          </div>

          {/* Create order for shipper */}
          {modalCreateOpen && (
            <CreateOrderForShipper
              open={modalCreateOpen}
              onCancel={() => setModalCreateOpen(false)}
              id={id}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CourierProfile;
