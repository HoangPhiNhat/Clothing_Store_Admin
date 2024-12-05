import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  InputNumber,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAttributeQuery from "../../hooks/Attribute/useAttributeQuery.jsx";
import useAttributeMutation from "../../hooks/Attribute/useAttributeMutation.jsx";
import CreateAttribute from "./_components/CreateAttribute.jsx";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../services/cloudinary.js";
import { useForm } from "antd/es/form/Form.js";
import Loading from "../../components/base/Loading/Loading.jsx";
import { formatMoney } from "../../systems/utils/formatMoney.js";
import useProductQuery from "../../hooks/Product/useProductQuery.jsx";

const ProductAttribute = () => {
  const [isPending, setIsPending] = useState(false);
  const [form] = useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [deletingAttributeId, setDeletingAttributeId] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasChanged, setHasChanged] = useState(false);
  const { id } = useParams();
  const { data: attributes, isLoading } = useAttributeQuery(id, page, pageSize);
  const { data: product } = useProductQuery(
    "GET_PRODUCT_BY_ID",
    id,
    null,
    null
  );
  console.log(attributes);
  console.log(product);

  const { mutate: deleteAttribute } = useAttributeMutation({
    action: "DELETE",
    onSuccess: (data) => {
      messageApi.success(data.message);
      if (publicId) {
        deleteFileCloudinary(publicId);
        setPublicId(null);
      }
    },
    onError: (error) =>
      message.error("Xóa thuộc tính thất bại: " + error.response.data.message),
  });

  const { mutate: updateAttribute, isPending: updatePending } =
    useAttributeMutation({
      action: "UPDATE",
      onSuccess: (data) => {
        messageApi.success(data.message);
      },
      onError: (error) =>
        message.error(
          "Sửa thuộc tính thất bại: " + error.response.data.message
        ),
    });

  useEffect(() => {
    if (editingKey !== null) {
      form.setFieldsValue({
        ...editingData,
        stock_quantity: editingData.stock_quantity,
      });
      setFileList(
        editingData.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: editingData.image,
              },
            ]
          : []
      );
    }
    if (editingData.image) {
      setPublicId(extractPublicId(editingData.image));
    }
    setHasChanged(false);
  }, [form, editingData, editingKey]);

  const isEditing = (key) => key === editingKey;

  const edit = (attribute) => {
    console.log(attribute);

    setEditingKey(attribute.key);
    setEditingData(attribute);
    console.log(editingData);
  };

  const cancel = () => {
    setPublicId(null);
    setEditingKey(null);
    setEditingData({});
  };

  const save = async () => {
    try {
      setIsPending(true);
      const values = await form.validateFields();
      console.log(values);

      if (!hasChanged) {
        message.info("Không có thay đổi.");
        setEditingKey(null);
        setIsPending(false);
        return;
      }

      let image = editingData.image;

      if (fileList.length === 0 && publicId) {
        await deleteFileCloudinary(publicId);
        image = "";
      } else if (fileList[0]?.uid !== "-1" && values.image) {
        if (publicId) {
          await deleteFileCloudinary(publicId);
        }
        image = await uploadFileCloudinary(fileList[0]?.originFileObj);
      }

      updateAttribute({
        productId: id,
        attributeId: editingData.id,
        attribute: { ...values, image },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEditingKey(null);
      setHasChanged(false);
      setIsPending(false);
    }
  };

  const handleFieldChange = () => {
    setHasChanged(true);
  };

  const columns = [
    {
      title: "# ",
      dataIndex: "index",
      rowScope: "row",
      width: "5%",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "sku",
      key: "sku",
      width: "10%",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (_, attribute) => {
        return isEditing(attribute.key) ? (
          <Form.Item name="image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              maxCount={1}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: !isPending,
                showDownloadIcon: false,
              }}
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
                setFileList(fileList.slice(0, 1));
                setHasChanged(true);
              }}
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
                <UploadOutlined className="text-2xl" />
                <div className="mt-2">Tải lên</div>
              </div>
            </Upload>
          </Form.Item>
        ) : (
          <img className="w-20" src={attribute.image} alt="" />
        );
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "color_name",
      key: "color",
      width: "15%",
      render: (color) => <>{color}</>,
    },
    {
      title: "Kích thước",
      dataIndex: "size_name",
      key: "size",
      width: "15%",
      render: (size) => <>{size}</>,
    },
    {
      title: "Giá bán",
      dataIndex: "regular_price",
      key: "regular_price",
      width: "10%",
      render: (_, attribute) =>
        isEditing(attribute.key) ? (
          <Form.Item
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              { min: 1, type: "number", message: "Giá lớn hơn 0" },
            ]}
            name="regular_price"
          >
            <InputNumber className="w-full" onChange={handleFieldChange} />
          </Form.Item>
        ) : (
          <div>{formatMoney(attribute.regular_price)}đ</div>
        ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "reduced_price",
      key: "reduced_price",
      width: "10%",
      render: (_, attribute) =>
        isEditing(attribute.key) ? (
          <Form.Item
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const regularPrice = getFieldValue("regular_price");
                  if (!regularPrice) {
                    return Promise.reject("Vui lòng nhập giá gốc trước");
                  }
                  if (Number(value) < 0) {
                    return Promise.reject("Giá khuyến mãi phải lớn hơn 0");
                  }
                  if (Number(value) && regularPrice <= Number(value)) {
                    return Promise.reject(
                      "Giá khuyến mãi phải thấp hơn giá gốc"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            name="reduced_price"
          >
            <InputNumber className="w-full" onChange={handleFieldChange} />
          </Form.Item>
        ) : (
          <div>{formatMoney(attribute.reduced_price)}đ</div>
        ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: "10%",
      render: (_, attribute) =>
        isEditing(attribute.key) ? (
          <Form.Item
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              { min: 0, type: "number", message: "Số lượng lớn hơn 0" },
            ]}
            name="stock_quantity"
          >
            <InputNumber className="w-full" onChange={handleFieldChange} />
          </Form.Item>
        ) : (
          <span>{attribute.stock_quantity}</span>
        ),
    },
    {
      title: "Hành động",
      key: "operation",
      width: "10%",
      render: (_, attribute) => {
        const editable = isEditing(attribute.key);
        return editable ? (
          <Form.Item>
            <Space size="small">
              <Button
                loading={isPending}
                disabled={isPending}
                type="default"
                htmlType="submit"
                className="bg-[#4CAF50]"
              >
                <SaveOutlined />
              </Button>
              <Button
                type="default"
                disabled={isPending}
                onClick={cancel}
                className="bg-[#FF5252]"
              >
                <CloseOutlined />
              </Button>
            </Space>
          </Form.Item>
        ) : (
          <Space size="small">
            <Button
              disabled={deletingAttributeId === attribute.id}
              type="default"
              onClick={() => {
                edit(attribute);
                console.log(attribute);
              }}
              className="bg-[#fadd04]"
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              onConfirm={() => {
                console.log(attribute.id);

                setDeletingAttributeId(attribute.id);
                deleteAttribute({ productId: id, attributeId: attribute.id });
                if (attribute.image) {
                  setPublicId(extractPublicId(attribute.image));
                }
              }}
              title="Xoá biến thể"
              description="Bạn có muốn xoá biến thể này không ?"
              okText="Có"
              cancelText="Không"
            >
              <Button
                disabled={updatePending | isPending}
                type="primary"
                danger
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const dataSource = attributes?.map((attribute, index) => ({
    ...attribute,
    key: index + 1,
    index: index + 1,
  }));
  if (isLoading) return <Loading />;

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <div>
          <Breadcrumb
            items={[
              {
                title: "Trang chủ",
              },
              {
                title: <a href="/admin/products">Danh sách thuộc tính</a>,
              },
              {
                title: `${product?.name}`,
              },
            ]}
          />
          <h1 className="text-2xl font-medium">Các thuộc tính của sản phẩm</h1>
        </div>
        <CreateAttribute />
      </div>
      <Form form={form} onFinish={save}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowClassName="custom-row-height"
        />
      </Form>
      <Pagination
        showSizeChanger
        current={page}
        pageSize={pageSize}
        onChange={(page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        }}
        total={attributes?.total}
        align="end"
      />
    </>
  );
};

export default ProductAttribute;
