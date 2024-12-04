import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Popover, Switch } from "antd";
import {
  getStatusShipper,
  logout,
  updateStatusShipper,
} from "../../services/auth";
import { useState, useEffect } from "react";

const ShipperProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name;

  const [status, setStatus] = useState(false); // Trạng thái shipper: online/offline

  // Lấy trạng thái hiện tại của shipper
  const fetchStatus = async () => {
    try {
      const res = await getStatusShipper();
      setStatus(res.data[0] === "online");
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // Cập nhật trạng thái shipper
  const updateStatus = async () => {
    try {
      const newStatus = status ? "offline" : "online"; // Đảo trạng thái
      await updateStatusShipper(newStatus);
      setStatus(!status); // Cập nhật lại trạng thái cục bộ
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  // Đăng xuất
  const handleLogout = async () => {
    await updateStatusShipper("offline");
    await logout();
  };

  // Lấy trạng thái khi component được mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const content = (
    <List>
      <List.Item>
        <Switch
          onClick={updateStatus}
          checked={status}
          unCheckedChildren="Hoạt động"
          checkedChildren="Ngừng hoạt động"
        />
      </List.Item>
      <List.Item>
        <Button type="primary" onClick={handleLogout}>
          <LogoutOutlined />
          Đăng xuất
        </Button>
      </List.Item>
    </List>
  );

  return (
    <div className="flex justify-center text-center items-center gap-4">
      <div className="inline font-normal text-lg">{name}</div>
      <div className="flex items-center">
        <Popover content={content} placement="bottomRight">
          <Avatar size={44} icon={<UserOutlined />} />
        </Popover>
      </div>
    </div>
  );
};

export default ShipperProfile;
