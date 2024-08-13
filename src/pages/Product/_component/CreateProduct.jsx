/* eslint-disable no-unused-vars */
import {
  DeleteOutlined,
  PlusOutlined,
  RollbackOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Table,
  Upload,
} from "antd";

import { useState } from "react";
import { Link } from "react-router-dom";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";
import { validateFieldNumber } from "../../../validations/Product";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
import useSizeQuery from "../../../hooks/Size/useSizeQuery";
import useColorQuery from "../../../hooks/Color/useColorQuery";
import useAttributeMutation from "../../../hooks/Attribute/useAttributeMutation";

const CreateProduct = () => {
  const { data: categories } = useCategoryQuery("GET_ALL_CATEGORY");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [publicIds, setPublicIds] = useState([]);
  const { data: sizes } = useSizeQuery("GET_ALL_SIZE");
  const { data: colors } = useColorQuery("GET_ALL_COLOR");
  const inputRef = useAutoFocus(open);

  const { mutate: createProduct } = useProductMutation({
    action: "CREATE",
    onSuccess: () => {
      form.resetFields();
      messageApi.success("Thêm sản phẩm thành công");
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi thêm sản phẩm: ${error.response.data.message}`);
      publicIds.map((publicId) => {
        console.log(publicId);
        deleteFileCloudinary(publicId);
      });
      setPublicIds([]);
    },
  });

  const handleImageDelete = () => {
    setImageUrl(null);
    form.setFieldsValue({ thumbnail: null });
  };

  const onFinish = async (values) => {
    const { attributes, ...data } = values;
    const thumbnail = await uploadFileCloudinary(data.thumbnail[0].thumbUrl);
    const productResponse = {
      ...data,
      thumbnail: thumbnail,
    };

    const attributesWithImages = await Promise.all(
      attributes.map(async (attribute) => {
        const imageUrl = await uploadFileCloudinary(
          attribute.image.fileList[0].thumbUrl
        );
        const publicId = extractPublicId(imageUrl);
        setPublicIds((prev) => [...prev, publicId]);
        
        return {
          ...attribute,
          image: imageUrl,
        };
      })
    );
    const finalData = {
      ...productResponse,
      product_att: attributesWithImages,
    };

    createProduct(finalData);
  };

  const columns = (remove, fields) => [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 150,
      render: (_, field) => (
        <Form.Item name={[field.name, "image"]}>
          <Upload
            maxCount={1}
            listType="picture-card"
            beforeUpload={() => false}
            className="avatar-uploader"
          >
            <div>
              <UploadOutlined className="text-2xl" />
              <div className="mt-2">Tải lên</div>
            </div>
          </Upload>
        </Form.Item>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      width: 200,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "color_id"]}
          rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
        >
          <Select
            showSearch
            placeholder="Chọn màu sắc"
            optionFilterProp="label"
            className="w-full"
            filterSort={(optionA, optionB) =>
              (optionA?.label?.toString() ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label?.toString() ?? "").toLowerCase())
            }
            options={colors?.map((color) => ({
              value: color.id,
              label: (
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  {color.name}
                </div>
              ),
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      width: 200,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "size_id"]}
          rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
        >
          <Select
            placeholder="Kích thước"
            options={sizes?.map((size) => ({
              value: size.id,
              label: size.name,
            }))}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock_quantity",
      width: 150,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "stock_quantity"]}
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber placeholder="Số lượng" min={0} className="w-full" />
        </Form.Item>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, field) =>
        fields.length > 1 ? (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(field.name)}
            className="flex items-center justify-center  mb-6"
          >
            Xóa
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="container mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-medium">Tạo sản phẩm mới</h1>
        <Link to="/admin/products">
          <Button className="text-base" type="primary">
            <RollbackOutlined /> Quay lại danh sách
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
          {/* Form product */}
          <Row gutter={30}>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên sản phẩm" },
                    ]}
                  >
                    <Input ref={inputRef} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Danh mục"
                    name="category_id"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn danh mục"
                      optionFilterProp="children"
                      options={categories?.data?.data?.map((category) => ({
                        value: category.id,
                        label: category.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="material"
                    label="Chất liệu"
                    rules={[
                      { required: true, message: "Vui lòng nhập chất liệu" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Giá gốc"
                    name="regular_price"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá gốc" },
                      {
                        validator: (_, value) =>
                          validateFieldNumber("giá gốc", value),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Giá khuyến mãi"
                    name="reduced_price"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập giá khuyến mãi",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="short_description"
                label="Mô tả ngắn"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả ngắn" },
                ]}
              >
                <Input.TextArea showCount maxLength={200} />
              </Form.Item>
              <Form.Item
                name="long_description"
                label="Mô tả chi tiết"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả chi tiết" },
                ]}
              >
                <Input.TextArea showCount maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Hình ảnh đại diện"
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
                    message: "Vui lòng tải lên hình ảnh đại diện",
                  },
                ]}
              >
                {imageUrl == null && (
                  <Upload.Dragger
                    accept=".jpg, .jpeg, .png, .gif"
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    onRemove={() => setImageUrl(null)}
                    previewFile={(file) => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          resolve(reader.result);
                          setImageUrl(reader.result);
                        };
                      });
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Kéo thả hoặc nhấn để tải lên
                    </p>
                  </Upload.Dragger>
                )}
                {imageUrl && (
                  <div className="relative w-60 h-80">
                    <img
                      src={imageUrl}
                      alt="Xem trước hình ảnh đại diện"
                      className="w-[18rem] h-[22rem] object-cover rounded-lg"
                    />
                    <button
                      onClick={handleImageDelete}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          Form Product Attribute
          <Row gutter={16} className="mt-8">
            <Col span={24}>
              <Form.List name="attributes" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    <Table
                      className="mb-4"
                      columns={columns(remove, fields)}
                      dataSource={fields}
                      pagination={false}
                      rowKey="key"
                      scroll={{ x: "max-content" }}
                      bordered
                      size="middle"
                    />
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        className="h-12 text-lg"
                      >
                        Thêm biến thể mới
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          {/* Button add product */}
          <div className="flex justify-end">
            <Form.Item>
              <Button type="primary" htmlType="submit" className="my-4">
                Thêm sản phẩm
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateProduct;
