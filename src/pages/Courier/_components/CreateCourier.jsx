/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Steps, Upload } from "antd";
import { useState } from "react";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
import useCourierMutation from "../../../hooks/Courier/useCourierMutation";

const { Step } = Steps;

const CreateCourier = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Create courier
  const { mutate: createCourier, isPending } = useCourierMutation({
    action: "CREATE",
    onSuccess: () => {
      //Reset form
      form.resetFields();
      setFileList([]);
      setCurrent(0);
      onCancel();
      messageApi.success("Thêm tài xế thành công.");
    },
    onError: (error) => {
      messageApi.error(`Thêm tài xế thất bại. ${error.response.data.message} `);
    },
  });

  const steps = [
    {
      title: "Thông tin tài xế",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleNext("personal", values)}
          disabled={isPending}
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
            name="phone_number"
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
              disabled={isPending}
              className="btn btn-secondary"
            >
              Hủy
            </Button>

            <div className="flex gap-2">
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
                disabled={current === 0 || isPending}
              >
                Trở lại
              </Button>
              <Button
                type="primary"
                className="btn btn-primary"
                htmlType="submit"
                disabled={isPending}
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
          disabled={isPending}
        >
          <Form.Item
            label="Tên phương tiện"
            name="vehicle_name"
            rules={[
              { required: true, message: "Vui lòng nhập tên phương tiện" },
            ]}
          >
            <Input placeholder="Vui lòng nhập tên phương tiện" />
          </Form.Item>
          <Form.Item
            label="Biển số xe"
            name="license_plate"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
          >
            <Input placeholder="Vui lòng nhập biển số xe" />
          </Form.Item>
          <div className="mt-6 flex justify-between items-center">
            <Button key="cancel" onClick={onCancel} disabled={isPending}>
              Hủy
            </Button>

            <div className="flex gap-2">
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
                disabled={current === 0 || isPending}
              >
                Trở lại
              </Button>
              <Button type="primary" htmlType="submit" loading={isPending}>
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
      //Call api create
      createCourier(updatedData);
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
