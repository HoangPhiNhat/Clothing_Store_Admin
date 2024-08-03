import React, { useEffect, useState } from "react";
import { PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Upload,
  InputNumber,
} from "antd";
import { Link, useParams } from "react-router-dom";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import {
  deleteFileCloudinary,
  uploadFileCloudinary,
} from "../../../services/cloudinary";
import useProductQuery from "../../../hooks/Product/useProductQuery";

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: categories } = useCategoryQuery();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState(null);
  const { data: product } = useProductQuery(id);
  const { mutate: updateProduct } = useProductMutation({
    action: "UPDATE",
    onSuccess: () => {
      form.resetFields();
      messageApi.success("Sửa sản phẩm thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi sửa sản phẩm: ${error.response.data.message}`);
    },
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });
  const onFinish = async (values) => {
    try {
      let image;
      if (values.thumbnail[0].uid === "-1") {
        image = values.thumbnail[0].thumbUrl;
      } else {
        const match = thumbnail.match(/clothing[^.]*/);
        deleteFileCloudinary(match[0]);
        image = await uploadFileCloudinary(values.thumbnail[0].thumbUrl);
      }
      console.log(values);

      updateProduct({ ...values, id: id, thumbnail: image });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        thumbnail: product.thumbnail
          ? [
              {
                uid: "-1",
                name: "thumbnail.png",
                status: "done",
                thumbUrl: product.thumbnail,
              },
            ]
          : [],
      });
      setThumbnail(product.thumbnail);
    }
  }, [form, product]);

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
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <div className="grid grid-cols-3 gap-x-8 ">
                <Form.Item label="Sku" name="sku" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Regular price"
                  name="regular_price"
                  rules={[
                    { required: true },
                    { type: "number", message: "Nhập số" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  label="Reduced price"
                  name="reduced_price"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  label="Material"
                  name="material"
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
                options={categories?.data?.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="">
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                className=" flex bottom-0 right-0 mx-[83px] my-10 fixed "
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

export default UpdateProduct;
