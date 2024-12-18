import { Column, Line } from "@ant-design/charts";
import {
  ClockCircleOutlined,
  RiseOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Card, Col, Radio, Row, Select, Table } from "antd";
import { useState } from "react";
import {
  fetchDashboardData,
  fetchOrders,
  // fetchTimeLine,
  trendingProduct,
} from "../../services/dashboard";
import { formatMoney } from "../../systems/utils/formatMoney";
import { createStyles } from "antd-style";
// import { formatTime } from "../../systems/utils/formatDate";
import { Link } from "react-router-dom";
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
const { Option } = Select;

const Statistical = () => {
  const { styles } = useStyle();
  const [timePeriod, setTimePeriod] = useState("week"); // 'week' hoặc 'month'
  const [value, setValue] = useState(() => {
    // Set default value to current month if timePeriod is "month"
    return timePeriod === "month" ? new Date().getMonth() + 1 : "current";
  });

  // Gọi API với React Query
  const { data } = useQuery({
    queryKey: ["dashboard", timePeriod, value],
    queryFn: () => fetchDashboardData(timePeriod, value),
  });

  // const { data: timeLines, isLoading: timeLineLoading } = useQuery({
  //   queryKey: ["timeline"],
  //   queryFn: () => fetchTimeLine(),
  // });

  const { data: trendingProducts, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => trendingProduct(),
  });

  const { data: orders, isLoading: orderLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  const statistics = (data?.statistics || []).map((item) => ({
    day: item.day,
    "Doanh thu": item.revenue,
    "Đơn hàng": item.orders,
    "Khách hàng": item.customers,
  }));

  const handleSelectChange = (value) => {
    if (value === "Tuần này") {
      setTimePeriod("week");
      setValue("current");
    } else if (value === "Tuần trước") {
      setTimePeriod("week");
      setValue("last");
    }
  };

  const revenueConfig = {
    data: statistics,
    xField: "day",
    yField: "Doanh thu",
    smooth: true,
    lineStyle: { stroke: "#3f8600", lineWidth: 5 },
  };

  const ordersConfig = {
    data: statistics,
    xField: "day",
    yField: "Đơn hàng",
    smooth: true,
    lineStyle: { stroke: "#3f8600", lineWidth: 4 },
    columnStyle: { fill: "#3f86f8" },
  };

  const customersConfig = {
    data: statistics,
    xField: "day",
    yField: "Khách hàng",
    smoothL: true,
    lineStyle: { stroke: "#3f8600", lineWidth: 3 },
    columnStyle: { fill: "#3f86f8" },
  };

  const handleTimePeriodChange = (e) => {
    const newTimePeriod = e.target.value;
    setTimePeriod(newTimePeriod);
    if (newTimePeriod === "month") {
      // Set the default value to the current month when timePeriod is month
      setValue(new Date().getMonth() + 1);
    } else {
      setValue("current");
    }
  };

  const handleValueChange = (value) => {
    setValue(value);
  };

  // const columnTimeLine = [
  //   {
  //     title: () => (
  //       <div>
  //         <span className="text-red-500">
  //           <ClockCircleOutlined />
  //         </span>{" "}
  //         Dòng thời gian
  //       </div>
  //     ),
  //     children: [
  //       {
  //         title: "Trạng thái",
  //         width: 150,
  //         render:(_, time)=>(
  //           <Tag color={time.color}>{time.status}</Tag>
  //         )
  //       },
  //       {
  //         title: "Mã đơn hàng",
  //         dataIndex: "order_code",
  //         width: 150,
  //         render: (_, tine) => (
  //           <Link to={`orders/${tine.id}`}>
  //             <div className="font-semibold text-[#1f1f1f]">
  //               #{tine.order_code}
  //             </div>
  //           </Link>
  //         ),
  //       },
  //       {
  //         title: "Thời gian",
  //         dataIndex: "time",
  //         render: (time) => formatTime(time),
  //       },
  //     ],
  //   },
  // ];

  // const dataSourceTimeLine = (timeLines || []).map((timeline, index) => ({
  //   key: timeline.id,
  //   index: index + 1,
  //   ...timeline,
  // }));

  const columnOrder = [
    {
      title: () => (
        <div>
          <span className="text-red-500">
            <ShoppingOutlined />
          </span>{" "}
          Đơn hàng gần đây
        </div>
      ),
      children: [
        {
          title: "Mã đơn hàng",
          width: 110,
          render: (_, order) => (
            <Link to={`orders/${order.id}`}>
              <div className="font-semibold text-[#1f1f1f]">
                #{order.order_code}
              </div>
            </Link>
          ),
        },
        {
          title: "Khách hàng",
          width: 170,
          render: (_, order) => (
            <div>
              <div>{order.name}</div>
              <div className="text-[#8c8c8c] text-xs">
                {" "}
                {order.address.length > 10
                  ? `${order.address.slice(0, 18)}...`
                  : order.address}
              </div>
            </div>
          ),
        },
        {
          title: "Sản phẩm",
          width: 240,
          render: (_, order) => (
            <div>
              <div>
                {order?.items.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Tổng tiền",
          render: (_, order) => (
            <div className="text-[#1f1f1f]">{formatMoney(order.total)} Vnđ</div>
          ),
        },
      ],
    },
  ];

  const dataSourceOrder = (orders?.data || []).map((order, index) => ({
    key: order.id,
    index: index + 1,
    ...order,
  }));

  const columnTrending = [
    {
      title: () => (
        <div>
          <span className="text-red-500">
            <RiseOutlined />
          </span>{" "}
          Sản phẩm nổi bật
        </div>
      ),
      children: [
        {
          title: "Xếp hạng",
          dataIndex: "rank",
          width: "20%",
          render: (rank) => (
            <div
              className={`text-2xl font-medium ${
                rank === 1
                  ? "text-yellow-500 font-extrabold"
                  : rank === 2
                  ? "text-green-500 font-bold"
                  : rank === 3
                  ? "text-blue-500 font-semibold"
                  : rank === 4
                  ? "text-gray-500 font-medium"
                  : "text-red-500 font-normal"
              }`}
            >
              #{rank} {rank <= 3 ? "🏆" : ""}
            </div>
          ),
        },
        {
          title: "Tên sản phẩm",
          dataIndex: "name",
          width: "50%",
          render: (_, product) => (
            <Link to={`/admin/products/${product.product_id}/attributes`}>
              <div className="font-semibold text-xl text-[#1f1f1f]">
                {product.name}
              </div>
            </Link>
          ),
        },
        {
          title: "Tổng",
          width: "30%",
          dataIndex: "revenue",
          render: (_, product) => (
            <div className="text-[#8c8c8c]">
              <div>{formatMoney(product.revenue)} Vnđ</div>
              <div className="">
                Đặt hàng{" "}
                <span className="font-semibold text-[#1f1f1f]">
                  {product.orders}
                </span>{" "}
                lượt
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  const dataSourceTrending = (trendingProducts || []).map(
    (timeline, index) => ({
      key: timeline.id,
      index: index + 1,
      ...timeline,
    })
  );
  return (
    <div className="">
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="">Thống kê</a>,
          },
        ]}
      />

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Tổng quan</h2>
        <div className="flex gap-5">
          <label>
            <Radio
              value="week"
              checked={timePeriod === "week"}
              onChange={handleTimePeriodChange}
            />
            Tuần
          </label>
          <label>
            <Radio
              value="month"
              checked={timePeriod === "month"}
              onChange={handleTimePeriodChange}
            />
            Tháng
          </label>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        {timePeriod === "month" && (
          <Select className="w-28" onChange={handleValueChange} value={value}>
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </Option>
            ))}
          </Select>
        )}
        {timePeriod === "week" && (
          <Select
            defaultValue="Tuần này"
            className="w-28"
            onChange={handleSelectChange}
          >
            <Option value="Tuần trước">Tuần trước</Option>
            <Option value="Tuần này">Tuần này</Option>
          </Select>
        )}
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        {/* Daily Revenue */}
        <Col span={8}>
          <Card className="shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-red-500">
                  <ClockCircleOutlined />
                </span>
                <span className="text-gray-500">Doanh thu</span>
              </div>
              <div>
                <span
                  style={{
                    color: "#7b7474",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {formatMoney(data?.total_revenue) || "0"} VNĐ
                </span>
              </div>
            </div>
            <Line {...revenueConfig} height={300} />
          </Card>
        </Col>

        {/* Daily Orders */}
        <Col span={8}>
          <Card className="shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-red-500">
                  <ShoppingOutlined />
                </span>
                <span className="text-gray-500">Đơn hàng</span>
              </div>
              <div>
                <span
                  style={{
                    color: "#7b7474",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {data?.total_orders || "0"}
                </span>
              </div>
            </div>
            <Column {...ordersConfig} height={300} />
          </Card>
        </Col>

        {/* New Customers */}
        <Col span={8}>
          <Card className="shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-red-500">
                  <UserOutlined />
                </span>
                <span className="">Khách hàng</span>
              </div>
              <div>
                <span
                  style={{
                    color: "#7b7474",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {data?.total_customers || "0"}
                </span>
              </div>
            </div>
            <Column {...customersConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        {/* <Col span={7}>
          <Table
            className={styles.customTable}
            columns={columnTimeLine}
            dataSource={dataSourceTimeLine}
            pagination={false}
            loading={timeLineLoading}
            scroll={{
              y: 55 * 7,
            }}
          />
        </Col> */}
        <Col span={12}>
          <Table
            className={styles.customTable}
            columns={columnOrder}
            dataSource={dataSourceOrder}
            pagination={false}
            loading={orderLoading}
            scroll={{
              y: 55 * 7,
            }}
          />
        </Col>
        <Col span={12}>
          <Table
            className={styles.customTable}
            columns={columnTrending}
            dataSource={dataSourceTrending}
            pagination={false}
            loading={trendingLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Statistical;
