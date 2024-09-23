import {
  DeleteOutlined,
  RollbackOutlined,
  UploadOutlined
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
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import useProductQuery from "../../../hooks/Product/useProductQuery";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";
import { validateFieldNumber } from "../../../validations/Product";

const UpdateProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [newpublicId, setNewPublicId] = useState(null);

  const { id } = useParams();
  const { data: categories } = useCategoryQuery("GET_ALL_CATEGORY_FOR_PRODUCT");

  const { data: product } = useProductQuery("GET_PRODUCT_BY_ID", id, null);
  const { mutate: updateProduct, isPending } = useProductMutation({
    action: "UPDATE",
    onSuccess: (data) => {
      if (publicId) {
        deleteFileCloudinary(publicId);
      }
      form.resetFields();
      messageApi.success(data.message);
    },
    onError: (error) => {
      messageApi.error(`Lỗi khi sửa sản phẩm: ${error.response.data.message}`);
      if (newpublicId) {
        deleteFileCloudinary(newpublicId);
      }
    },
  });

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
      setImageUrl(product.thumbnail);
      setPreviewImage(product.thumbnail);
    }
  }, [form, product]);

  const onFinish = async (values) => {
    let image = imageUrl
    setPreviewImage(values.thumbnail[0].thumbUrl);
    if (values.thumbnail[0].uid !== "-1") {
      image = await uploadFileCloudinary(values.thumbnail[0].thumbUrl);
      setImageUrl(image);
      setPublicId(extractPublicId(product.thumbnail));
      setNewPublicId(extractPublicId(image));
    }
    updateProduct({ ...values, id: id, thumbnail: image });
  };

  const onFinishFailed = (values) => {
    console.log(values);
    setPreviewImage(values.thumbnail[0].thumbUrl);
  };

  const handleImageDelete = () => {
    setPreviewImage(null);
    setImageUrl(null);
    form.setFieldsValue({ thumbnail: null });
  };

  return (
    <div className="container mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-medium">Sửa sản phẩm</h1>
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
          onFinishFailed={onFinishFailed}
          initialValues={{ attributes: [{}] }}
        >
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
                    <Input />
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
                      options={categories?.data.map((category) => ({
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
                      {
                        validator: (_, value) =>
                          validateFieldNumber("giá gốc", value),
                      },
                    ]}
                  >
                    <InputNumber type="number" min={0} className="w-full" />
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
                    <InputNumber min={0} className="w-full" />
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
                {previewImage == null && (
                  <Upload.Dragger
                    accept=".jpg, .jpeg, .png, .gif"
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    // onRemove={() => setImageUrl(null)}
                    previewFile={(file) => {
                      return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                          resolve(reader.result);
                          setImageUrl(reader.result);
                          setPreviewImage(reader.result);
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
                {previewImage && (
                  <div className="relative w-60 h-80">
                    <img
                      src={previewImage}
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
          {/* Button add product */}
          <div className="flex justify-end">
            <Form.Item>
              <Button loading={isPending} type="primary" htmlType="submit" className="my-4">
                Cập nhật sản phẩm
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProduct;
