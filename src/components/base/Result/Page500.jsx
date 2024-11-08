import { Button, Result } from "antd";
const Page500 = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Rất tiếc, đã xảy ra lỗi."
      extra={<Button type="primary">Trở về</Button>}
    />
  );
};
export default Page500;
