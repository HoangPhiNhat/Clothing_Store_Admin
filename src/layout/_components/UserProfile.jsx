import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Popover } from "antd";
import { logout } from "../../services/auth";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name;
  const handleLogout = async () => {
    await logout();
  };

  const content = (
    <List>
      <List.Item>
        <Button type="primary" onClick={() => handleLogout()}>
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
        <Popover content={content} placement="bottomRight" title="Welcome">
          <Avatar size={44} icon={<UserOutlined />} />
        </Popover>
      </div>
    </div>
  );
};

export default UserProfile;
