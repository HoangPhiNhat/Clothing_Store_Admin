/* eslint-disable react/prop-types */
import {
  DeleteOutlined,
  DownOutlined,
  UploadOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import useColorQuery from "../../../../hooks/Color/useColorQuery";
import useSizeQuery from "../../../../hooks/Size/useSizeQuery";

const SizeColor = ({ form, variant, message }) => {
  const { data: sizes } = useSizeQuery("GET_ALL_SIZE");
  const { data: colors } = useColorQuery("GET_ALL_COLOR");
  const [expandedKeys, setExpandedKeys] = useState({});

  // Att
  // eslint-disable-next-line no-unused-vars
  const columns = (remove, fields) => [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 150,
      render: (_, field) => (
        <Form.Item
          name={[field.name, "image"]}
          rules={[
            () => ({
              validator(_, value) {
                console.log(value);
                if (!value || value.length || value.fileList.length === 0) {
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
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            { min: 0, type: "number", message: "Số lượng lớn hơn 0" },
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

  const toggleVisibility = (key) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Row gutter={16} className="mt-8">
        <Col span={24}>
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
                            <Form.Item
                              name={[name, "original_price"]}
                              label="Giá gốc"
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
                              <InputNumber
                                className="w-full"
                                placeholder="Giá gốc"
                              />
                            </Form.Item>
                            <Form.Item
                              name={[name, "sale_price"]}
                              label="Giá bán"
                              className="flex-1"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập giá bán",
                                },
                                {
                                  type: "number",
                                  min: 1,
                                  message: "Giá bán cần lớn hơn 1 đồng",
                                },
                              ]}
                            >
                              <InputNumber
                                className="w-full"
                                placeholder="Giá bán"
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
                          {variant === false ? (
                            <Form.List
                              name={[name, "sizes"]}
                              initialValue={[{}]}
                            >
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
                                              message:
                                                "Vui lòng chọn kích thước",
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
                                          name={[sizeName, "sku"]}
                                          label="SKU"
                                          fieldKey={[sizeFieldKey, "sku"]}
                                          className="flex-1"
                                        >
                                          <Input placeholder="SKU" />
                                        </Form.Item>
                                        <Form.Item
                                          name={[sizeName, "quantity"]}
                                          label="Số lượng"
                                          fieldKey={[sizeFieldKey, "quantity"]}
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
                          ) : null}
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
        </Col>
      </Row>
    </>
  );
};

export default SizeColor;
