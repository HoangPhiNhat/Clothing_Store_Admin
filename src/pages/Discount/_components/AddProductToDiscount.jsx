/* eslint-disable no-unused-vars */
import { Breadcrumb, Button, Form, Input, message, Pagination, Select, Table } from "antd";
import { useEffect, useState } from "react";
import Loading from "../../../components/base/Loading/Loading";
import useCategoryQuery from "../../../hooks/Category/useCategoryQuery";
import { getAllProductForAddDiscount } from "../../../services/discount";
import { formatMoney } from "../../../systems/utils/formatMoney";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import useDisCountMutation from "../../../hooks/Discount/useDiscountMutation";

const AddProductToDiscount = () => {
  const [search, setSearch] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [products, setProducts] = useState();
  const [page, setPage] = useState(1);
  const [productsId, setProductsId] = useState([]);
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  //Filter
  const { data: categories, isLoading: isLoadingCategories } = useCategoryQuery(
    "GET_ALL_CATEGORY_FOR_PRODUCT"
  );

  useEffect(() => {
    const featchProducts = async () => {
      if (!search) return;
      try {
        setIsLoadingProducts(true);
        const data = await getAllProductForAddDiscount(page, search);
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    featchProducts();
  }, [page, search]);

  const dataSource = (products?.data.data || []).map((product, index) => ({
    key: product.id,
    index: index + 1,
    ...product,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Ảnh",
      key: "image",
      render: (_, product) => <img src={product.thumnail} />,
      width: "30%",
    },
    {
      title: "Giá bán",
      key: "price",
      render: (_, product) => `${formatMoney(product.regular_price)}đ`,
      width: "15%",
    },
    {
      title: "Số lượng còn trong kho",
      key: "total_stock_quantity",
      dataIndex: "total_stock_quantity",
      width: "20%",
    },
  ];

  const onFinish = (value) => {
    setPage(1);
    setSearch(value);
  };

  //AddProduct
  const { mutate: addProduct, isPending } = useDisCountMutation({
    action: "CREATE_PRODUCT_FOR_DISCOUNT",
    onSuccess: () => {
      messageApi.success("Thêm sản phẩm cho chiến dịch thành công.");
    },
    onError: (error) => {
      messageApi.error(
        "Thêm sản phẩm cho chiến dịch thất bại. " + error.response.data.message
      );
    },
  });

  const rowSelection = {
    productsId,
    onChange: (selectedKeys) => {
      setProductsId(selectedKeys);
    },
  };

  const onAddProduct = () => {
    addProduct({ product_id: productsId, id: id });
  };

  if (isLoadingCategories) return <Loading />;

  return (
    <>
      {contextHolder}
      <div>
        <Breadcrumb
          items={[
            {
              title: "Trang chủ",
            },
            {
              title: <a href="">Thêm sản phẩm vào chiến dịch</a>,
            },
          ]}
        />
        <h2 className="text-2xl font-medium">Lọc sản phẩm</h2>
        <div>
          <Form name="basic" layout="vertical" onFinish={onFinish}>
            <div className="flex flex-wrap gap-4">
              <Form.Item
                label="Giá tối thiểu"
                name="minPrice"
                className="flex-1 min-w-[200px]"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giá tối đa"
                name="maxPrice"
                className="flex-1 min-w-[200px]"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số lượng tồn kho tối thiểu"
                name="minStockQuantity"
                className="flex-1 min-w-[200px]"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số lượng tồn kho tối đa"
                name="maxStockQuantity"
                className="flex-1 min-w-[200px]"
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Form.Item
                className="flex-1 min-w-[200px]"
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn danh mục"
                  optionFilterProp="children"
                  options={categories?.data?.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                className="flex-1 min-w-[200px]"
              >
                <Input />
              </Form.Item>

              <Button htmlType="submit" type="primary" disabled={isPending}>
                Tìm kiếm
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl">Chi tiết chiến dịch giảm giá</h1>
          <Button
            type="primary"
            disabled={productsId.length == 0}
            onClick={() => onAddProduct()}
          >
            <PlusCircleOutlined />
            Thêm sản phẩm vào chiến dịch
          </Button>
        </div>
        <Table
          loading={isLoadingProducts}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowSelection={{
            ...rowSelection,
          }}
        />
        {products && (
          <Pagination
            current={page}
            disabled={isLoadingProducts || isPending}
            className="mt-5"
            align="end"
            total={products.data.total}
            pageSize={5}
            onChange={(page) => setPage(page)}
          />
        )}
      </div>
    </>
  );
};

export default AddProductToDiscount;
