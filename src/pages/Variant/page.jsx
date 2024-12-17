import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useState } from "react";
import useColorMutation from "../../hooks/Color/useColorMutation";
import useColorQuery from "../../hooks/Color/useColorQuery";
import useSizeMutation from "../../hooks/Size/useSizeMutation";
import useSizeQuery from "../../hooks/Size/useSizeQuery";
import CreateColor from "./_components/Color/CreateColor";
import UpdateColor from "./_components/Color/UpdateColor";
import CreateSize from "./_components/Size/CreateSize";
import UpdateSize from "./_components/Size/UpdateSize";

const Variant = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalState, setModalState] = useState({
    open: false,
    type: null,
  });
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [deletingColorId, setDeletingColorId] = useState(null);
  const [deletingSizeId, setDeletingSizeId] = useState(null);

  const { data: colors, isLoading: colorLoading } = useColorQuery(
    "GET_ALL_COLOR",
    null
  );
  const { data: sizes, isLoading: sizeLoading } = useSizeQuery(
    "GET_ALL_SIZE",
    null
  );

  const { mutate: deleteColor } = useColorMutation({
    action: "DELETE",
    onSuccess: () => {
      messageApi.success("Xóa màu sắc thành công.");
      setDeletingColorId(null);
    },
    onError: (error) => {
      message.error("Xóa màu sắc thất bại: " + error.response.data.message);
      setDeletingColorId(null);
    },
  });

  const { mutate: deleteSize } = useSizeMutation({
    action: "DELETE",
    onSuccess: () => {
      messageApi.success("Xóa kích thước thành công.");
      setDeletingSizeId(null);
    },
    onError: (error) => {
      message.error("Xóa kích thước thất bại: " + error.response.data.message);
      setDeletingSizeId(null);
    },
  });

  const openModal = (type, variant = null) => {
    setModalState({ open: true, type });
    setSelectedVariant(variant);
  };

  const closeModal = () => {
    setModalState({ open: false, type: null });
    setSelectedVariant(null);
  };

  const dataColors = colors?.map((color, index) => ({
    key: color.id,
    index: index + 1,
    ...color,
  }));
  const dataSizes = sizes?.map((size, index) => ({
    key: size.id,
    index: index + 1,
    ...size,
  }));

  const colorColumns = [
    {
      title: "ID",
      dataIndex: "key",
      width: "20%",
    },
    {
      title: "Tên màu sắc",
      dataIndex: "name",
      width: "50%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, color) => (
        <Space size="small">
           <Tooltip title="Cập nhật.">
          <Button
            disabled={deletingColorId === color.id}
            onClick={() => openModal("updateColor", color)}
          >
            <EditOutlined />
          </Button>
           </Tooltip>
          <Popconfirm
            title="Xóa màu sắc"
            description="Bạn có muốn xóa màu sắc này không?"
            okText={deletingColorId === color.id ? `Đang xóa` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              deleteColor(color.id);
              setDeletingColorId(color.id);
            }}
          >
             <Tooltip title="Xóa.">
            <Button
              type="primary"
              danger
              loading={deletingColorId === color.id}
            >
              <DeleteOutlined />
            </Button>
             </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const sizeColumns = [
    {
      title: "ID",
      dataIndex: "key",
      width: "20%",
    },
    {
      title: "Tên kích thước",
      dataIndex: "name",
      width: "50%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, size) => (
        <Space size="small">
          <Tooltip title="Cập nhật.">
            <Button
              disabled={deletingSizeId === size.id}
              onClick={() => {
                openModal("updateSize", size);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Xóa kích thước"
            description="Bạn có muốn xóa kích thước này không?"
            okText={deletingSizeId === size.id ? `Đang xóa` : `Có`}
            cancelText="Không"
            onConfirm={() => {
              deleteSize(size.id);
              setDeletingSizeId(size.id);
            }}
          >
            <Tooltip title="Xóa.">
              <Button
                type="primary"
                danger
                loading={deletingSizeId === size.id}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Danh sách thuộc tính</a>,
          },
        ]}
      />
      <h1 className="text-2xl font-medium mb-2">Quản lý thuộc tính</h1>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {/* Bảng Color */}
        <div className="bg-white shadow-md rounded-lg p-4 h-fit">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Màu sắc</h2>
            <Button type="primary" onClick={() => openModal("createColor")}>
              <PlusCircleOutlined />
              Thêm màu sắc
            </Button>
          </div>
          {colorLoading ? (
            <Spin className="flex justify-center h-fit" />
          ) : (
            <Table
              size="small"
              dataSource={dataColors}
              columns={colorColumns}
              rowKey="id"
              pagination={false}
              className="custom-table"
            />
          )}
        </div>
        {/* Bảng Size */}
        <div className="bg-white shadow-md rounded-lg p-4 h-fit">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Kích thước</h2>
            <Button type="primary" onClick={() => openModal("createSize")}>
              <PlusCircleOutlined />
              Thêm kích thước
            </Button>
          </div>
          {sizeLoading ? (
            <Spin className="flex justify-center h-fit" />
          ) : (
            <Table
              size="small"
              dataSource={dataSizes}
              columns={sizeColumns}
              rowKey="id"
              pagination={false}
              className="custom-table"
            />
          )}
        </div>
      </div>
      {modalState.type === "createColor" && (
        <CreateColor open={modalState.open} onCancel={closeModal} />
      )}
      {modalState.type === "updateColor" && (
        <UpdateColor
          open={modalState.open}
          onCancel={closeModal}
          color={selectedVariant}
        />
      )}
      {modalState.type === "createSize" && (
        <CreateSize open={modalState.open} onCancel={closeModal} />
      )}
      {modalState.type === "updateSize" && (
        <UpdateSize
          open={modalState.open}
          onCancel={closeModal}
          size={selectedVariant}
        />
      )}
    </>
  );
};

export default Variant;
