import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const Page500 = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Rất tiếc, đã xảy ra lỗi."
      extra={
        <Link to={"/admin"}>
          <Button type="primary">Quay về</Button>
        </Link>
      }
    />
  );
};
export default Page500;
