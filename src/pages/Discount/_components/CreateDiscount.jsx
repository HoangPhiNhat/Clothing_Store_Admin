/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Input, message, Modal } from "antd";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import useDisCountMutation from "../../../hooks/Discount/useDiscountMutation";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

// Disable ngày nhỏ hơn hôm nay
const disabledStartDate = (current) => {
  return current && current < dayjs().endOf("day");
};

// Disable ngày kết thúc nhỏ hơn ngày bắt đầu
const disabledEndDate = (startDate) => (current) => {
  return (
    current &&
    (current < dayjs().startOf("day") || (startDate && current < startDate))
  );
};

const CreateDiscount = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);
  const [startDate, setStartDate] = useState(null);

  const { mutate: createDiscount, isPending } = useDisCountMutation({
    action: "CREATE",
    onSuccess: () => {
      onCancel(false)
      messageApi.success("Thêm chiến dịch giảm giá thành công.");
    },
    onError: (error) => {
      messageApi.error(
        `Thêm chiến dịch giảm giá thất bại.  ${error.response.data.message}`
      );
    },
  });

  const onFinish = (data) => {
    const discount = {
      name: data.name,
      description: data.description || "",
      discount_percentage: Number(data.discount_percentage),
      start_date: dayjs(data.date[0]).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(data.date[1]).format("YYYY-MM-DD HH:mm:ss"),
    };
    console.log(discount);
    createDiscount(discount);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Tạo chiến dịch giảm giá"
        open={open}
        onCancel={() => {
          onCancel();
          form.resetFields();
        }}
        footer={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
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
            name="discount_percentage"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            ]}
          >
            <Input placeholder="Vui lòng nhập phần trăm giảm giá" />
          </Form.Item>

          <Form.Item
            name="date"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu và kết thúc.",
              },
            ]}
          >
            <RangePicker
              disabledDate={(current) => {
                if (!startDate) {
                  // Nếu chưa có ngày bắt đầu, chỉ disable các ngày trước hôm nay
                  return disabledStartDate(current);
                }
                // Nếu đã có ngày bắt đầu, disable ngày kết thúc trước ngày bắt đầu
                return disabledEndDate(startDate)(current);
              }}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [
                  dayjs("00:00:00", "HH:mm:ss"),
                  dayjs("23:59:59", "HH:mm:ss"),
                ],
              }}
              format="YYYY-MM-DD HH:mm:ss"
              onCalendarChange={(values) => {
                // Cập nhật ngày bắt đầu khi người dùng chọn
                if (values && values[0]) {
                  setStartDate(values[0]);
                }
              }}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </Form.Item>

          <Form.Item label="Mô tả chiến chiến dịch" name="description">
            <Input placeholder="Vui lòng nhập mô tả chiến dịch" />
          </Form.Item>

          {/* Button */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              key="cancel"
              onClick={() => {
                onCancel();
                form.resetFields();
              }}
              disabled={isPending}
              className="btn btn-secondary"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="btn btn-primary"
              loading={isPending}
            >
              Tạo chiến dịch
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CreateDiscount;
