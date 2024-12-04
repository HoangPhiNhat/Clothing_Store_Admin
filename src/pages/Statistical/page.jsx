import { ClockCircleOutlined } from "@ant-design/icons";
import { Card, Statistic, Select, Row, Col, Tag, Button } from "antd";
import { Line, Column } from "@ant-design/charts";

const { Option } = Select;

// Fake data
const fakeData = [
  { day: "Tue", revenue: 1000, orders: 50, customers: 20 },
  { day: "Wed", revenue: 800, orders: 45, customers: 22 },
  { day: "Thu", revenue: 700, orders: 40, customers: 15 },
  { day: "Fri", revenue: 700, orders: 38, customers: 18 },
  { day: "Sat", revenue: 1100, orders: 50, customers: 30 },
  { day: "Sun", revenue: 1200, orders: 55, customers: 25 },
  { day: "Mon", revenue: 900, orders: 30, customers: 20 },
];

// Chart configurations
const revenueConfig = {
  data: fakeData,
  xField: "day",
  yField: "revenue",
  smooth: true,
  lineStyle: { stroke: "#3f8600", lineWidth: 5 },
};

const ordersConfig = {
  data: fakeData,
  xField: "day",
  yField: "orders",
  columnStyle: { fill: "#3f86f8" },
};

const customersConfig = {
  data: fakeData,
  xField: "day",
  yField: "customers",
  columnStyle: { fill: "#fa8c16" },
};

const TimelineData = [
  { status: "Pending", id: "#303822", time: "6 hours ago", color: "orange" },
  { status: "Delivered", id: "#474038", time: "6 hours ago", color: "green" },
  { status: "On the way", id: "#357211", time: "6 hours ago", color: "blue" },
  { status: "On the way", id: "#731863", time: "7 hours ago", color: "blue" },
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
const Statistical = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <Select defaultValue="Last Week" className="w-40">
          <Option value="Last Week">Last Week</Option>
          <Option value="This Week">This Week</Option>
        </Select>
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
                <span className="text-gray-500">Daily Revenue</span>
              </div>
              <div>
                <span style={{ color: "#3f8600", fontSize: "18px" }}>$80</span>
              </div>
            </div>
            <Line {...revenueConfig} height={300} />
          </Card>
        </Col>

        {/* Daily Orders */}
        <Col span={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Daily Orders"
              value={150}
              valueStyle={{ color: "#3f86f8" }}
            />
            <Column {...ordersConfig} height={300} />
          </Card>
        </Col>

        {/* New Customers */}
        <Col span={8}>
          <Card className="shadow-sm">
            <Statistic
              title="New Customers"
              value="11,000%"
              valueStyle={{ color: "#fa8c16" }}
            />
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
