import { Button, Result } from "antd";
const Page403 = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không được phép truy cập trang này."
      extra={<Button type="primary">Trở về</Button>}
    />
  );
};
export default Page403;
