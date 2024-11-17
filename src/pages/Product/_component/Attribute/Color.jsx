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
  InputNumber,
  Row,
  Select,
  Upload,
} from "antd";

import { useState } from "react";

import useColorQuery from "../../../../hooks/Color/useColorQuery";

const Color = ({ form, message }) => {
  const { data: colors } = useColorQuery("GET_ALL_COLOR");
  const [expandedKeys, setExpandedKeys] = useState({});

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

export default Color;
