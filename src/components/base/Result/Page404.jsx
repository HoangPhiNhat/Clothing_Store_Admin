import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const Page404 = () => {
  return (
    <Result
      status="404"
      title="404"
      iconFontSize="120"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Link to={"/admin"}>
          <Button type="primary">Trở về</Button>
        </Link>
      }
    />
  );
};
export default Page404;
