import React, { useState } from "react";
import {
  MinusCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Select, Upload, Table } from "antd";
import { Link } from "react-router-dom";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import { uploadFileCloudinary } from "../../../services/cloudinary";
import { colors, sizes } from "../../../../data-example";
import { validateFieldNumber } from "../../../validations/Product";

const CreateProduct = () => {
  const { data: categories } = useCategoryQuery("GET_ALL_CATEGORY");
  console.log(categories);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [hasThumbnail, setHasThumbnail] = useState(false);

  const { mutate: createProduct } = useProductMutation({
    action: "CREATE",
    onSuccess: () => {
      form.resetFields();
      messageApi.success("Thêm sản phẩm thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi thêm sản phẩm: ${error.response.data.message}`);
    },
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  const onFinish = async (values) => {
    try {
      const image = await uploadFileCloudinary(values.thumbnail[0].thumbUrl);
      createProduct({ ...values, thumbnail: image });
      console.log({ ...values, thumbnail: image });
    } catch (error) {
      console.log(error);
    }
  };

  const handleThumbnailChange = (info) => {
    setHasThumbnail(info.fileList.length > 0);
  };

  const columns = (remove, fields) => [
    {
      title: "Image",
      dataIndex: "image",
      fixed: "left",
      render: (_, field) => (
        <Form.Item
          name={[field.name, "image"]}
          rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
        >
          <Upload
            maxCount={1}
            listType="picture-card"
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      ),
    },
    {
      title: "Color",
      dataIndex: "color_id",
      fixed: "left",
      render: (_, field) => (
        <Form.Item
          name={[field.name, "color_id"]}
          rules={[{ required: true, message: "Missing color" }]}
        >
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label?.toString() ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label?.toString() ?? "").toLowerCase())
            }
            options={colors?.map((color) => ({
              value: color.id,
              label: color.name,
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (_, field) => (
        <Form.Item
          name={[field.name, "size"]}
          rules={[{ required: true, message: "Missing size" }]}
        >
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label?.toString() ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label?.toString() ?? "").toLowerCase())
            }
            options={sizes?.map((size) => ({
              value: size.id,
              label: size.name,
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      render: (_, field) => (
        <Form.Item
          name={[field.name, "stock_quantity"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      render: (_, field) =>
        fields.length > 1 ? (
          <MinusCircleOutlined
            onClick={() => remove(field.name)}
            className="text-red-500 cursor-pointer text-xl"
          />
        ) : null,
    },
  ];

  return (
    <div className="container mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-medium">Create Product</h1>
        <Link to="/admin/products">
          <Button className="text-base" type="primary">
            <RollbackOutlined /> Back to List
          </Button>
        </Link>
      </div>
      <div>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ attributes: [{}] }}
        >
          <div className="grid grid-cols-[auto,300px] gap-8">
            <div>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Thumbnail"
                name="thumbnail"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    console.log(e);
                    return e;
                  }
                  return e && e.fileList;
                }}
                rules={[
                  {
                    required: true,
                    message: "Please upload a thumbnail image",
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={handleThumbnailChange}
                  previewFile={(file) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        resolve(reader.result);
                      };
                    });
                  }}
                >
                  {!hasThumbnail && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <div className="grid grid-cols-3 gap-x-8 ">
                <Form.Item
                  label="Regular price"
                  name="regular_price"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá " },
                    {
                      validator: (_, value) =>
                        validateFieldNumber("giá", value),
                    },
                  ]}
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
                  name="material"
                  label="Material"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                name="short_description"
                label="Short Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea showCount maxLength={200} />
              </Form.Item>
              <Form.Item
                name="long_description"
                label="Long Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea showCount maxLength={200} />
              </Form.Item>
            </div>
            <Form.Item
              label="Category"
              name="category_id"
              rules={[{ required: true }]}
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
                options={categories?.data?.data?.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            </Form.Item>
          </div>
          <section>
            <h2 className="mb-2">Attributes</h2>
            <Form.List name="attributes">
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
                  <Table
                    columns={columns(remove, fields)}
                    dataSource={fields}
                    pagination={false}
                    rowKey="key"
                    scroll={{ x: 1300 }}
                  />
                </>
              )}
            </Form.List>
          </section>
          <div className="">
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                className=" flex bottom-0 right-0 mx-[83px] my-10 fixed z-10"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateProduct;
