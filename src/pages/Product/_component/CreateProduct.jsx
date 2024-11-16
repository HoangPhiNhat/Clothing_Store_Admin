/* eslint-disable no-unused-vars */
import {
  DeleteOutlined,
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
  Upload,
} from "antd";

import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../components/base/Loading/Loading";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useAutoFocus from "../../../hooks/customHook/useAutoFocus";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";

import SizeColor from "./Attribute/SizeColor";

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

  const { mutate: createProduct, isPending: createPending } =
    useProductMutation({
      action: "CREATE",
      onSuccess: (data) => {
        setImageUrl(null);
        form.resetFields();
        messageApi.success(data.message);
      },
      onError: (error) => {
        messageApi.error(
          `Lỗi khi thêm sản phẩm: ${error.response.data.message}`
        );
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

      setPublicIds((prev) => [...prev, publicIdProduct]);

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
      console.log(finalData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleImageDelete = () => {
    setImageUrl(null);
    form.setFieldsValue({ thumbnail: null });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-medium">Thông tin sản phẩm</h2>
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
        >
          {/* Form product */}
          <Row gutter={30}>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
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
                  <Form.Item
                    name="regular_price"
                    label="Giá bán"
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập giá gốc",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Giá gốc cần lớn hơn 0 đồng",
                      },
                    ]}
                  >
                    <InputNumber className="w-full" placeholder="Giá gốc" />
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

          {/* Attribute */}
          <SizeColor form={form} message={message} />

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
