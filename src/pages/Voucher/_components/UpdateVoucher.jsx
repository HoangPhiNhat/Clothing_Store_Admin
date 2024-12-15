/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  Row,
  Select,
  InputNumber,
} from "antd";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
import dayjs from "dayjs";
import { Option } from "antd/es/mentions";
import useVoucherMutation from "../../../hooks/Voucher/useVoucherMutation";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

// // Disable ngày nhỏ hơn hôm nay
// const disabledStartDate = (current) => {
//   return current && current < dayjs().endOf("day");
// };

// // Disable ngày kết thúc nhỏ hơn ngày bắt đầu
// const disabledEndDate = (startDate) => (current) => {
//   return (
//     current &&
//     (current < dayjs().startOf("day") || (startDate && current < startDate))
//   );
// };

const UpdateVoucher = ({ open, onCancel, voucher }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useAutoFocus(open);
  // const [startDate, setStartDate] = useState(null);
  const [showMaxDiscount, setShowMaxDiscount] = useState(
    voucher?.discount_type
  );

  const { mutate: updateVoucher, isPending } = useVoucherMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật phiếu thành công");
      onCancel();
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi cập nhật: ${error.response.data.message}`);
    },
  });

  useEffect(() => {
    if (voucher) {
      setShowMaxDiscount(voucher.discount_type);
      form.setFieldsValue({
        voucher_code: voucher.voucher_code,
        name: voucher.name,
        description: voucher.description || "",
        discount_type: voucher.discount_type,
        discount_value: Number(voucher.discount_value),
        max_discount: Number(voucher.max_discount),
        min_order_value: Number(voucher.min_order_value),
        usage_limit: Number(voucher.usage_limit),
        date: [
          dayjs(voucher.start_date, "YYYY-MM-DD HH:mm:ss"),
          dayjs(voucher.end_date, "YYYY-MM-DD HH:mm:ss"),
        ],
      });
    }
  }, [voucher, form]);

  const onFinish = (data) => {
    console.log(data);
    const dataVoucher = {
      voucher_code: data.voucher_code,
      name: data.name,
      description: data.description || "",
      discount_type: data.discount_type,
      discount_value: Number(data.discount_value),
      max_discount: Number(data.max_discount),
      min_order_value: Number(data.min_order_value),
      usage_limit: Number(data.usage_limit),
      start_date: dayjs(data.date[0]).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(data.date[1]).format("YYYY-MM-DD HH:mm:ss"),
    };
    if (voucher && voucher.id) {
      updateVoucher({ ...dataVoucher, id: voucher.id });
    } else {
      messageApi.error("Không tìm thấy ID của phiếu");
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      console.log(1);

      if (startDate.isAfter(endDate)) {
        // Hiển thị thông báo khi hoán đổi
        message.info(
          "Ngày bắt đầu lớn hơn ngày kết thúc. Hệ thống đã tự động hoán đổi giá trị."
        );
      }
    }
  };

  const handleValuesChange = (value) => {
    setShowMaxDiscount(value);
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Cập nhật phiếu giảm giá"
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
          initialValues={{
            discount_type: voucher?.discount_type, // Giá trị mặc định cho discount_type
          }}
          disabled={isPending}
        >
          <Form.Item
            label="Mã phiếu"
            name="voucher_code"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    // Không kiểm tra nếu không nhập
                    return Promise.resolve();
                  }
                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Mã phiếu phải có ít nhất 6 ký tự!")
                    );
                  }
                  if (!/^[A-Z]+$/.test(value)) {
                    return Promise.reject(
                      new Error("Mã phiếu chỉ được chứa các chữ cái viết hoa!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Vui lòng nhập mã phiếu" />
          </Form.Item>
          <Form.Item
            label="Tên phiếu"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên phiếu" }]}
          >
            <Input ref={inputRef} placeholder="Vui lòng nhập tên phiếu" />
          </Form.Item>
          <Row
            gutter={16}
            className="w-full flex flex-nowrap gap-3 "
            style={{ margin: 0 }}
          >
            <Form.Item
              name="discount_type"
              className="w-1/4 min-w-[25%]"
              label="Loại giảm"
            >
              <Select
                defaultValue="percentage"
                className="w-full"
                onChange={handleValuesChange}
              >
                <Option value="percentage">Phần trăm</Option>
                <Option value="fixed_amount">VNĐ</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Giá giảm"
              name="discount_value"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm" },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Vui lòng nhập giá trị giảm"
              />
            </Form.Item>
          </Row>
          <Form.Item
            label="Đơn tối thiểu áp dụng"
            name="min_order_value"
            rules={[
              { required: true, message: "Vui lòng nhập giá đơn tối thiểu" },
              {
                min: 1,
                type: "number",
                message: "Giá đơn tối thiểu lớn hơn 0",
              },
            ]}
          >
            <InputNumber
              type="number"
              placeholder="Đơn tối thiểu"
              className="w-full"
            />
          </Form.Item>
          {showMaxDiscount == "percentage" && (
            <Form.Item
              label="Giá giảm tối đa"
              name="max_discount"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const discount_type = getFieldValue("discount_type");
                    const min_order_value = getFieldValue("min_order_value");
                    if (!Number(value)) {
                      return Promise.reject("Vui lòng nhập giá giảm tối đa");
                    }
                    if (
                      (Number(value) <= 0 || Number(value) >= 100) &&
                      discount_type === "percentage"
                    ) {
                      return Promise.reject(
                        "Giá giảm tối đa > 0% và nhỏ hơn 100%"
                      );
                    }
                    if (
                      Number(value) >= min_order_value &&
                      discount_type === "fixed_amount"
                    ) {
                      return Promise.reject(
                        "Giá giảm tối đa phải nhỏ hơn đơn tối thiểu"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber
                type="number"
                placeholder="Giá giảm tối đa"
                className="w-full"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Số lượng phiếu"
            name="usage_limit"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng phiếu" },
              { min: 1, type: "number", message: "Số lượng phiếu lớn hơn 0" },
            ]}
          >
            <InputNumber
              type="number"
              placeholder="Số lượng phiếu"
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label="Thời hạn"
            className="w-full"
            name="date"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu và kết thúc.",
              },
            ]}
          >
            <RangePicker
              className="w-full"
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [dayjs().startOf("day"), dayjs().endOf("day")],
              }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              onChange={handleDateChange}
            />
          </Form.Item>

          <Form.Item label="Mô tả phiếu" name="description">
            <Input placeholder="Vui lòng nhập mô tả phiếu" />
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
              Cập nhật phiếu
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateVoucher;
