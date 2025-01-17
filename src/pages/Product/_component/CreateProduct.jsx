/* eslint-disable no-unused-vars */
import {
  DeleteOutlined,
  PlusOutlined,
  RollbackOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Breadcrumb,
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
import useColorQuery from "../../../hooks/Color/useColorQuery";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import useSizeQuery from "../../../hooks/Size/useSizeQuery";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";
import Loading from "../../../components/base/Loading/Loading";

const CreateProduct = () => {
  const [isPending, setIsPending] = useState(false);
  const inputRef = useAutoFocus(open);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [publicIds, setPublicIds] = useState([]);

  const { data: categories, isLoading } = useCategoryQuery(
    "GET_ALL_CATEGORY_FOR_PRODUCT"
  );

  const { data: sizes } = useSizeQuery("GET_ALL_SIZE");
  const { data: colors } = useColorQuery("GET_ALL_COLOR");
  const { mutate: createProduct } = useProductMutation({
    action: "CREATE",
    onSuccess: (data) => {
      setImageUrl(null);
      form.resetFields();
      messageApi.success(data.message);
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi thêm sản phẩm: ${error.response.data.message}`);
      publicIds.map((publicId) => {
        deleteFileCloudinary(publicId);
      });
      setPublicIds([]);
    },
  });

  const onFinish = async (values) => {
    try {
      setIsPending(true);
      const { attributes, ...data } = values;
      const thumbnail = await uploadFileCloudinary(data.thumbnail[0].thumbUrl);
      const productResponse = {
        ...data,
        thumbnail: thumbnail,
      };
      const publicIdProduct = extractPublicId(thumbnail);
      console.log(publicIdProduct);

      setPublicIds((prev) => [...prev, publicIdProduct]);
      console.log(attributes);

      const attributesWithImages = await Promise.all(
        attributes.map(async (attribute) => {
          if (attribute?.image?.fileList[0]?.thumbUrl) {
            const imageUrl = await uploadFileCloudinary(
              attribute?.image?.fileList[0].thumbUrl
            );
            const publicIdAttrbutes = extractPublicId(imageUrl);
            setPublicIds((prev) => [...prev, publicIdAttrbutes]);
            return {
              ...attribute,
              image: imageUrl,
            };
          }

          return attribute;
        })
      );
      const finalData = {
        ...productResponse,
        product_att: attributesWithImages,
      };

      createProduct(finalData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const columns = (remove, fields) => [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 150,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "image"]}
          rules={[
            {
              required: true,
              message: "Vui lòng tải lên hình ảnh thuộc tính",
            },
          ]}
        >
          <Upload
            maxCount={1}
            listType="picture-card"
            accept=".jpg, .jpeg, .png"
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
            onChange={({ fileList }) => {
              if (fileList.length === 0) {
                form.setFieldValue([field.name, "image"], []);
              } else {
                form.setFieldValue([field.name, "image"], fileList);
              }
            }}
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
      width: 150,
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
      width: 150,
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
      title: "Giá bán",
      dataIndex: "regular_price",
      width: 150,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "regular_price"]}
          rules={[
            { required: true, message: "Vui lòng nhập giá bán" },
            { min: 0, type: "number", message: "Giá bán lớn hơn 0" },
            {
              max: 99999999,
              type: "number",
              message: "Giá bán nhỏ hơn 99.9 triệu",
            },
          ]}
        >
          <InputNumber type="number" placeholder="Giá bán" className="w-full" />
        </Form.Item>
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "reduced_price",
      width: 150,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "reduced_price"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                // Lấy toàn bộ giá trị của các thuộc tính
                const fields = getFieldValue("attributes") || [];
                const currentField = fields[field.name];
                const regularPrice = currentField?.regular_price; // Giá bán của dòng hiện tại

                if (!regularPrice) {
                  return Promise.reject("Vui lòng nhập giá bán trước");
                }
                if (value === undefined || value === null) {
                  return Promise.reject("Vui lòng nhập giá trị hợp lệ");
                }
                if (value < 0) {
                  return Promise.reject("Giá khuyến mãi phải lớn hơn 0");
                }
                if (value > 99999999) {
                  return Promise.reject("Giá khuyến mãi nhỏ hơn 99.9 triệu");
                }
                if (value >= regularPrice) {
                  return Promise.reject("Giá khuyến mãi phải thấp hơn giá bán");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber
            type="number"
            placeholder="Giá Khuyến mãi"
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
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            { min: 1, type: "number", message: "Số lượng lớn hơn 0" },
            {
              max: 4999,
              type: "number",
              message: "Số lượng nhỏ hơn 4.9 nghìn",
            },
          ]}
        >
          <InputNumber
            type="number"
            placeholder="Số lượng"
            className="w-full"
          />
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

  const handleImageDelete = () => {
    setImageUrl(null);
    form.setFieldsValue({ thumbnail: null });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Thêm sản phẩm</a>,
          },
        ]}
      />
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-medium">Tạo sản phẩm mới</h1>
        <Link to="/admin/products">
          <Button disabled={isPending} className="text-base" type="primary">
            <RollbackOutlined /> Quay lại danh sách
          </Button>
        </Link>
      </div>

      <div>
        <Form
          disabled={isPending}
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ attributes: [{}] }}
          onValuesChange={(changedValues, allValues) => {
            console.log("Tất cả giá trị:", allValues);
          }}
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
                    <Input ref={inputRef} placeholder="Nhập tên" />
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
                      options={categories?.data?.map((category) => ({
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
                    <Input placeholder="Nhập chất liệu" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Giá bán"
                    name="regular_price"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá bán" },
                      {
                        type: "number",
                        min: 1,
                        message: "Giá bán cần lớn hơn 1 đồng",
                      },
                      {
                        max: 99999999,
                        type: "number",
                        message: "Giá bán nhỏ hơn 99.9 triệu",
                      },
                    ]}
                  >
                    <InputNumber
                      type="number"
                      className="w-full"
                      placeholder="Nhập giá bán"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Giá khuyến mãi"
                    name="reduced_price"
                    dependencies={["regular_price"]}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const regularPrice = getFieldValue("regular_price");
                          if (
                            regularPrice === undefined ||
                            regularPrice === null
                          ) {
                            return Promise.reject(
                              "Vui lòng nhập giá bán trước"
                            );
                          }
                          if (Number(value) < 0) {
                            return Promise.reject(
                              "Giá khuyến mãi phải lớn hơn 0"
                            );
                          }
                          if (Number(value) && regularPrice <= Number(value)) {
                            return Promise.reject(
                              "Giá khuyến mãi phải thấp hơn giá bán"
                            );
                          }
                          if (Number(value) > 99999999) {
                            return Promise.reject(
                              "Giá khuyến mãi phải hơn 99.9 triệu"
                            );
                          }
                          if (Number(value) && regularPrice <= Number(value)) {
                            return Promise.reject(
                              "Giá khuyến mãi phải thấp hơn giá bán"
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      type="number"
                      placeholder="Nhập giá khuyến mãi"
                      className="w-full"
                    />
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
                <Input.TextArea
                  showCount
                  maxLength={200}
                  placeholder="Nhập giá mô tả ngắn"
                />
              </Form.Item>
              <Form.Item
                name="long_description"
                label="Mô tả chi tiết"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả chi tiết" },
                ]}
              >
                <Input.TextArea
                  showCount
                  maxLength={200}
                  placeholder="Nhập giá mô tả chi tiết"
                />
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
                  <div className="relative w-fit">
                    <img
                      src={imageUrl}
                      alt="Xem trước hình ảnh đại diện"
                      className="min-w-[352px] h-[352px] object-cover rounded-lg"
                    />
                    <button
                      onClick={handleImageDelete}
                      className="absolute top-0 right-0 bg-red-500 text-white m-3 p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          Thêm thuộc tính
          <Row gutter={16} className="mt-8">
            <Col span={24}>
              <Form.List name="attributes" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    <Table
                      className="mb-4"
                      columns={columns(remove, fields, form)}
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
              <Button
                loading={isPending}
                disabled={isPending}
                type="primary"
                htmlType="submit"
                className="my-4"
              >
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
