/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Modal } from "antd";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";

const CreateCategory = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);

  const { mutate: createCategory, isPending } = useCategoryMutation({
    action: "CREATE",
    onSuccess: () => {
      form.resetFields();
      onCancel();
      messageApi.success("Thêm danh mục thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi thêm danh mục: ${error.response.data.message}`);
      console.log(error);
    },
  });

  const onFinish = (values) => {
    createCategory(values);
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm danh mục"
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
                message: "Vui lòng nhập danh mục!",
              },
              {
                min: 6,
                message: "Tên danh mục phải dài hơn 6 kí tự.",
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

export default CreateCategory;
