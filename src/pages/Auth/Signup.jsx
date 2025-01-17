/* eslint-disable no-unused-vars */
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import useAutoFocus from "../../hooks/customHook/useAutoFocus";
import { signUp } from "../../services/auth";

const SignUp = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const inputRef = useAutoFocus(open);

  const onFinish = async (values) => {
    try {
      const response = await signUp(values);
      console.log(response);
      messageApi.success(response.message);
    } catch (error) {
      messageApi.error(error.response.data.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    messageApi.error("Signup fail");
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="p-8 bg-white rounded-lg shadow-lg w-full max-w-lg"
          style={{ maxWidth: 400 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Đăng kí</h2>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Tên" ref={inputRef} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Confirm passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Register
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span> Already have an account? </span>
            <Link to="/signin">Log in</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
