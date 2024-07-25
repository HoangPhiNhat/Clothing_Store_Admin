import React, { useState } from "react";
import {
  PlusOutlined,
  MinusCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Space,
  Upload,
  Image,
} from "antd";
import { Link } from "react-router-dom";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUploader = ({ fieldKey }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const beforeUpload = (file) => {
    // Prevent form submission
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Form.Item name={[fieldKey, "image"]}>
        <Upload
          listType="picture-circle"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={beforeUpload}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </Form.Item>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

const CreateProduct = () => {
  const { data: categories } = useCategoryQuery();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  return (
    <div className="container mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl">Thêm sản phẩm</h1>
        <Link to="/admin/products">
          <button className="text-base" type="primary">
            <RollbackOutlined /> Quay lại
          </button>
        </Link>
      </div>
      <div>
        <Form form={form} name="basic" layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-3 gap-x-8 ">
            <Form.Item label="Sku" name="sku" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Regular price"
              name="regular_price"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Reduced price"
              name="reduced_price"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Material"
              name="material"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true, message: "Bắt buộc chọn" }]}
            >
              <Select
                showSearch
                placeholder="Search to Select"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label?.toString() ?? "")
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.label?.toString() ?? "").toLowerCase()
                    )
                }
                options={categories?.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input Intro" }]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>
          <h2 className="mb-2 ">Phân loại sản phẩm</h2>
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item >
                    <ImageUploader fieldKey={fieldKey} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "first"]}
                      rules={[
                        { required: true, message: "Missing first name" },
                      ]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "last"]}
                      rules={[{ required: true, message: "Missing last name" }]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </div>
  );
};

export default CreateProduct;
