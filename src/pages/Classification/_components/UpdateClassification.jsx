/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import useClassificationMutation from "../../../hooks/Classification/useClassificationMutation";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
// import useClassificationQuery from "../../../hooks/Classification/useClassificationQuery";
// import Loading from "../../../components/base/Loading/Loading";

// const { Option } = Select;

const UpdateClassification = ({ open, onCancel, category }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useAutoFocus(open);

  // const { data: categories, isLoading } = useClassificationQuery(
  //   "GET_ALL_CATEGORY_FOR_PRODUCT"
  // );

  const { mutate: updateCategory, isPending } = useClassificationMutation({
    action: "UPDATE",
    onSuccess: () => {
      messageApi.success("Cập nhật danh mục phân loại thành công");
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

  // if (isLoading) return <Loading />;

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
            className="w-full"
            name="name"
            label="Tên danh mục"
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

          {/* <Form.Item
            name="parent_id"
            label="Phân loại"
            rules={[
              {
                type: "array",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn danh mục"
              dropdownStyle={{ maxHeight: 250, overflow: "auto" }}
            >
              {categories?.data.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateClassification;
