/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";

const UpdateCategory = ({ open, onCancel, category }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: updateCategory, isPending } = useCategoryMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật danh mục thành công");
      onCancel(); // Đóng modal sau khi cập nhật thành công
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
        title="Cập nhật danh mục"
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
            <Input placeholder="Tên danh mục" disabled={isPending} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateCategory;
