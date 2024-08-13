import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Upload,
} from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAttributeQuery from "../../hooks/Attribute/useAttributeQuery.jsx";
import useAttributeMutation from "../../hooks/Attribute/useAttributeMutation.jsx";
import CreateAttribute from "./_components/CreateAttribute.jsx";
import { deleteFileCloudinary, extractPublicId } from "../../services/cloudinary.js";

const ProductAttribute = () => {
  const { id } = useParams();
  const { data: attributes, isLoading, error } = useAttributeQuery(id);
  const [editingKey, setEditingKey] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [deletingAttributeId, setDeletingAttributeId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [publicId, setPublicId] = useState(null);

  const { mutate: deleteAttribute, isPending } = useAttributeMutation({
    action: "DELETE",
    onSuccess: (data) => {
      messageApi.success("Xóa thuộc tính thành công.");
      deleteFileCloudinary(publicId)
      setPublicId(null)
      console.log("Deleted attribute:", data);
    },
    onError: (error) =>
      message.error("Xóa thuộc tính thất bại: " + error.response.data.message),
  });

  const { mutate: updateAttribute } = useAttributeMutation({
    action: "UPDATE",
    onSuccess: (data) => {
      messageApi.success("Sửa thuộc tính thành công.");
      console.log("Updated attribute:", data);
    },
    onError: (error) =>
      message.error("Sửa thuộc tính thất bại: " + error.response.data.message),
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const isEditing = (key) => key === editingKey;

  const edit = (attribute) => {
    setEditingKey(attribute.key);
    console.log(attribute);
    setEditingData(attribute);
    console.log(attribute);
  };

  const cancel = () => {
    setEditingKey(null);
    setEditingData({});
  };

  
  const save = () => {

    setEditingKey(null);
    messageApi.success("Lưu thuộc tính thành công.");
    console.log("Updated attribute:", editingData);
    
    // updateAttribute({
    //   productId: id,
    //   attributeId: editingData.id,
    //   attribute: editingData,
    // });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      rowScope: "row",
      width: "5%",
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "15%",
      render: (_, attribute) => {
        if (isEditing(attribute.key)) {
          return (
            <Upload
              maxCount={1}
              listType="picture-card"
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setEditingData({ ...editingData, image: e.target.result });
                };
                reader.readAsDataURL(file);
                return false;
              }}
            >
              <div>
                <UploadOutlined className="text-2xl" />
                <div className="mt-2">Tải lên</div>
              </div>
            </Upload>
          );
        }
        return <img className="w-20" src={attribute.image} alt="" />;
      },
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "15%",
      render: (color) => <>{color.name}</>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: "15%",
      render: (size) => <>{size.name}</>,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: "15%",
      render: (_, attribute) => {
        if (isEditing(attribute.key)) {
          return (
            <Input
              value={editingData.stock_quantity}
              onChange={(e) =>
                setEditingData({
                  ...editingData,
                  stock_quantity: e.target.value,
                })
              }
            />
          );
        }
        return attribute.stock_quantity;
      },
    },
    {
      title: "Action",
      key: "operation",
      width: "10%",
      render: (_, attribute) => {
        const editable = isEditing(attribute.key);
        return editable ? (
          <Space size="small">
            <Button type="default" onClick={save} className="bg-[#4CAF50]">
              <SaveOutlined />
            </Button>
            <Button type="default" onClick={cancel} className="bg-[#FF5252]">
              <CloseOutlined />
            </Button>
          </Space>
        ) : (
          <Space size="small">
            <Button
              disabled={deletingAttributeId === attribute.id}
              type="default"
              onClick={() => edit(attribute)}
              className="bg-[#fadd04]"
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              onConfirm={() => {
                setDeletingAttributeId(attribute.id);
                setPublicId(extractPublicId(attribute.image));
                deleteAttribute({ productId: id, attributeId: attribute.id });
              }}
              title="Delete attribute"
              description="Do you want to delete this attribute?"
              okText="Yes"
              cancelText="No"
            >
              <Button loading={isPending} type="primary" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const dataSource = attributes.map((attribute, index) => ({
    ...attribute,
    key: index + 1,
    index: index + 1,
  }));

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-medium ">Các thuộc tính của sản phẩm</h1>
        <CreateAttribute />
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Pagination
        className="mt-4"
        align="end"
        total={attributes.length}
        showSizeChanger
        showQuickJumper
        onShowSizeChange={(current, size) => {
          console.log(`Page Size: ${size}`);
        }}
      />
    </>
  );
};

export default ProductAttribute;
