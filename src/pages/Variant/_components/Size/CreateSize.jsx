/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Modal } from "antd";
import useAutoFocus from "../../../../hooks/customHook/useAutoFocus";
import useSizeMutation from "../../../../hooks/Size/useSizeMutation";

const CreateSize = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);

  const { mutate: createSize, isPending } = useSizeMutation({
    action: "CREATE",
    onSuccess: () => {
      form.resetFields();
      onCancel();
      messageApi.success("Thêm kích thước thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi thêm kích thước: ${error.response.data.message}`);
      console.log(error);
    },
  });

  const onFinish = (values) => {
    createSize(values);
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm kích thước"
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
                message: "Vui lòng nhập kích thước!",
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

export default CreateSize;
