import {
  DeleteOutlined,
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
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../components/base/Loading/Loading";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import useProductMutation from "../../../hooks/Product/useProductMutation";
import useProductQuery from "../../../hooks/Product/useProductQuery";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";

const UpdateProduct = () => {
  const [isPending, setIsPending] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [newpublicId, setNewPublicId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [productName, setProductName] = useState(null);

  const { id } = useParams();

  const { data: categories, isLoading: isLoadingCategory } = useCategoryQuery(
    "GET_ALL_CATEGORY_FOR_PRODUCT"
  );

  const { data: product, isLoading: isLoadingProduct } = useProductQuery(
    "GET_PRODUCT_BY_ID",
    id,
    null
  );

  const { mutate: updateProduct, isPending: updatePending } =
    useProductMutation({
      action: "UPDATE",
      onSuccess: (data) => {
        if (publicId) {
          deleteFileCloudinary(publicId);
        }

        console.log(data.message);
        messageApi.success("Cập nhật sản phẩm thành công.");
      },
      onError: (error) => {
        messageApi.error(
          `Lỗi khi sửa sản phẩm: ${error.response.data.message}`
        );
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
      setProductName(product.name);
    }
  }, [form, product]);

  const onFinish = async (values) => {
    try {
      setIsPending(true);
      let image = imageUrl;
      setPreviewImage(values.thumbnail[0].thumbUrl);
      if (values.thumbnail[0].uid !== "-1") {
        image = await uploadFileCloudinary(values.thumbnail[0].thumbUrl);
        setImageUrl(image);
        setPublicId(extractPublicId(product.thumbnail));
        setNewPublicId(extractPublicId(image));
      }

      updateProduct({ ...values, id: id, thumbnail: image });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const onFinishFailed = (values) => {
    console.log(values);
    setPreviewImage(values.thumbnail[0].thumbUrl);
    setIsPending(false);
  };

  const handleImageDelete = () => {
    setPreviewImage(null);
    setImageUrl(null);
    form.setFieldsValue({ thumbnail: null });
  };

  if (isLoadingCategory || isLoadingProduct) return <Loading />;

  return (
    <>
      {contextHolder}
      <div className="container mx-auto">
        <Breadcrumb
          items={[
            {
              title: "Trang chủ",
            },
            {
              title: <a href="">Cập nhật sản phẩm</a>,
            },
            {
              title: <a href="">{productName}</a>,
            },
          ]}
        />
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-medium">Cập nhật sản phẩm</h1>
          <Link to="/admin/products">
            <Button
              disabled={isPending || updatePending}
              className="text-base"
              type="primary"
            >
              <RollbackOutlined /> Quay lại danh sách
            </Button>
          </Link>
        </div>

        <div>
          <Form
            disabled={isPending | updatePending}
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
                        {
                          required: true,
                          message: "Vui lòng nhập tên sản phẩm",
                        },
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
                          min: 1,
                          type: "number",
                          message: "Giá bán lớn hơn 0",
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
                            if (!regularPrice) {
                              return Promise.reject(
                                "Vui lòng nhập giá bán trước"
                              );
                            }
                            if (Number(value) < 0) {
                              return Promise.reject(
                                "Giá khuyến mãi phải lớn hơn 0"
                              );
                            }
                            if (
                              Number(value) &&
                              regularPrice <= Number(value)
                            ) {
                              return Promise.reject(
                                "Giá khuyến mãi phải thấp hơn giá bán"
                              );
                            }
                            if (Number(value) > 99999999) {
                              return Promise.reject(
                                "Giá khuyến mãi phải hơn 99.9 triệu"
                              );
                            }
                            if (
                              Number(value) &&
                              regularPrice <= Number(value)
                            ) {
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
                {/* <Form.Item
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
                </Form.Item> */}
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
                      disabled={isPending || updatePending}
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
                    <div className="relative w-fit">
                      <img
                        src={previewImage}
                        alt="Xem trước hình ảnh đại diện"
                        className="min-w-[352px] h-[352px] object-cover rounded-lg"
                      />
                      <button
                        disabled={isPending || updatePending}
                        onClick={handleImageDelete}
                        className={`absolute top-0 right-0 bg-red-500 text-white m-3 p-2 rounded-full ${
                          isPending || updatePending
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-red-600 transition-colors"
                        }`}
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
                <Button
                  disabled={isPending | updatePending}
                  loading={isPending | updatePending}
                  type="primary"
                  htmlType="submit"
                  className="my-4"
                >
                  Cập nhật sản phẩm
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
