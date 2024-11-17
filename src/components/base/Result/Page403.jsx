import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const Page403 = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không được phép truy cập trang này."
      extra={
        <Link to={"/admin"}>
          <Button type="primary">Quay lại</Button>
        </Link>
      }
    />
  );
};
export default Page403;
