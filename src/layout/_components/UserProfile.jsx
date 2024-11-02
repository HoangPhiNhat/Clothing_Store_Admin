import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Popover } from "antd";

const UserProfile = () => {
const user = JSON.parse(localStorage.getItem("user"));
const name = user?.name;

  const content = (
    <List>
      <List.Item>My Account</List.Item>
      <List.Item>Update Password</List.Item>
      <List.Item>
        <Button type="primary">
          <LogoutOutlined />
          Logout
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
