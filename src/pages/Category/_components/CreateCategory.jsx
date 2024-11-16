/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Modal, Select } from "antd";
// import { useState } from "react";
import Loading from "../../../components/base/Loading/Loading";
import useCategoryMutation from "../../../hooks/Category/useCategoryMutation";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
// import {
//   deleteFileCloudinary,
//   extractPublicId,
//   uploadFileCloudinary,
// } from "../../../services/cloudinary";

const { Option } = Select;

const CreateCategory = ({ open, onCancel }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const inputRef = useAutoFocus(open);
  // const [isPendingUpload, setIsPendingUpload] = useState(false);
  // const [publicId, setPublicId] = useState(null);

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
      // if (publicId) {
      //   deleteFileCloudinary(publicId);
      // }
      console.log(error);
    },
  });

  if (isLoading) return <Loading />;

  // const onFinish = async (values) => {
  //   try {
  //     const { image } = values;

  //     setIsPendingUpload(true);
  //     const thumbnail = await uploadFileCloudinary(image.fileList[0].thumbUrl);
  //     setPublicId(extractPublicId(thumbnail));

  //     let category = { ...values, image: thumbnail };

  //     createCategory(category);
  //   } catch (error) {
  //     console.log("Error create category" + error);
  //   } finally {
  //     setIsPendingUpload(false);
  //   }
  // };

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
            loading={
              isPending
              //  ||  isPendingUpload
            }
          >
            {isPending
              ? // || isPendingUpload
                "Đang thêm..."
              : "Thêm danh mục"}
          </Button>,
        ]}
      >
        <Form
          disabled={
            isPending
            // || isPendingUpload
          }
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

          {/* <Form.Item name="image" label="Ảnh">
            <Upload
              accept=".jpg, .jpeg, .png"
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                const isImage =
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ||
                  file.type === "image/jpg";
                if (!isImage) {
                  message.error(
                    "Chỉ chấp nhận tệp định dạng JPG, PNG, hoặc JPEG!"
                  );
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click để thêm ảnh</Button>
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default CreateCategory;
