import {
  DeleteOutlined,
  DownOutlined,
  UploadOutlined,
  UpOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Upload
} from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useAttributeMutation from "../../../hooks/Attribute/useAttributeMutation";
import useColorQuery from "../../../hooks/Color/useColorQuery";
import useSizeQuery from "../../../hooks/Size/useSizeQuery";
import {
  deleteFileCloudinary,
  extractPublicId,
  uploadFileCloudinary,
} from "../../../services/cloudinary";

const CreateAttribute = () => {
  const [isPending, setIsPending] = useState(false);
  const [form] = Form.useForm();
  const [publicIds, setPublicIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [expandedKeys, setExpandedKeys] = useState({});

  const toggleVisibility = (key) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const { id } = useParams();
  const { data: sizes } = useSizeQuery("GET_ALL_SIZE");
  const { data: colors } = useColorQuery("GET_ALL_COLOR");

  const { mutate: createAttribute, isPending: createPending } =
    useAttributeMutation({
      action: "CREATE",
      onSuccess: (data) => {
        messageApi.success(data.message);
        form.resetFields();
      },
      onError: (error) => {
        messageApi.error(
          `Lỗi khi thêm thuộc tính: ${error.response.data.message}`
        );
        publicIds.map((publicId) => {
          deleteFileCloudinary(publicId);
        });
        setPublicIds([]);
        console.log(publicIds);
        
      },
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });

  const onFinish = async (values) => {
    try {
      setIsPending(true);

      const attributesWithImages = await Promise.all(
        values.attributes.map(async (attribute) => {
          if (attribute?.image?.fileList[0]?.thumbUrl) {
            const imageUrl = await uploadFileCloudinary(
              attribute.image.fileList[0].thumbUrl
            );
            const publicId = extractPublicId(imageUrl);
            setPublicIds((prev) => [...prev, publicId]);

            return {
              ...attribute,
              image: imageUrl,
            };
          } else {
            return attribute;
          }
        })
      );
console.log(publicIds);

      const finalData = { productId: id, attributes: attributesWithImages };

      // Gọi mutation để tạo attribute
      await createAttribute(finalData);
      console.log(finalData);
    } catch (error) {
      console.error("Error:", error);
      
    } finally {
      setIsPending(false); // Hoàn thành quá trình, kích hoạt lại modal
    }
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm thuộc tính
      </Button>
      <Modal
        width={1400}
        open={open}
        title="Thêm thuộc tính"
        okText="Thêm thuộc tính"
        cancelText="Huỷ"
        style={{ top: 0 }}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          disabled: isPending | createPending,
          loading: isPending | createPending,
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
        <Card title="Thông tin chi tiết" className="mb-4" type="inner">
          <Form.List name="attributes" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} className="border p-4 mb-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-3">
                        <Button
                          type="text"
                          icon={
                            expandedKeys[key] ? (
                              <UpOutlined />
                            ) : (
                              <DownOutlined />
                            )
                          }
                          onClick={() => toggleVisibility(key)}
                        />
                        Màu sắc {name + 1}
                      </span>
                      <div className="space-x-2">
                        {fields.length > 1 ? (
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="text-red-500"
                          />
                        ) : null}
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {expandedKeys[key] && (
                      <div>
                        <div className="flex space-x-4 mt-2">
                          <Form.Item
                            label="Màu sắc"
                            className="flex-1"
                            name={[name, "color_id"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn màu sắc",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Chọn màu sắc"
                              optionFilterProp="label"
                              className="w-full"
                              filterSort={(optionA, optionB) =>
                                (optionA?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .localeCompare(
                                    (
                                      optionB?.label?.toString() ?? ""
                                    ).toLowerCase()
                                  )
                              }
                              options={colors?.map((color) => ({
                                value: color.id,
                                label: (
                                  <div className="flex items-center">
                                    <div
                                      className="w-4 h-4 rounded-full mr-2"
                                      style={{
                                        backgroundColor: color.hex,
                                      }}
                                    ></div>
                                    {color.name}
                                  </div>
                                ),
                              }))}
                            />
                          </Form.Item>
                        </div>

                        {/* Image Upload Section */}
                        <Form.Item
                          name={[name, "image"]}
                          rules={[
                            () => ({
                              validator(_, value) {
                                console.log(value);
                                if (
                                  !value ||
                                  value.length ||
                                  value.fileList.length === 0
                                ) {
                                  return Promise.reject(
                                    new Error("Vui lòng thêm ảnh biến thể")
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
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
                                form.setFieldValue([name, "image"], []);
                              } else {
                                form.setFieldValue([name, "image"], fileList);
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

                        {/* Size Section */}
                        <Form.List name={[name, "sizes"]} initialValue={[{}]}>
                          {(
                            sizeFields,
                            { add: addSize, remove: removeSize }
                          ) => (
                            <>
                              {sizeFields.map(
                                ({
                                  key: sizeKey,
                                  name: sizeName,
                                  fieldKey: sizeFieldKey,
                                }) => (
                                  <div
                                    key={sizeKey}
                                    className="flex space-x-4 mb-2"
                                  >
                                    <Form.Item
                                      label="Kích thước"
                                      className="flex-1"
                                      name={[sizeName, "size_id"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Vui lòng chọn kích thước",
                                        },
                                      ]}
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
                                    <Form.Item
                                      name={[sizeName, "stock_quantity"]}
                                      label="Số lượng"
                                      fieldKey={[
                                        sizeFieldKey,
                                        "stock_quantity",
                                      ]}
                                      className="flex-1"
                                    >
                                      <InputNumber
                                        className="w-full"
                                        placeholder="Số lượng"
                                      />
                                    </Form.Item>
                                    {sizeFields.length > 1 ? (
                                      <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeSize(sizeName)}
                                        className="self-center text-red-500"
                                      />
                                    ) : null}
                                  </div>
                                )
                              )}
                              <Button
                                type="dashed"
                                onClick={() => addSize()}
                                block
                                className="mb-2"
                              >
                                + Thêm kích cỡ
                              </Button>
                            </>
                          )}
                        </Form.List>
                      </div>
                    )}
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm màu sắc mới
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* <Form.List name="attributes" initialValue={[{}]}>
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
                  disabled={isPending | createPending}
                >
                  Thêm biến thể mới
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List> */}
      </Modal>
    </>
  );
};

export default CreateAttribute;
