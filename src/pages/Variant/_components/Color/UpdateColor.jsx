/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import useColorMutation from "../../../../hooks/Color/useColorMutation";
import useAutoFocus from "../../../../hooks/customHook/useAutoFocus";

const UpdateColor = ({ open, onCancel, color }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useAutoFocus(open);

  const { mutate: updateColor, isPending } = useColorMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật màu sắc thành công");
      onCancel();
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi cập nhật: ${error.response.data.message}`);
    },
  });

  useEffect(() => {
    if (color) {
      form.setFieldsValue({
        name: color.name,
      });
    }
  }, [color, form]);

  const onFinish = (values) => {
    if (color && color.id) {
      updateColor({ ...values, id: color.id });
    } else {
      messageApi.error("Không tìm thấy ID của màu sắc");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Cập nhật màu sắc"
        open={open}
        onCancel={isPending ? null : onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel} disabled={isPending}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={isPending}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
          name="updateColor"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên màu sắc!",
              },
            ]}
          >
            <Input
              ref={inputRef}
              placeholder="Tên màu sắc"
              disabled={isPending}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateColor;
