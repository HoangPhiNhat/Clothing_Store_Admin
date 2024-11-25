import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PercentageOutlined,
  PieChartOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TruckOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../resources/images/logo.png";
import UserProfile from "./_components/UserProfile";
const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const items = [
    {
      key: "/admin/statistical",
      icon: <PieChartOutlined />,
      label: <Link to="/admin/statistical">Thống kê</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      icon: <TagsOutlined />,
      label: "Danh mục",
      children: [
        {
          key: "/admin/categories",
          label: <Link to="/admin/categories">Danh sách</Link>,
        }
      ],
    },
    {
      icon: <UnorderedListOutlined />,
      label: "Sản phẩm",
      children: [
        {
          key: "/admin/products",
          label: <Link to="/admin/products">Danh sách</Link>,
        },
        {
          key: "/admin/products/trash",
          label: <Link to="/admin/products/trash">Danh sách đã ẩn</Link>,
        },
        {
          key: "/admin/products/variant",
          label: <Link to="/admin/products/variant">Biến thể</Link>,
        },
      ],
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Đơn hàng</Link>,
    },
    {
      key: "/admin/couriers",
      icon: <TruckOutlined />,
      label: <Link to="/admin/couriers">Tài xế</Link>,
    },
    {
      key: "/admin/discounts",
      icon: <PercentageOutlined />,
      label: <Link to={"/admin/discounts"}>Giảm giá</Link>,
    },
  ];

  const handleBreakpoint = (broken) => {
    setIsMobile(broken);
    setCollapsed(broken);
  };

  // Tìm keys của tất cả các menu con đang được mở
  const findOpenKeys = (items) => {
    const openKeys = [];
    const findKeys = (items) => {
      items.forEach((item) => {
        if (item.children) {
          const foundChild = item.children.find(
            (child) => child.key === location.pathname
          );
          if (foundChild) {
            openKeys.push(item.key);
          }
          findKeys(item.children);
        }
      });
    };
    findKeys(items);
    return openKeys;
  };

  return (
    <Layout>
      <Sider
        className="min-h-[100vh]"
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        onBreakpoint={handleBreakpoint}
        theme="light"
      >
        <div className="px-5 py-3">
          <img src={logo} alt="" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={findOpenKeys(items)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="flex justify-between pl-0 "
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <UserProfile />
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            className="h-full"
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
