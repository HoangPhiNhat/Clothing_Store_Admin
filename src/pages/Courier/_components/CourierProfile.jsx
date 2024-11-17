import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, Row, Tag, Upload } from "antd";
import { useState } from "react";

const CourierProfile = () => {
  const [editable, setEditable] = useState(false); // Trạng thái Edit
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    name: "Baylee Dietrich",
    status: "Available",
    gsm: "(460) 700 02 08",
    email: "Wellington78@yahoo.com",
    address: "11891 Beahan Square, Lindenhurst, NY 11390",
    accountNo: "9439786235",
    store: "Alexandra Turnpike",
    vehicle: "Vespa Primavera 150",
    vehicleId: "JDN 994",
    avatar: "",
  });

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      setFormData({ ...formData, avatar: info.file.response.url });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (values) => {
    // Xử lý submit form ở đây (ví dụ: gọi API hoặc cập nhật cơ sở dữ liệu)
    console.log(values);
  };

  // Style cho Input khi không ở chế độ Edit
  const inputStyle = editable
    ? {}
    : { border: "none", backgroundColor: "transparent", pointerEvents: "none" };

  return (
    <div className="p-4 bg-gray-100 h-screen">
      <div className="grid grid-cols-10 gap-4 h-full">
        {/* Profile */}
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={formData}
          className="col-span-3 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
        >
          <div className="relative">
            <Avatar size={120} src={formData.avatar || null} className="mb-4">
              {formData.name
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
                <label>Status</label>
              </Col>
              <Col span={19}>
                <Tag color="green" className="text-center " >{formData.status}</Tag>
              </Col>
            </Row>

            <Form.Item
              name="gsm"
              className="mt-5"
              rules={[{ required: true, message: "Please input your GSM!" }]}
            >
              <Row gutter={24}>
                <Col span={5} className="flex items-center">
                  <label>GSM</label>
                </Col>
                <Col span={19}>
                  <Input
                    value={formData.gsm}
                    onChange={(e) => handleInputChange("gsm", e.target.value)}
                    style={inputStyle}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Row gutter={24}>
                <Col span={5} className="flex items-center">
                  <label>Email</label>
                </Col>
                <Col span={19}>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    style={inputStyle}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Row gutter={24}>
                <Col span={5} className="flex items-center">
                  <label>Address</label>
                </Col>
                <Col span={19}>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    style={inputStyle}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="accountNo"
              rules={[
                {
                  required: true,
                  message: "Please input your account number!",
                },
              ]}
            >
              <Row gutter={24}>
                <Col span={5} className="flex items-center">
                  <label>Account No</label>
                </Col>
                <Col span={19}>
                  <Input
                    value={formData.accountNo}
                    onChange={(e) =>
                      handleInputChange("accountNo", e.target.value)
                    }
                    style={inputStyle}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="vehicle"
              rules={[
                { required: true, message: "Please input your vehicle!" },
              ]}
            >
              <Row gutter={24}>
                <Col span={5} className="flex items-center"> 
                  <label>Vehicle</label>
                </Col>
                <Col span={19}>
                  <Input
                    value={formData.vehicle}
                    onChange={(e) =>
                      handleInputChange("vehicle", e.target.value)
                    }
                    style={inputStyle}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="vehicleId"
              rules={[
                { required: true, message: "Please input your vehicle ID!" },
              ]}
            >
              <Row gutter={24}>
                <Col span={5}>
                  <label>Vehicle ID</label>
                </Col>
                <Col span={19}>
                  <Input
                    value={formData.vehicleId}
                    onChange={(e) =>
                      handleInputChange("vehicleId", e.target.value)
                    }
                    style={inputStyle}
                  />
                </Col>
              </Row>
            </Form.Item>
          </div>

          <div className="flex justify-between items-center mt-6 w-full">
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
            <Button
              icon={<EditOutlined />}
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
              {editable ? "Save" : "Edit"}
            </Button>
          </div>
        </Form>

        {/* List order - 70% */}
        <div className="col-span-7 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Danh sách đơn hàng đã giao
          </h2>
          <div className="text-gray-500 text-center">No data</div>
        </div>
      </div>
    </div>
  );
};

export default CourierProfile;
