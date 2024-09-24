import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Popover } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const UserProfile = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearTimeout(interval);
  });
  const content = (
    <List>
      <List.Item>My Account</List.Item>
      <List.Item>Update Password</List.Item>
      <List.Item>
        <Button type="primary"><LogoutOutlined/>Logout
        </Button>
      </List.Item>
    </List>
  );
  return (
    <div className="flex justify-center text-center ">
      <div className="w-[150px] text-red-600">{`${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`}</div>
      <div>
        <Popover content={content} placement="bottomRight" title="Welcome">
          <Avatar size={44} icon={<UserOutlined />} />
        </Popover>
      </div>
    </div>
  );
};

export default UserProfile;
