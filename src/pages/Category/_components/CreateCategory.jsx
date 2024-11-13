/* eslint-disable react/prop-types */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import Loading from "../../../components/base/Loading/Loading";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";

const {Option} = Select;

const CreateCategory = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);

  const { data: categories, isLoading } = useCategoryQuery(
    "GET_ALL_CATEGORY_FOR_PRODUCT"
  );

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

  if (isLoading) return <Loading />;

  const onFinish = (values) => {
    console.log(values);
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
            {isPending ? "Đang thêm..." : "Thêm danh mục"}
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

          <Form.Item
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
          </Form.Item>

          <Form.Item name="image" label="Ảnh" valuePropName="fileList">
            <Upload
              name="logo"
              action="/upload.do"
              listType="picture"
              accept=".jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />}>Click để thêm ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCategory;
