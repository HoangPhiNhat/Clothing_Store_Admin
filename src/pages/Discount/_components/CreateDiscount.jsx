/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Steps,
  Table,
} from "antd";
import { useState } from "react";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";

//Table
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

const { Step } = Steps;
const CreateDiscount = ({ open, onCancel }) => {
  const [productsId, setProductsId] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState([]);

  //Productid
  const rowSelection = {
    productsId,
    onChange: (selectedKeys) => {
      setProductsId(selectedKeys);
    },
  };

  //Step
  const steps = [
    {
      title: "Thông tin chiến dịch",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleNext("discount_info", values)}
          // disabled={isPending}
        >
          <Form.Item
            label="Tên chiến dịch"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên chiến dịch" },
            ]}
          >
            <Input ref={inputRef} placeholder="Vui lòng nhập tên chiến dịch" />
          </Form.Item>

          <Form.Item
            label="Giảm giá"
            name="discount_value"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            ]}
          >
            <Input placeholder="Vui lòng nhập phần trăm giảm giá" />
          </Form.Item>

          <div className="flex justify-end">
            <Form.Item
              label="Ngày bắt đầu"
              name="date_start"
              rules={[
                { required: true, message: "Vui lòng nhập ngày bắt đầu" },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Ngày kết thúc"
              name="date_end"
              rules={[
                { required: true, message: "Vui lòng nhập ngày kết thúc" },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker />
            </Form.Item>
          </div>

          {/* Button */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              key="cancel"
              onClick={onCancel}
              // disabled={isPending}
              className="btn btn-secondary"
            >
              Hủy
            </Button>

            <div className="flex gap-2">
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
                disabled={
                  current === 0
                  // || isPending
                }
              >
                Trở lại
              </Button>
              <Button
                type="primary"
                className="btn btn-primary"
                htmlType="submit"
                // disabled={isPending}
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        </Form>
      ),
    },
    {
      title: "Sản phẩm áp dụng",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleNext("product_apply", values, true)}
          // disabled={isPending}
        >
          <Form.Item name="discount_type" label="Loại chiến dịch">
            <Select
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "categories",
                  label: "Danh mục",
                },
                {
                  value: "products",
                  label: "Sản phẩm",
                },
              ]}
            />
          </Form.Item>

          {/* Table */}
          <Form.Item name="productsId" label="Sản phẩm áp dụng">
            <Table
              rowSelection={{
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </Form.Item>

          {/* Button action */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              key="cancel"
              onClick={onCancel}
              // disabled={isPending}
            >
              Hủy
            </Button>

            <div className="flex gap-2">
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
                disabled={
                  current === 0
                  //  || isPending
                }
              >
                Trở lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                // loading={isPending}
              >
                Tạo chiến dịch
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
      [step]: { ...values, productsId },
    };
    setFormData(updatedData);

    if (isLastStep) {
      console.log(updatedData);

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
      <Modal
        title="Tạo chiến dịch giảm giá"
        open={open}
        onCancel={onCancel}
        footer={false}
      >
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

export default CreateDiscount;
