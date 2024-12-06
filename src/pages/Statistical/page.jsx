import {
  ClockCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Select, Row, Col, Tag, Button, Radio } from "antd";
import { Line, Column } from "@ant-design/charts";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../../services/dashboard";
import { formatMoney } from "../../systems/utils/formatMoney";

const { Option } = Select;

const Statistical = () => {
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
  console.log(data);

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
    data: data?.statistics,
    xField: "day",
    yField: "revenue",
    smooth: true,
    lineStyle: { stroke: "#3f8600", lineWidth: 5 },
  };

  const ordersConfig = {
    data: data?.statistics,
    xField: "day",
    yField: "orders",
    columnStyle: { fill: "#3f86f8" },
  };

  const customersConfig = {
    data: data?.statistics,
    xField: "day",
    yField: "customers",
    columnStyle: { fill: "#fa8c16" },
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
  const TimelineData = [
    { status: "Pending", id: "#303822", time: "6 hours ago", color: "orange" },
    {
      status: "Delivered",
      id: "#474038",
      time: "6 hours ago",
      color: "green",
    },
    {
      status: "On the way",
      id: "#357211",
      time: "6 hours ago",
      color: "blue",
    },
    {
      status: "On the way",
      id: "#731863",
      time: "7 hours ago",
      color: "blue",
    },
    { status: "Cancelled", id: "#142463", time: "11 hours ago", color: "red" },
  ];

  const orders = [
    {
      id: "#303822",
      name: "Jayden Champlin",
      address: "11844 Kassulke Corner, Brooklyn, NY 111",
      items: ["Waldorf Salad x1", "Duck x1", "Pork x1"],
      total: "$56.00",
    },
    {
      id: "#756065",
      name: "Geovany Ledner",
      address: "11332 Alta Radial, Lindenhurst, NY 11526",
      items: ["Fish Burger x1", "Sprite x1", "Chicken Alfredo x1"],
      total: "$26.00",
    },
  ];

  const trendingProducts = [
    { name: "Cannelloni", orders: 53, revenue: "$821.50", rank: 1 },
    { name: "Cheesecake", orders: 51, revenue: "$408.00", rank: 2 },
    { name: "Bruschetta", orders: 50, revenue: "$350.00", rank: 3 },
  ];
  return (
    <div className="p-6">
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

      <Row>
        <Col span={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  <ClockCircleOutlined />
                </span>
                <span>Timeline</span>
              </div>
            }
            className="w-full"
          >
            {TimelineData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <Tag color={item.color} className="capitalize">
                  {item.status}
                </Tag>
                <span className="font-medium">{item.id}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>Recent Orders</span>
              </div>
            }
            className="w-full"
          >
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-3 border-b last:border-0"
              >
                <div>
                  <span className="block text-lg font-semibold">
                    {order.id}
                  </span>
                  <span className="block text-gray-500">{order.name}</span>
                  <span className="block text-gray-400">{order.address}</span>
                </div>
                <div>
                  {order.items.map((item, idx) => (
                    <span key={idx} className="block text-gray-500">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">{order.total}</span>
                  <Button type="text" className="ml-2">
                    ...
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span>Trending Products</span>
              </div>
            }
            className="w-full"
          >
            {trendingProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-orange-500">
                    #{product.rank}
                  </span>
                  <span>{product.name}</span>
                </div>
                <div>
                  <span className="block font-medium">{product.revenue}</span>
                  <span className="block text-gray-500">
                    Ordered {product.orders} times
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistical;
