import {
  CheckOutlined,
  EditOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Tag,
  Upload,
} from "antd";
import { useState } from "react";
import useCourierMutation from "../../../hooks/Courier/useCourierMutation";

const CourierProfile = () => {
  const [editable, setEditable] = useState(false); // Trạng thái Edit
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [courier, setCourier] = useState({
    personal: {
      name: "Baylee Dietrich",
      status: "Available",
      phone_number: "(460) 700 02 08",
      email: "Wellington78@yahoo.com",
      address: "11891 Beahan Square, Lindenhurst, NY 11390",
    },
    vehicle: {
      vehicle_name: "Vespa Primavera 150",
      license_plate: "JDN 994",
    },
    avatar: "",
  });

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      setCourier({ ...courier, avatar: info.file.response.url });
    }
  };

  const handleInputChange = (field, value) => {
    setCourier({ ...courier, [field]: value });
  };

  const { mutate: updateCourier, isPending } = useCourierMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật thông tin tài xế thành công.")
    },
    onError: (error) => {
      messageApi.error(`Cập nhập thông tin tài xế thất bại. ${error.response.data.message}`);
    },
  });

  const handleSubmit = (values) => {
    updateCourier(values);
  };

  // Style cho Input khi không ở chế độ Edit
  const inputStyle = editable
    ? {}
    : { border: "none", backgroundColor: "transparent", pointerEvents: "none" };

  return (
    <>
      {contextHolder}
      <div className="p-4 bg-gray-100 h-screen">
        <div className="grid grid-cols-10 gap-4 h-full">
          {/* Profile */}
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              personal: courier.personal,
              vehicle: courier.vehicle,
            }}
            disabled={isPending}
            className="col-span-3 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
          >
            <div className="relative">
              <Avatar size={120} src={courier.avatar || null} className="mb-4">
                {courier.personal.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              {editable && (
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute bottom-0 right-0"
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="small"
                    className="p-1"
                  />
                </Upload>
              )}
            </div>

            <div className="mt-6 w-full">
              <Row gutter={24}>
                <Col span={5}>
                  <label>Trạng thái</label>
                </Col>
                <Col span={19}>
                  <Tag color="green" className="text-center">
                    {courier.personal.status}
                  </Tag>
                </Col>
              </Row>

              {/* Personal Information Fields */}
              <Form.Item
                name={["personal", "name"]}
                className="mt-5"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài xế!" },
                ]}
              >
                <Row gutter={24}>
                  <Col span={5} className="flex items-center">
                    <label>Tên tài xế</label>
                  </Col>
                  <Col span={19}>
                    <Input
                      value={courier.personal.name}
                      onChange={(e) =>
                        handleInputChange("personal", "name", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name={["personal", "phone_number"]}
                className="mt-5"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Row gutter={24}>
                  <Col span={5} className="flex items-center">
                    <label>Số điện thoại</label>
                  </Col>
                  <Col span={19}>
                    <Input
                      value={courier.personal.phone_number}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "phone_number",
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item name={["personal", "email"]}>
                <Row gutter={24}>
                  <Col span={5} className="flex items-center">
                    <label>Email</label>
                  </Col>
                  <Col span={19}>
                    <Input
                      value={courier.personal.email}
                      disabled={editable}
                      style={inputStyle}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name={["personal", "address"]}
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Row gutter={24}>
                  <Col span={5} className="flex items-center">
                    <label>Địa chỉ</label>
                  </Col>
                  <Col span={19}>
                    <Input
                      value={courier.personal.address}
                      onChange={(e) =>
                        handleInputChange("personal", "address", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </Col>
                </Row>
              </Form.Item>

              {/* Vehicle Information Fields */}
              <Form.Item
                name={["vehicle", "vehicle_name"]}
                rules={[
                  { required: true, message: "Vui lòng nhập tên phương tiện!" },
                ]}
              >
                <Row gutter={24}>
                  <Col span={5} className="flex items-center">
                    <label>Phương tiện</label>
                  </Col>
                  <Col span={19}>
                    <Input
                      value={courier.vehicle.vehicle_name}
                      onChange={(e) =>
                        handleInputChange(
                          "vehicle",
                          "vehicle_name",
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name={["vehicle", "license_plate"]}
                rules={[
                  { required: true, message: "Vui lòng nhập biển số xe!" },
                ]}
              >
                <Row gutter={24}>
                  <Col span={5} className="flex items-center">
                    <label>Biển số xe</label>
                  </Col>
                  <Col span={19}>
                    <Input
                      value={courier.vehicle.license_plate}
                      onChange={(e) =>
                        handleInputChange(
                          "vehicle",
                          "license_plate",
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </div>

            <div className="flex justify-between items-center mt-6 w-full">
              <Button disabled={isPending} icon={<LockOutlined />} danger>
                Khoá tài khoản
              </Button>
              <Button
                loading={isPending}
                icon={editable ? <CheckOutlined /> : <EditOutlined />}
                type="default"
                onClick={() => {
                  if (editable) {
                    // Gọi hàm lưu dữ liệu khi nhấn "Save"
                    form.submit();
                    setEditable(false);
                  } else {
                    // Chuyển sang chế độ chỉnh sửa
                    setEditable(true);
                  }
                }}
              >
                {editable ? "Lưu" : "Cập nhật"}
              </Button>
            </div>
          </Form>

          {/* List order */}
          <div className="col-span-7 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Danh sách đơn hàng đã giao
            </h2>
            <div className="text-gray-500 text-center">No data</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourierProfile;
