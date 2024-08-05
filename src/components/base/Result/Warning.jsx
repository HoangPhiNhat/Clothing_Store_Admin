import { Button, Result } from "antd";
const Warming = () => {
  return (
    <Result
      status="warning"
      title="There are some problems with your operation."
      extra={
        <Button type="primary" key="console">
          Go Console
        </Button>
      }
    />
  );
};
export default Warming;
