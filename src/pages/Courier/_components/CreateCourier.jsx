/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Steps, Upload } from "antd";
import { useState } from "react";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";

const { Step } = Steps;

const CreateCourier = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    vehicle: {},
  });
  const [fileList, setFileList] = useState([]);

  // Get all vihicle
  // Create courier

  const steps = [
    {
      title: "Thông tin tài xế",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleNext("personal", values)}
        >
          <Form.Item label="Ảnh" name="image">
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên tài xế" }]}
          >
            <Input ref={inputRef} placeholder="Vui lòng nhập tên tài xế" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Sai định dạng email" },
            ]}
          >
            <Input placeholder="Vui lòng nhập email" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Vui lòng nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Vui lòng nhập địa chỉ" />
          </Form.Item>
          {/* Button */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              key="cancel"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Hủy
            </Button>

            <div className="flex gap-2">
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
                disabled={current === 0}
              >
                Trở lại
              </Button>
              <Button
                type="primary"
                className="btn btn-primary"
                htmlType="submit"
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        </Form>
      ),
    },
    {
      title: "Phương tiện",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleNext("vehicle", values, true)}
        >
          <Form.Item
            label="Tên phương tiện"
            name="vehicleName"
            rules={[
              { required: true, message: "Vui lòng nhập tên phương tiện" },
            ]}
          >
            <Input placeholder="Vui lòng nhập tên phương tiện" />
          </Form.Item>
          <Form.Item
            label="Biển số xe"
            name="licensePlate"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
          >
            <Input placeholder="Vui lòng nhập biển số xe" />
          </Form.Item>
          <div className="mt-6 flex justify-between items-center">
            <Button key="cancel" onClick={onCancel}>
              Hủy
            </Button>

            <div className="flex gap-2">
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
                disabled={current === 0}
              >
                Trở lại
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo tài xế
              </Button>
            </div>
          </div>
        </Form>
      ),
    },
  ];

  const handleNext = (step, values, isLastStep = false) => {
    const updatedData = {
      ...formData,
      [step]: values,
    };
    setFormData(updatedData);

    if (isLastStep) {
      message.success("Form submitted successfully!");
      console.log("Final Data:", formData);
      //Reset form
      form.resetFields();
      setFileList([]);
      setCurrent(0);
      onCancel();
      //Call api create
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    form.setFieldsValue(formData[steps[current - 1].title.toLowerCase()]);
  };

  return (
    <>
      {contextHolder}
      <Modal title="Thêm tài xế" open={open} onCancel={onCancel} footer={false}>
        <div>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          <div style={{ marginTop: 24 }}>{steps[current].content}</div>
        </div>
      </Modal>
    </>
  );
};

export default CreateCourier;
