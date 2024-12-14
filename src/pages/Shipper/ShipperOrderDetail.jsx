/* eslint-disable react/prop-types */
import { Modal, Table } from "antd";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const ShipperOrderDetail = ({ open, onCancel, products }) => {
  const { styles } = useStyle();

  const dataSource = products.map((product) => ({
    key: product.id,
    ...product,
  }));
  
  const columns = [
    {
      title: "Ảnh",
      key: "img",
      render: (_, product) => (
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-24 h-24 object-cover"
        />
      ),
      with: "15%",
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      with: "45%",
      render: (_, product) =>
        `${product.product_name}- Kích cỡ : ${product.size} - Màu : ${product.color}`,
    },
    {
      title: "Số lượng",
      key: "quantity",
      with: "10%",
      dataIndex: "quantity",
    },
  ];

  console.log(dataSource);

  return (
    <Modal
      title="Danh sách sản phẩm"
      open={open}
      onCancel={onCancel}
      className="max-w-4xl w-full"
      footer={false}
    >
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{
          //   x: "max-content",x
          y: 55 * 5,
        }}
      />
    </Modal>
  );
};

export default ShipperOrderDetail;
