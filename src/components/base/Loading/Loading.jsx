import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <Spin
      delay={1000}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 90,
          }}
          spin
        />
      }
    />
  </div>
);
export default Loading;
