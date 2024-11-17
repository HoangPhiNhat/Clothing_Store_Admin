import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const Page401 = () => {
  return (
    <Result
      icon={<span style={{ fontSize: 72 }}>🔒</span>}
      title="401"
      subTitle="Sorry, you are not authorized to view this page."
      extra={
        <Link to="/signin">
          <Button type="primary">Sign In</Button>
        </Link>
      }
    />
  );
};

export default Page401;
