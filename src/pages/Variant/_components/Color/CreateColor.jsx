/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Modal } from "antd";
import useAutoFocus from "../../../../hooks/customHook/useAutoFocus";
import useColorMutation from "../../../../hooks/Color/useColorMutation";

const CreateColor = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);

  const { mutate: createColor, isPending } = useColorMutation({
    action: "CREATE",
    onSuccess: () => {
      form.resetFields();
      onCancel();
      message.success("Thêm màu sắc thành công");
    },
    onError: (error) => {
      message.error(`Lỗi khi thêm màu sắc: ${error.response.data.message}`);
      console.log(error);
    },
  });

  const onFinish = (values) => {
    createColor(values);
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm màu sắc"
        open={open}
        onCancel={isPending ? null : onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={isPending}
          >
            {isPending ? "Đang thêm..." : "Thêm"}
          </Button>,
        ]}
      >
        <Form
          disabled={isPending}
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            className="w-full"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập màu sắc!",
              },
            ]}
          >
            <Input ref={inputRef} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateColor;
