/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import useSizeMutation from "../../../../hooks/Size/useSizeMutation";
import useAutoFocus from "../../../../hooks/customHook/useAutoFocus";

const UpdateSize = ({ open, onCancel, size }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useAutoFocus(open);

  const { mutate: updateSize, isPending } = useSizeMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật kích thước thành công");
      onCancel();
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi cập nhật: ${error.response.data.message}`);
    },
  });

  useEffect(() => {
    if (size) {
      form.setFieldsValue({
        name: size.name,
      });
    }
  }, [size, form]);

  const onFinish = (values) => {
    if (size && size.id) {
      updateSize({ ...values, id: size.id });
    } else {
      messageApi.error("Không tìm thấy ID của kích thước");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Cập nhật kích thước"
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
          name="updateSize"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên kích thước!",
              },
            ]}
          >
            <Input
              ref={inputRef}
              placeholder="Tên kích thước"
              disabled={isPending}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateSize;
