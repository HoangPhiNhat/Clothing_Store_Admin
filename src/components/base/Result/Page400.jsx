import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const Page400 = () => {
  return (
    <Result
      icon={<span style={{ fontSize: 72 }}>🚫</span>}
      title="400"
      subTitle="Sorry, the request is invalid."
      extra={
        <Link to="/">
          <Button type="primary">Back to Home</Button>
        </Link>
      }
    />
  );
};

export default Page400;
