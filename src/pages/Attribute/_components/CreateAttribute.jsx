import React, { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Table,
  Select,
  Upload,
  InputNumber,
  Col,
  Row,
  message,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useAttributeMutation from "../../../hooks/Attribute/useAttributeMutation";
import { useParams } from "react-router-dom";
import { createAttribute } from "../../../services/productAttribute";
import useSizeQuery from "../../../hooks/Size/useSizeQuery";
import useColorQuery from "../../../hooks/Color/useColorQuery";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";

const CreateAttribute = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [publicIds, setPublicIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: sizes } = useSizeQuery("GET_ALL_SIZE");
  const { data: colors } = useColorQuery("GET_ALL_COLOR");

  const { mutate: createAttribute } = useAttributeMutation({
    action: "CREATE",
    onSuccess: (data) => {
      messageApi.success("Thêm thuộc tính thành công.");
      console.log("Added attribute:", data);
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error(
        `Lỗi khi thêm thuộc tính: ${error.response.data.message}`
      );
      publicIds.map((publicId) => {
        console.log(publicId);
        deleteFileCloudinary(publicId);
      });
      setPublicIds([]);
    },
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  const onFinish = async (values) => {
    try {
      const attributesWithImages = await Promise.all(
        values.attributes.map(async (attribute) => {
          const imageUrl = await uploadFileCloudinary(
            attribute.image.fileList[0].thumbUrl
          );
          console.log(imageUrl);
          const publicId = extractPublicId(imageUrl);
          setPublicIds((prev) => [...prev, publicId]);
          return {
            ...attribute,
            image: imageUrl,
          };
        })
      );

      const finalData = { productId: id, attributes: attributesWithImages };
      console.log(finalData);
      createAttribute(finalData);
    } catch (error) {
      console.log(error);
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
          rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
        >
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
      dataIndex: "color_id",
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
      dataIndex: "size_id",
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
            className="flex items-center justify-center mb-6"
          >
            Xóa
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        New Collection
      </Button>
      <Modal
        width={1400}
        open={open}
        title="Thêm thuộc tính"
        okText="Create"
        cancelText="Cancel"
        style={{ top: 0 }}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Row gutter={16} className="mt-8">
            <Col span={24}>
              <Form
                layout="vertical"
                form={form}
                name="form_in_modal"
                initialValues={{
                  modifier: "public",
                }}
                clearOnDestroy
                onFinish={(values) => onFinish(values)}
              >
                {dom}
              </Form>
            </Col>
          </Row>
        )}
      >
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
      </Modal>
    </>
  );
};

export default CreateAttribute;
