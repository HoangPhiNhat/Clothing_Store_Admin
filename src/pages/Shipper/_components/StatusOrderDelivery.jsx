/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Form, Input, message, Modal, Upload } from "antd";
import useShippperMutation from "../../../hooks/Shipper/useShipperMutation";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { uploadFileCloudinary } from "../../../services/cloudinary";

const StatusOrderDelivery = ({ open, onCancel, status, deliveryId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingUploadImg, seLoadingUploadImg] = useState(false);

  const { mutate: deliverySuccess, isPending: isPendingDeliverySuccess } =
    useShippperMutation({
      action: "DELIVERY_SUCCESS",
      onSuccess: () => {
        onCancel();
        messageApi.success("Hoàn thành đơn hàng thành công.");
      },
      onError: (error) => {
        onCancel();
        messageApi.error("Hoàn thành đơn hàng thất bại.");
        console.log(error);
      },
    });

  const { mutate: deliveryFail, isPending: isPendingDeliveryFail } =
    useShippperMutation({
      action: "DELIVERY_FAIL",
      onSuccess: () => {
        onCancel();
        messageApi.success("Trả hàng thành công.");
      },
      onError: (error) => {
        onCancel();
        messageApi.error("Trả hàng thất bại.");
        console.log(error);
      },
    });

  const onFinish = async (values) => {
    if (status == "success") {
      seLoadingUploadImg(true);
      const thumbnail = await uploadFileCloudinary(
        values.thumbnail[0].thumbUrl
      );
      seLoadingUploadImg(false);
      deliverySuccess({ id: deliveryId, image: thumbnail });
    } else if (status == "fail") {
      deliveryFail({ id: deliveryId, note: values.note });
    }
  };

  const handleImageDelete = () => {
    setImageUrl(null);
    form.setFieldsValue({ thumbnail: null });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          status == "success"
            ? "Thêm ảnh để hoàn thành đơn hàng"
            : "Lí do trả hàng"
        }
        open={open}
        onCancel={onCancel}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              onCancel();
              form.resetFields();
            }}
            disabled={
              loadingUploadImg ||
              isPendingDeliverySuccess ||
              isPendingDeliveryFail
            }
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            loading={
              loadingUploadImg ||
              isPendingDeliverySuccess ||
              isPendingDeliveryFail
            }
          >
            Thêm
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Fail */}
          {status == "fail" && (
            <Form.Item
              className="w-full"
              name="note"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lí do trả hàng!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          {/* Success */}
          {status == "success" && (
            <Form.Item
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
                  message: "Vui lòng tải lên hình ảnh",
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
          )}
        </Form>
      </Modal>
    </>
  );
};

export default StatusOrderDelivery;
