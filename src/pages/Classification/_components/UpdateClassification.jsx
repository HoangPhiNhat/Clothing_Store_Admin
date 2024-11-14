/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";

const UpdateClassification= ({ open, onCancel, category, actionType }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useAutoFocus(open);
  const messageUpdateSuccess =
    actionType === "UPDATE"
      ? "Cập nhật danh mục thành công"
      : "Cập nhật danh mục phân loại thành công";

  const { mutate: updateCategory, isPending } = useCategoryMutation({
    action: actionType,
    onSuccess: () => {
      messageApi.success(messageUpdateSuccess);
      onCancel();
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi cập nhật: ${error.response.data.message}`);
    },
  });

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
      });
    }
  }, [category, form]);

  const onFinish = (values) => {
    if (category && category.id) {
      updateCategory({ ...values, id: category.id });
    } else {
      messageApi.error("Không tìm thấy ID của danh mục");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Cập nhật danh mục phân loại"
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
          name="updateCategory"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục!",
              },
            ]}
          >
            <Input
              ref={inputRef}
              placeholder="Tên danh mục"
              disabled={isPending}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateClassification;
